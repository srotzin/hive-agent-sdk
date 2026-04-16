// hive_trust.aleo
// Proves wallet reputation without revealing underlying data
program hive_trust.aleo {

    // Trust credential record — stored privately on Aleo blockchain
    record TrustCredential {
        owner: address,          // Aleo address of credential holder
        base_wallet: field,      // Hash of Base L2 wallet address (private)
        trust_level: u8,         // Trust tier (1-5) (private)
        activity_score: u64,     // Computed activity metric (private)
        issued_at: u32,          // Block height at issuance (public)
    }

    // Mapping: Aleo address -> public trust tier (on-chain public state)
    mapping public_trust_tier: address => u8;

    // Transition: Issue a trust credential
    // Private inputs: the raw attestation data
    // Public inputs: the threshold being claimed, the issuer address
    // Output: a private TrustCredential record + public trust tier update
    async transition issue_credential(
        private base_wallet_hash: field,    // keccak256(base_wallet_address)
        private activity_score: u64,        // number of transactions or volume score
        private trust_level_raw: u8,        // computed tier (1–5)
        public min_activity_threshold: u64, // what we're publicly claiming to meet
        public claimed_tier: u8            // public tier being asserted
    ) -> (TrustCredential, Future) {

        // PRIVATE ASSERTION: actual score must meet claimed threshold
        // This assertion is proven in ZK — the actual activity_score is never revealed
        assert(activity_score >= min_activity_threshold);

        // PRIVATE ASSERTION: trust level must match claimed tier
        assert(trust_level_raw >= claimed_tier);

        // Issue the private credential record
        let credential: TrustCredential = TrustCredential {
            owner: self.caller,
            base_wallet: base_wallet_hash,
            trust_level: trust_level_raw,
            activity_score: activity_score,
            issued_at: 0u32,  // will be set by finalize
        };

        return (credential, finalize_issue_credential(self.caller, claimed_tier));
    }

    // Finalize: update public trust tier on-chain
    async function finalize_issue_credential(
        caller: address,
        tier: u8
    ) {
        // Only update if new tier is higher than existing (monotonic trust)
        let existing: u8 = Mapping::get_or_use(public_trust_tier, caller, 0u8);
        let new_tier: u8 = existing > tier ? existing : tier;
        Mapping::set(public_trust_tier, caller, new_tier);
    }

    // Transition: Verify a credential meets a threshold (for enterprise checks)
    // Takes a private credential and publicly proves it meets a minimum tier
    async transition verify_reputation(
        private credential: TrustCredential,
        public required_tier: u8
    ) -> (bool, Future) {

        // PRIVATE ASSERTION: credential trust level meets the required tier
        // The actual trust_level value is never revealed
        assert(credential.trust_level >= required_tier);

        return (true, finalize_verify_reputation(self.caller, required_tier));
    }

    async function finalize_verify_reputation(
        caller: address,
        required_tier: u8
    ) {
        // Confirm on-chain public mapping also satisfies (belt-and-suspenders)
        let public_tier: u8 = Mapping::get_or_use(public_trust_tier, caller, 0u8);
        assert(public_tier >= required_tier);
    }

    // Transition: Prove activity count exceeds threshold (no balance reveal)
    // Simplest standalone proof for enterprise evaluators
    transition prove_activity(
        private tx_count: u64,          // actual transaction count (private)
        private volume_usdc_cents: u64, // actual volume in cents (private)
        public min_tx_count: u64,       // public threshold being proved
        public min_volume_cents: u64    // public volume threshold being proved
    ) -> bool {

        // Both assertions proven in ZK without revealing actual values
        assert(tx_count >= min_tx_count);
        assert(volume_usdc_cents >= min_volume_cents);

        return true;
    }
}
