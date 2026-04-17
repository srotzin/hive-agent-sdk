"""
hive-beacon — pip/PyPI package setup
"""

from setuptools import find_packages, setup

with open("README.md", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="hive-beacon",
    version="1.0.0",
    author="Steve Rotzin",
    author_email="steve@thehiveryiq.com",
    description=(
        "One-line FastAPI/Flask middleware. Stamp Hive beacon headers on every "
        "response. Your MCP server joins the Hive network automatically."
    ),
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://www.thehiveryiq.com",
    project_urls={
        "Homepage": "https://www.thehiveryiq.com",
        "Source": "https://github.com/srotzin/hive-agent-sdk",
        "Bug Tracker": "https://github.com/srotzin/hive-agent-sdk/issues",
        "Hive Network": "https://hivegate.onrender.com/v1/gate/onboard",
    },
    packages=find_packages(exclude=["tests*", "examples*"]),
    python_requires=">=3.8",
    install_requires=[
        # No hard dependencies — works with stdlib only.
        # starlette/fastapi and flask are optional runtime dependencies;
        # the package imports them lazily so it never forces a framework on you.
    ],
    extras_require={
        "fastapi": ["fastapi>=0.68.0", "starlette>=0.14.0"],
        "flask": ["flask>=2.0.0"],
        "all": ["fastapi>=0.68.0", "starlette>=0.14.0", "flask>=2.0.0"],
        "dev": [
            "pytest>=7.0.0",
            "pytest-asyncio>=0.21.0",
            "httpx>=0.24.0",
            "fastapi>=0.68.0",
            "flask>=2.0.0",
        ],
    },
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "Topic :: Internet :: WWW/HTTP :: WSGI :: Middleware",
        "Topic :: Software Development :: Libraries :: Python Modules",
        "Framework :: FastAPI",
        "Framework :: Flask",
    ],
    keywords=[
        "hive",
        "mcp",
        "a2a",
        "agent",
        "did",
        "w3c",
        "beacon",
        "middleware",
        "settlement",
        "fastapi",
        "flask",
        "starlette",
    ],
    license="MIT",
    include_package_data=True,
)
