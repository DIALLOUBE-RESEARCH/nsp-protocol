import os
from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name='anp-sdk',
    version='0.2.1',
    description='Official Python SDK for the Agent Notification Protocol (ANP) - The universal push protocol for AI Agents.',
    long_description=long_description,
    long_description_content_type="text/markdown",
    author='HyperNatt / DIALLOUBE-RESEARCH',
    author_email='contact@hypernatt.com',
    url='https://github.com/DIALLOUBE-RESEARCH/anp-sdk',
    packages=find_packages(),
    install_requires=[
        'requests>=2.25.1',
        'sseclient-py>=1.7',
        'eth-account>=0.5.9' # For Web3 ECDSA signatures
    ],
    classifiers=[
        'Programming Language :: Python :: 3',
        'License :: OSI Approved :: Apache Software License',
        'Operating System :: OS Independent',
        'Intended Audience :: Developers',
        'Topic :: Communications',
    ],
    python_requires='>=3.8',
)
