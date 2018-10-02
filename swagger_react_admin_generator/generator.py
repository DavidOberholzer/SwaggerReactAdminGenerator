import click
import inflect
import jinja2
import os

words = inflect.engine()

from swagger_parser import SwaggerParser

DEFAULT_OUTPUT_DIR = "./generated"
DEFAULT_MODULE = "generated"

# Known extensions in lowercase
YAML_EXTENSIONS = ["yaml", "yml"]
JSON_EXTENSIONS = ["json"]

# Choices provided when specifying the specification format
SPEC_JSON = "json"
SPEC_YAML = "yaml"
SPEC_CHOICES = [SPEC_JSON, SPEC_YAML]

VALID_OPERATIONS = {
    "list": {
        "head": "List",
        "imports": ["List", "Datagrid"]
    },
    "read": {
        "head": "Show",
        "imports": ["Show", "SimpleShowLayout"]
    },
    "create": {
        "head": "Create",
        "imports": ["Create", "SimpleForm"]
    },
    "update": {
        "head": "Edit",
        "imports": ["Edit", "SimpleForm"]
    },
    "delete": {
        "head": "Delete",
        "imports": [],
        "def": "None"
    }
}

INPUT_COMPONENT_MAPPING = {
    "array": "TextInput",
    "boolean": "BooleanInput",
    "date": "DateInput",
    "enum": "SelectInput",
    "integer": "NumberInput",
    "many": "ReferenceManyField",
    "object": "LongTextInput",
    "relation": "ReferenceInput",
    "string": "TextInput"
}

FIELD_COMPONENT_MAPPING = {
    "boolean": "BooleanField",
    "date": "DateField",
    "date-time": "DateField",
    "enum": "SelectField",
    "integer": "NumberField",
    "many": "ReferenceManyField",
    "relation": "ReferenceField",
    "string": "TextField",
    "uri": "UrlField"
}

SUPPORTED_COMPONENTS = {
    "list": "list",
    "read": "show",
    "create": "create",
    "update": "edit"
}

ADDITIONAL_FILES = {
    "root": ["theme.js", "MyLayout.js", "customRoutes.js"],
    "fields": ["EmptyField.js", "ObjectField.js"],
    "inputs": ["DateRangeInput.js", "DateTimeInput.js"]
}

PERMISSION_ADDITIONAL_FILES = {
    "pages": ["NoPermissions.js"]
}

CUSTOM_PROPS = {
    "date-time-range": {
        "style": "{{ marginRight: 10, marginBottom: 8 }}",
        "time": None
    }
}

CUSTOM_IMPORTS = {
    "object": {
        "name": "ObjectField",
        "directory": "../fields/ObjectField"
    },
    "date-range": {
        "name": "DateRangeInput",
        "directory": "../inputs/DateRangeInput"
    },
    "date-time": {
        "name": "DateTimeInput",
        "directory": "../inputs/DateTimeInput"
    },
    "date-time-range": {
        "name": "DateRangeInput",
        "directory": "../inputs/DateRangeInput"
    },
    "empty": {
        "name": "EmptyField",
        "directory": "../fields/EmptyField"
    },
    "permissions": {
        "name": "PermissionsStore",
        "directory": "../auth/PermissionsStore"
    }
}


def render_to_string(filename: str, context: dict):
    """
    Render a template using the specified context
    :param filename: The template name
    :param context: The data to use when rendering the template
    :return: The rendered template as a string
    """
    template_directory = "./swagger_react_admin_generator/templates"
    loaders = [jinja2.FileSystemLoader(template_directory)]
    try:
        import swagger_react_admin_generator
        loaders.append(
            jinja2.PackageLoader("swagger_react_admin_generator", "templates")
        )
    except ImportError:
        pass

    return jinja2.Environment(
        loader=jinja2.ChoiceLoader(loaders),
        trim_blocks=True,
        lstrip_blocks=True
    ).get_template(filename).render(context)


class Generator(object):

    def __init__(self, verbose: bool, output_dir=DEFAULT_OUTPUT_DIR,
                 module_name=DEFAULT_MODULE, permissions=False, permissions_store=False):
        self.parser = None
        self._resources = None
        self.verbose = verbose
        self.output_dir = output_dir
        self.module_name = module_name
        self._currentIO = None
        self.page_details = None
        self.permissions = permissions or permissions_store
        self.permissions_store = permissions_store
        self._directories = set([])

    def load_specification(self, specification_path: str, spec_format: str):
        """
        This function will load the swagger specification using the swagger_parser.
        The function will automatically call the `_init_class_resources` after.
        :param specification_path: The path where the swagger specification is located.
        :param spec_format: The file format of the specification.
        """
        # If the swagger spec format is not specified explicitly, we try to
        # derive it from the specification path
        if not spec_format:
            filename = os.path.basename(specification_path)
            extension = filename.rsplit(".", 1)[-1]
            if extension in YAML_EXTENSIONS:
                spec_format = SPEC_YAML
            elif extension in JSON_EXTENSIONS:
                spec_format = SPEC_JSON
            else:
                raise RuntimeError("Could not infer specification format. Use "
                                   "--spec-format to specify it explicitly.")

        click.secho(f"Using spec format '{spec_format}'", fg="green")
        if spec_format == SPEC_YAML:
            with open(specification_path, "r") as f:
                self.parser = SwaggerParser(swagger_yaml=f)
        else:
            self.parser = SwaggerParser(swagger_path=specification_path)

        self._init_class_resources()

    def _get_definition_from_ref(self, definition: dict):
        """
        Get the swagger definition from a swagger reference declaration in the spec.
        :param definition: The definition containing the reference declaration.
        :return: The definition pointed to by the ref and the title
        """
        if "$ref" in definition:
            definition_name = \
                self.parser.get_definition_name_from_ref(definition["$ref"])

            title = definition_name.replace("_", " ").title().replace(" ", "")
            return self.parser.specification["definitions"][definition_name], title
        else:
            title = next(iter(definition)).replace(" ", " ").title().replace(" ", "")
            return definition, title

    def _get_parameter_from_ref(self, parameter: dict):
        """
        Get the parameter definition from a swagger reference declaration in the spec.
        :param parameter: The definition containing the reference declaration.
        :return: The parameter pointed to by the ref
        """
        # If the parameter is a reference, get the actual parameter.
        if "$ref" in parameter:
            ref = parameter["$ref"].split("/")[2]
            return self.parser.specification["parameters"][ref]
        else:
            return parameter

    def _get_parameter_definition(self):
        """
        Get the create/update object definition from the current parameters.
        :return: The definition desired.
        """
        for parameter in self._currentIO.get("parameters", []):
            param = self._get_parameter_from_ref(parameter)
            # Grab the body parameter as the create/update definition
            if param["in"] == "body":
                return self._get_definition_from_ref(
                    definition=param["schema"]
                )
        return None

    def _get_related_field_permissions(self, field_name_resource: str):
        """
        Get the list permissions of a given related field resource.
        :param field_name_resource: The name of the related field resource.
        :return: The permissions found.
        """
        permissions = []
        list_path = self.parser.specification["paths"].get(f"/{field_name_resource}", None)
        if list_path:
            operation = list_path.get("get", None)
            if operation:
                permissions = operation.get("x-permissions", [])
        return permissions

    def _build_related_field(self, resource: str, name: str, _field: dict, _property: dict):
        """
        Build out a related field
        :param resource: The name of the current resource.
        :param name: The name of the current field.
        :param _field: The field to be built out further as a related field.
        :param _property: The current property being looked at.
        :return: Tuple of the resultant field and if a related field or not.
        """
        related = False
        if "x-related-info" in _property:


            # Check and handle related info
            related_info = _property["x-related-info"]

            if related_info:
                model = related_info.get("model", False)
                # Check if related model is not set to None.
                if model is not None:
                    # Check and add permission imports if found
                    has_permissions = self._resources[resource]["has_permission_fields"]
                    if self.permissions and not has_permissions:
                        self._resources[resource]["has_permission_fields"] = True
                        self._resources[resource]["custom_imports"].update(
                            ["empty", "permissions"]
                        )
                    related = True
                    # If model didn't even exist then attempt to guess the model
                    # from the substring before the last "_".
                    if not model:
                        model = name.rsplit("_", 1)[0]
                    _field["label"] = model.replace("_", " ").title()
                    # If a custom base path has been given set the reference to it
                    # else attempt to get the plural of the given model.
                    if related_info.get("rest_resource_name", None) is not None:
                        reference = related_info["rest_resource_name"]
                    else:
                        reference = words.plural(model.replace("_", ""))
                    _field["reference"] = reference
                    # Add permissions of reference if using normal permission generation scheme.
                    if self.permissions and not self.permissions_store:
                        _field["permissions"] = self._get_related_field_permissions(reference)

                    # Get the option text to be used in the Select input from the
                    # label field, else guess it from the current property name.
                    guess = name.rsplit("_", 1)[1]
                    label = related_info.get("label", None) or guess
                    _field["option_text"] = label

        return related, _field

    def _build_fields(self, resource: str, singular: str, properties: dict, _input: bool, fields: list):
        """
        Build out fields for the given properties.
        :param resource: The current resource name.
        :param singular: The current singular resource name.
        :param properties: The properties to build the fields from.
        :param _input: Boolean signifying if input fields or not.
        :param fields: List of fields desired. If NONE all are allowed.
        :return: A tuple of fields and imports
        """
        _imports = set([])
        _fields = []
        required_properties = self._current_definition.get("required", [])
        page_details = self.page_details.get(singular, None)
        sortable = page_details.get("sortable_fields", []) if page_details else []
        for name, details in properties.items():

            # Check if in list of accepted fields
            if fields:
                if name not in fields:
                    continue

            # Handle possible reference definition.
            _property, title = self._get_definition_from_ref(details)

            # Not handling nested object definitions, yet, maybe.
            if "properties" in _property:
                continue
            read_only = _property.get("readOnly", False) and _input
            _type = _property.get("type", None)
            _field = {
                "source": name,
                "type": _type,
                "required": name in required_properties,
                "sortable": name in sortable,
                "read_only": read_only
            }

            if read_only:
                _imports.add("DisabledInput")

            if _input:
                mapping = INPUT_COMPONENT_MAPPING
            else:
                mapping = FIELD_COMPONENT_MAPPING

            # Check for enum possibility.
            if "enum" in _property:
                _field["component"] = mapping["enum"]
                if _input:
                    _field["choices"] = _property["enum"]

            elif _field["type"] in mapping or _field["type"] in CUSTOM_IMPORTS:
                related, _field = self._build_related_field(
                    resource=resource,
                    name=name,
                    _field=_field,
                    _property=_property
                )

                if not related:
                    # Check if format overrides the component.
                    _format = _property.get("format", None)
                    if _format in mapping or _format in CUSTOM_IMPORTS:
                        _type = _format
                    # Check if a custom component exists for this _type
                    if _type in CUSTOM_IMPORTS and _type not in mapping:
                        _field["component"] = CUSTOM_IMPORTS[_type]["name"]
                    else:
                        _field["component"] = mapping[_type]
                else:
                    # Get relation component and the related component
                    _field["component"] = mapping["relation"]
                    relation = "SelectInput" if _input else mapping[_type]
                    _field["related_component"] = relation
                    _imports.add(relation)

            if _type in CUSTOM_IMPORTS and _type not in mapping:
                self._resources[resource]["custom_imports"].add(_type)
            else:
                # Add component to imports
                if "component" in _field:
                    _imports.add(_field["component"])

            _fields.append(_field)

        return _fields, _imports

    def _build_resource(self, resource: str, singular: str, method: str):
        """
        Build out a resource.
        :param resource: The name of the resource.
        :param singular: The singular name of the resource.
        :param method: The method to build out.
        """
        _input = method in ["create", "update"]
        properties = self._current_definition.get("properties", {})
        permissions = self._currentIO.get("x-permissions", [])

        if properties:
            # Build out fields for a resource.
            _fields, _imports = self._build_fields(
                resource=resource,
                singular= singular,
                properties=properties,
                _input=_input,
                fields=[]
            )
            # Get responsive fields for a resource.
            page_details = self.page_details.get(singular, {})
            responsive_fields = page_details.get("responsive_fields", {})
            responsive_obj = {}

            for prop, field in responsive_fields.items():
                responsive_obj[prop] = {
                    "field": field,
                    "title": field.replace("_", " ").title()
                }
            if responsive_obj:
                _imports.update(["Responsive", "SimpleList"])
            self._resources[resource]["methods"][SUPPORTED_COMPONENTS[method]] = {
                "fields": _fields,
                "permissions": permissions,
                "responsive_fields": responsive_obj if method == "list" else None
            }
            current_imports = self._resources[resource]["imports"]
            self._resources[resource]["imports"] = current_imports.union(_imports)

    def _build_filters(self, resource: str):
        """
        Build out filters for a resource.
        :param resource: The current resource to build filters for.
        """
        filters = []
        filter_imports = set([])
        custom_imports = set([])
        for parameter in self._currentIO.get("parameters", []):
            param = self._get_parameter_from_ref(parameter)
            x_filter = param.get("x-filter", None)

            valid = all([
                param["in"] == "query",
                param["type"] in INPUT_COMPONENT_MAPPING or x_filter,
                "x-admin-exclude" not in param
            ])

            if valid:
                _type = param["type"]

                # Check if related model filter.
                relation = None
                related_info = param.get("x-related-info", None)
                if related_info:
                    _type = "relation"
                    relation = {
                        "component": "SelectInput",
                        "resource": related_info["rest_resource_name"],
                        "text": related_info.get("label", None)
                    }
                    filter_imports.add("SelectInput")

                # Add filter component
                if x_filter:
                    _type = x_filter["format"]
                    if x_filter.get("range", False):
                        _type = f"{_type}-range"

                if _type in INPUT_COMPONENT_MAPPING:
                    component = INPUT_COMPONENT_MAPPING[_type]
                    filter_imports.add(component)
                else:
                    component = CUSTOM_IMPORTS[_type]["name"]
                    custom_imports.add(_type)

                # Load any custom props
                props = CUSTOM_PROPS.get(_type, [])

                # Load Min and Max values of filter.
                _min = param.get("minLength", None)
                _max = param.get("maxLength", None)
                source = param["name"]
                label = source.replace("_", " ").title()

                if _min or _max:
                    self._resources[resource]["filter_lengths"][source] = {
                        "min_length": _min,
                        "max_length": _max
                    }

                array_validation = param["items"]["type"] \
                    if _type == "array" else None

                filters.append({
                    "source": source,
                    "label": label,
                    "title": label.replace(" ", ""),
                    "component": component,
                    "props": props,
                    "relation": relation,
                    "array": array_validation
                })

        self._resources[resource]["filters"] = {
            "filters": list(filters),
            "imports": list(filter_imports),
            "custom_imports": [
                CUSTOM_IMPORTS[_import] for _import in custom_imports
            ]
        }

    def _build_in_lines(self, resource: str, singular: str, method: str):
        """
        Build out the given resource in lines for a resource.
        :param resource: The name of the current resource.
        :param singular: The singular name of the current resource.
        :param method: The current opertation method.
        """
        in_lines = []
        _input = method in ["create", "update"]
        if _input:
            mapping = INPUT_COMPONENT_MAPPING
        else:
            mapping = FIELD_COMPONENT_MAPPING

        for in_line in self.page_details[singular].get("inlines", []):
            has_permissions = self._resources[resource]["has_permission_fields"]
            if self.permissions and not has_permissions:
                self._resources[resource]["has_permission_fields"] = True
                self._resources[resource]["custom_imports"].update(
                    ["empty", "permissions"]
                )
            model = in_line["model"]
            label = in_line.get("label", None)

            # If a custom base path has been given, use that as reference.
            ref = in_line.get("rest_resource_name", None)
            reference = ref or words.plural(model.replace("_", ""))
            permissions = []
            if self.permissions and not self.permissions_store:
                permissions = self._get_related_field_permissions(reference)

            fields = in_line.get("fields", None)
            many_field = {
                "label": label or model.replace("_", " ").title(),
                "reference": reference,
                "target": in_line["key"],
                "component": mapping["many"],
                "permissions": permissions
            }

            self._resources[resource]["imports"].add(many_field["component"])
            _def = self.parser.specification["definitions"][in_line["model"]]
            properties = _def.get("properties", {})
            many_field["fields"], _imports = self._build_fields(
                resource=resource,
                singular=singular,
                properties=properties,
                _input=False,
                fields=fields
            )
            in_lines.append(many_field)
            self._resources[resource]["imports"].update(_imports)

        self._resources[resource]["methods"][SUPPORTED_COMPONENTS[method]]["inlines"] = in_lines

    def _init_class_resources(self):
        """
        Initialize the class resources object.
        """
        self._resources = {}
        self.page_details = self.parser.specification.get(
            "x-detail-page-definitions", {})

        for path, verbs in self.parser.specification["paths"].items():
            for verb, io in verbs.items():
                self._currentIO = io
                # Ignore top level parameter definition (not a path).
                if verb == "parameters":
                    continue
                else:
                    # Check if operation id is a valid operation.
                    operation_id = io.get("operationId", "")
                    exclude = io.get("x-admin-exclude", False)
                    valid_operation = any([
                        operation in operation_id
                        for operation in VALID_OPERATIONS
                    ])
                    if not operation_id or not valid_operation or exclude:
                        continue

                singular, op = operation_id.rsplit("_", 1)
                plural = path[1:].split("/")[0]
                details = VALID_OPERATIONS.get(op, None)
                if details:
                    if plural not in self._resources:
                        self._resources[plural] = {
                            "singular": singular,
                            "imports": set([]),
                            "methods": {},
                            "filter_lengths": {},
                            "has_permission_fields": False,
                            "custom_imports": set([])
                        }
                    self._resources[plural]["imports"].update(details["imports"])

                    # Special additions for certain operation types.
                    if op == "list":
                        self._current_definition, title = self._get_definition_from_ref(
                            definition=io['responses']['200']['schema']['items']
                        )
                        self._resources[plural]["title"] = title
                        self._build_filters(
                            resource=plural
                        )
                    elif op == "read":
                        self._current_definition, title = self._get_definition_from_ref(
                            definition=io['responses']['200']['schema']
                        )
                        self._resources[plural]["title"] = title
                    elif op in ["create", "update"]:
                        self._current_definition, title = self._get_parameter_definition()
                    elif op == "delete":
                        self._current_definition = None
                        if self.permissions:
                            permissions = io.get("x-permissions", [])
                        else:
                            permissions = None
                        self._resources[plural]["methods"]["remove"] = {
                            "permissions": permissions
                        }

                    # Build out the current resource if a definition is found.
                    if self._current_definition:
                        self._build_resource(
                            resource=plural,
                            singular=singular,
                            method=op
                        )

                        # Build in lines if existing page definition.
                        in_lines = all([
                            op in ["update", "read"],
                            singular in self.page_details
                        ])

                        if in_lines:
                            self._build_in_lines(
                                resource=plural,
                                singular=singular,
                                method=op
                            )

        for resource in self._resources.keys():
            custom_imports = list(self._resources[resource]["custom_imports"])
            custom_imports = [
                CUSTOM_IMPORTS[_import] for _import in custom_imports
            ]
            self._resources[resource]["custom_imports"] = custom_imports

    @staticmethod
    def generate_js_file(filename: str, context: dict):
        """
        Generate a js file from the given specification.
        :param filename: The name of the template file.
        :param context: Context to be passed.
        :return: str
        """
        return render_to_string(filename, context)

    @staticmethod
    def add_additional_file(filename: str):
        """
        Add an additional file, that does not require context,
        to the generated admin.
        :return: str
        """
        return render_to_string(filename, {})

    def create_and_generate_file(self, _dir: str, filename: str, context: dict, source=None):
        """
        Create a file of the given name and context.
        :param _dir: The output directory.
        :param filename: The name of the file to be created.
        :param context: The context for jinja.
        :param source: Alternative source file for the template.
        """
        click.secho(f"Generating {filename}.js file...", fg="green")
        with open(os.path.join(_dir, f"{filename}.js"), "w") as f:
            data = self.generate_js_file(
                filename=f"{source or filename}.js",
                context=context)
            f.write(data)
            if self.verbose:
                print(data)

    def create_additional_files(self, additional_files: dict):
        for _dir, files in additional_files.items():
            if _dir != "root":
                path_dir = f"{self.output_dir}/{_dir}"
                if not os.path.exists(path_dir):
                    os.makedirs(path_dir)
            else:
                path_dir = self.output_dir
            for _file in files:
                click.secho(f"Adding {_file} file...", fg="cyan")
                with open(os.path.join(path_dir, _file), "w") as f:
                    data = self.add_additional_file(_file)
                    f.write(data)
                    if self.verbose:
                        print(data)

    def get_and_create_directory(self, _dir_name: str):
        """
        Gets the full directory and creates it if it does not exist.
        :param _dir_name: The sub directory to get and create if needed.
        :return: string of the full directory
        """
        full_dir = f"{self.output_dir}/{_dir_name}"
        if _dir_name not in self._directories:
            os.makedirs(full_dir)
            self._directories.add(_dir_name)
        return full_dir

    def admin_generation(self):
        click.secho("Generating main JS component file...", fg="blue")
        self.create_and_generate_file(
            _dir=self.output_dir,
            filename="ReactAdmin",
            context={
                "title": self.module_name,
                "resources": self._resources,
                "permissions": self.permissions,
                "permissions_store": self.permissions_store,
                "supported_components": SUPPORTED_COMPONENTS.values()
            },
            source="ReactAdmin_permissions" if self.permissions else "ReactAdmin"
        )
        click.secho("Generating menu...", fg="blue")
        self.create_and_generate_file(
            _dir=self.output_dir,
            filename="Menu",
            context={
                "resources": self._resources
            }
        )
        click.secho("Generation auth provider...", fg="blue")
        auth_dir = self.get_and_create_directory("auth")
        self.create_and_generate_file(
            _dir=auth_dir,
            filename="authProvider",
            context={
                "permissions": self.permissions,
                "permissions_store": self.permissions_store
            }
        )
        click.secho("Generating data provider...", fg="blue")
        self.create_and_generate_file(
            _dir=self.output_dir,
            filename="dataProvider",
            context={
                "resources": self._resources
            }
        )
        click.secho("Generating catch all...", fg="blue")
        self.create_and_generate_file(
            _dir=self.output_dir,
            filename="catchAll",
            context={
                "permissions": self.permissions,
                "permissions_store": self.permissions_store
            }
        )
        click.secho("Generating utils file...", fg="blue")
        self.create_and_generate_file(
            _dir=self.output_dir,
            filename="utils",
            context={
                "permissions": self.permissions,
                "permissions_store": self.permissions_store
            }
        )

        click.secho("Generating resource component files...", fg="blue")
        resource_dir = self.get_and_create_directory("resources")
        for name, resource in self._resources.items():
            title = resource.get("title", None)
            if title:
                self.create_and_generate_file(
                    _dir=resource_dir,
                    filename=title,
                    context={
                        "title": title,
                        "resource": resource,
                        "permissions": self.permissions,
                        "supported_components": SUPPORTED_COMPONENTS.values()
                    },
                    source="Resource_permissions" if self.permissions else "Resource"
                )

        click.secho("Generating custom edit toolbar component files...", fg="blue")
        action_dir = self.get_and_create_directory("customActions")
        for name, resource in self._resources.items():
            title = resource.get("title", None)
            if title:
                if "edit" in resource["methods"]:
                    action_file = f"{title}EditToolbar"
                    self.create_and_generate_file(
                        _dir=action_dir,
                        filename=action_file,
                        context={
                            "name": name,
                            "resource": resource,
                            "permissions": self.permissions
                        },
                        source="EditToolbar_permissions" if self.permissions else "EditToolbar"
                    )

        click.secho("Generating Filter files for resources...", fg="blue")
        filter_dir = self.get_and_create_directory("filters")
        for name, resource in self._resources.items():
            if resource.get("filters", None) is not None:
                title = resource.get("title", None)
                if title:
                    filter_file = f"{title}Filter"
                    self.create_and_generate_file(
                        _dir=filter_dir,
                        filename=filter_file,
                        context={
                            "title": title,
                            "filters": resource["filters"]
                        },
                        source="Filters"
                    )

        if self.permissions:
            self.create_additional_files(PERMISSION_ADDITIONAL_FILES)
            if self.permissions_store:
                click.secho("Generating Permissions Store...", fg="blue")
                auth_dir = self.get_and_create_directory("auth")
                self.create_and_generate_file(
                    _dir=auth_dir,
                    filename="PermissionsStore",
                    context={
                        "resources": self._resources,
                        "supported_components": SUPPORTED_COMPONENTS.values()
                    }
                )

        self.create_additional_files(ADDITIONAL_FILES)


@click.command()
@click.argument("specification_path", type=click.Path(dir_okay=False, exists=True))
@click.option("--spec-format", type=click.Choice(SPEC_CHOICES))
@click.option("--verbose/--not-verbose", default=False)
@click.option("--output-dir", type=click.Path(file_okay=False, exists=True, writable=True))
@click.option("--module-name", type=str, default=DEFAULT_MODULE,
              help="The name of the module where the generated code will be "
                   "used, e.g. myproject.some_application")
@click.option("--permissions/--no-permissions", default=False)
@click.option("--permissions-store/--no-permissions-store", default=False)
def main(specification_path: str, spec_format: str,
         verbose: bool, output_dir: str,
         module_name: str, permissions: bool, permissions_store: bool):

    # Initialise Generator
    generator = Generator(
        verbose=verbose,
        output_dir=output_dir,
        module_name=module_name,
        permissions=permissions,
        permissions_store=permissions_store
    )

    try:
        click.secho("Loading specification file...", fg="blue")
        generator.load_specification(specification_path, spec_format)
        click.secho("Specification loaded", fg="green")
        click.secho("Starting admin generation...", fg="blue")
        generator.admin_generation()
        click.secho("All Done!", fg="green")
    except Exception as e:
        click.secho(str(e), fg="red")
        click.secho("""
                If you get schema validation errors from a yaml Swagger spec that passes validation on other
                validators, it may be because of single apostrophe's (') used in some descriptions. The
                parser used does not like it at all.
                """)
        raise e


if __name__ == '__main__':
    main()