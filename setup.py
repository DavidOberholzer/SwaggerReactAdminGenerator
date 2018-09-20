from distutils.core import setup
from setuptools import find_packages

setup(
    name="Swagger React Admin Generator",
    version="0.0.1",
    description="Python React Admin Generator using a Swagger Specification.",
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
    dependency_links=[
        "git+https://github.com/praekelt/swagger-parser@master#egg=swagger-parser",
    ],
    tests_require=[],
    classifiers=[
        "Programming Language :: Python",
        "License :: OSI Approved :: BSD License",
        "Operating System :: OS Independent",
        "Intended Audience :: Developers",
        "Topic :: Internet :: WWW/HTTP :: Dynamic Content",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
    ],
    zip_safe=False
)
