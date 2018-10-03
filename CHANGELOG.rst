Changelog
=========

0.1.2
-----
* Added Missing name context for resource files.

0.1.1
-----
* Added missing context of permissions store setting on resource and edit toolbar generation.

0.1.0
-----
* Normal permissions with role generation added with `--permissions` flag set.
* Optional use of `PermissionsStore` added with flag `--permissions_store`.
* Split templates to ones with `permissions` and ones without.
* Util function added for getting if role is permitted in normal permission generation.
* Added auth provider as per React Admin docs.
* Added `get_and_create_directory` function to class to reduce code.
* Updated Documentation.

0.0.4
-----
* First working package version.
* Jinja2 package loader import fixed.

0.0.3
-----
* Missing templates added in MANIFEST.in file

0.0.2
-----
* Updated setup to have a proper package name.

0.0.1
-----
* Generator added using jinja template language.
* Templates added for:
    - Resource files
    - ReactAdmin main app
    - List Filter files
    - View Action Files
    - Supporting auth and layout files
    - Custom DateTime and DateRange Inputs
    - Custom Object Field
* Permissions flag for permissions to be included.
* Documentation added.