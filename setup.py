from distutils.core import setup
from setuptools import find_packages

setup(
    name="Swagger React Admin Generator",
    version="0.0.1",
    description="Python React Admin Generator using a Swagger Specification.",
    author="David Oberholzer",
    author_email="davidobework@gmail.com",
    license="BSD",
    url="",
    packages=find_packages(exclude=["*.tests", "*.tests.*", "tests.*", "tests"]),
    package_data={
        "templates": ["*.py"]
    },
    requires=[
        "swagger-parser",
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
        "Programming Language :: Python :: 2.7",
        "Programming Language :: Python :: 3.5",
        "Programming Language :: Python :: 3.6",
    ],
    zip_safe=False
)
