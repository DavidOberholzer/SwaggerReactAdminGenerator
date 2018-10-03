from distutils.core import setup
from setuptools import find_packages

setup(
    name="swagger-react-admin-generator",
    version="0.1.3",
    description="Python React Admin Generator using a Swagger Specification.",
    long_description="""
    A python package created to generate a base React Admin client using a predefined swagger specification.
    This package exists to avoid having to hand write the CRUD elements of the Admin and automate the process.
    """,
    author="David Oberholzer",
    author_email="davidobework@gmail.com",
    license="MIT",
    url="",
    packages=find_packages(exclude=["*.tests", "*.tests.*", "tests.*", "tests"]),
    package_data={
        "templates": ["*.py"]
    },
    install_requires=[
        "swagger_parser",
        "click",
        "inflect",
        "jinja2"
    ],
    include_package_data=True,
    dependency_links=[
        "git+https://github.com/praekelt/swagger-parser@master#egg=swagger-parser",
    ],
    tests_require=[],
    classifiers=[
        "Programming Language :: Python",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Intended Audience :: Developers",
        "Topic :: Internet :: WWW/HTTP :: Dynamic Content",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
    ],
    zip_safe=False
)
