# Swagger React Admin Generator
Convert Swagger specifications into a simple React Admin client.

LAST TESTED REACT ADMIN VERSION <= 2.4.0

## Introduction
This utility parses a Swagger specification and generates a simple React Admin client implementation to integration with a given data provider.
The purpose of this tool is to generate all the CRUD, Filter and base elements of a React Admin setup with a defined swagger specification. The tool includes a basic setup for authentication and management, but those can be controlled and overwritten once the generation is done.

## Installation

In your virtual environment, pip install the package.

`pip install swagger-react-admin-generator`

Then to use the generator run the following in your project directory:

```
./ve/bin/python ./ve/lib/python{python_version}/site-packages/swagger_react_admin_generator/generator.py {swagger_specification_location} --output-dir=output_dir --module-name="Title"
```

The following optional flags are available:

* --spec-format: The specification format (JSON/YAML). Inferred from extension if not given.
* --verbose: A verbose print out during generation.
* --output_dir: The output directory for generation.
* --module-name: The title of your admin module.
* --omit-exporter: If you would like the export button to not appear on list views.
* --permissions: Include permission generation scheme.
* --permissions-store: Include permission generation scheme with PermissionsStore singleton scheme (explained below).

## Swagger Specification Configuration
Here is a configuration of paths for a single model to be implemented on the React Admin interface.

```
"/pets": {
  "get": {
    "operationId": "pet_list",
    "parameters": [
      {
        "description": "An Optional Filter by pet_id.",
        "in": "query",
        "name": "pet_id",
        "required": false,
        "type": "integer"
      }
    ],
    "produces": [
      "application/json"
    ],
    "responses": {
      "200": {
        "description": "",
        "schema": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/pet"
          }
        }
      }
    },
    "tags": []
  },
  "post": {
    "consumes": [
      "application/json"
    ],
    "operationId": "pet_create",
    "parameters": [
      {
        "in": "body",
        "name": "data",
        "schema": {
          "$ref": "#/definitions/pet_create"
        }
      }
    ],
    "produces": [
      "application/json"
    ],
    "responses": {
      "201": {
        "description": "",
        "schema": {
          "$ref": "#/definitions/pet"
        }
      }
    },
    "tags": []
  }
},
"/pets/{pet_id}": {
  "parameters": [
    {
      "$ref": "#/parameters/pet_id"
    }
  ],
  "delete": {
    "operationId": "pet_delete",
    "responses": {
      "204": {
        "description": ""
      }
    },
    "tags": []
  },
  "get": {
    "operationId": "pet_read",
    "produces": [
      "application/json"
    ],
    "responses": {
      "200": {
        "description": "",
        "schema": {
          "$ref": "#/definitions/pet"
        }
      }
    },
    "tags": []
  },
  "put": {
    "consumes": [
      "application/json"
    ],
    "operationId": "pet_update",
    "parameters": [
      {
        "in": "body",
        "name": "data",
        "schema": {
          "$ref": "#/definitions/pet_update"
        }
      }
    ],
    "produces": [
      "application/json"
    ],
    "responses": {
      "200": {
        "description": "",
        "schema": {
          "$ref": "#/definitions/pet"
        }
      }
    },
    "tags": []
  }
}
```

This is a suitable layout for the endpoints of the Pet Model. The important attributes of each path/method pair are:

1. The base resource name `pets` remains the same for each path regarding pets. (VERY IMPORTANT)
2. With each operationId, the start is always the model name (`pet`) and the trailing word describes which AOR component the generator is looking at to generate.

All components for pets will be generated for the base resource path name `pets`, and each trailing word correlates to a given AOR component as listed below:
```
list - List Component
create - Create Component
read - Show Component
update - Edit Component
```

Here we can go over the endpoints and how they will be used in generation.

`/pets GET`: This path method will be used for the List component of the Pet model. The operationId must contain the suffix
             "list". Here the generator will build a List component for Pet based on the definition or schema provided in the 200 response for a SINGLE item of the array.
             In this example it will look at `"$ref": "#/definitions/pet"`

`/pets POST`: This path method will be used for the Create component of the Pet Model. The operationId must contain the suffix "create". Here the
              generator will build a Create component for Pet based on the definition or schema provided in the body parameter. In this example it will look at `"$ref": "#/definitions/pet_create"`.

`/pets/{pet_id} GET`: This path method will be used for the Show component of the Pet Model. The operationId must contain the suffix "read". Here the generator
                      will build a Show component for the Pet based on the definition or schema provided in the 200 response. In this example it will look at `"$ref": "#/definitions/pet"`.

`/pets/{pet_id} PUT`: This path method will be used for the Edit component of the Pet Model. The operationId must contain the suffix "update". Here the generator will
                      build an Edit component for the Pet based on the definition or schema provided in the body parameter. In this example it will look at `"$ref": "#/definitions/pet_create"`.

`/pets/{pet_id} DELETE`: This path method will signify if the model can be deleted and the delete action will then be included on the show and edit views.

### Exlcude a path

Some paths maybe operational and perform specific actions that are not simple CRUD. For these to be safe add the flag on the `operationId` level.

`x-admin-exlude: true`

### Definition Configuration

A simple definition can be given as follows:

```
"pet": {
  "properties": {
    "id": {
      "type": "integer",
      "format": "int64",
      "readOnly": true
    },
    "category_id": {
      "type": "integer"
    },
    "name": {
      "type": "string",
      "example": "doggie"
    },
    "metadata": {
      "type": "object"
    },
    "date_of_birth": {
      "type": string
      "format": date
    },
    "created_at": {
      "type": string,
      "format": date-time
    },
    "updated_at": {
      "type": string,
      "format": date-time
    }
  }
}
```


Each property will be catered for in the generated React Admin client. The property type will dictate the component to be generated for the property, 
however note that if the format is a supported component, it will overwrite the type component with the given format component. 
Also note the presence of `enum` in a property will change the component. 
The following types/formats have supported React Admin components and are shown in the table below.

*NOTE: date-time inputs are custom and require the following NPM packages:*
* "material-ui-pickers": "^1.0.0-rc.14"
* "date-fns": "2.0.0-alpha.16" (exact version!)

| Type/Format     | Field Component  | Input Component  |
| ----------------| -----------------| -----------------|
| string          | TextField        | TextInput        |
| integer         | NumberField      | NumberInput      |
| boolean         | BooleanField     | BooleanInput     |
| date            | DateField        | DateInput        |
| date-time       | DateField        | DateTimeInput    |
| enum            | SelectField      | SelectInput      |
| object*         | ObjectField*     | LongTextInput*   |
| array           | TextField        | None             |

* Object types use a Custom ObjectField included in the generation of the React Admin Client. 
For the input of an object, a LongTextInput is utilized with `parse` and `format` props that handle the sending and presentation of the field data.

### Foreign Key relationships

Foreign key relationships can be setup in the definition quite easily. In order for a field to be picked up as a foreign key either of the following must be present.

1. The field name is suffixed by `_id`.
2. There is an additional field for related information named `x-related-info`

The latter will appear as such:

```
"category_id": {
  "type": "integer"
  "x-related-info": {
    "model": "category", # The name of the model that is the foreign key.
    "rest_resource_name": "categories" # The base resource path on the API ie `pets` in the above path specification.
    "field": "id", # The related field of the related model.
    "label": "name" # The field to be seen when viewing the related model instance on the given model.
  }
}
```

The property will then generate a simple Reference component. Each one of the fields in the `x-related-info` attribute is optional and if not present, assumptions will be made by the generator.
The behaviour of the generator with regards to the `x-related-info` is as follows:

1. If `model` is NOT present, grab the substring before the last `_` in the property key, eg. `category`.
2. If `rest_resource_name` is NOT present, take the `model` (or the substring before the last `_` in the property key) and attempt to remove all `_` and pluralize it for a guessed base resource path on the API.
3. If `field` is NOT present, grab the substring after the last `_` in the property key, eg. `id`.
4. If `label` is NOT present, use the `field` or what was found in part 3 before.

The relation Field component will be generated as follows:

```
<ReferenceField label="Category" source="category_id" reference="categories" linkType="show" allowEmpty>
  <NumberField source="name" />
</ReferenceField>
```

The relation Input component will be generated as follows:

```
<ReferenceInput label="Category" source="category_id" reference="categories" allowEmpty>
  <SelectInput source="id" optionText="name" />
</ReferenceInput>
```

*NOTE: If you have a property with `_id` on the end and you do not want it to be a relation, set the `x-related-info` `model` field to `None`*

### Inline models

Additional info can be included in the swagger specification, at a global level, to produce inline displays on any desired model with related models. The additional field `x-detail-page-definitions` must be included on the highest level in the swagger specification with all models with inlines. An example is given as follows:

```
"x-detail-page-definitions": {
  "category": {
    "inlines": [
      {
        "model": "pet",
        "rest_resource_name": "pets",
        "label": "Pets",
        "key": "category_id",
        "fields": [
          "name",
          "date_of_birth"
        ]
      }
    ]
  }
}
```

Here we have the category model with an inline of all pets with the category_id of the given category. The optional fields here are `rest_resource_name`, `label` and `fields`.
The generator with behave as follows:

1. The `model` is required.
2. `rest_resource_name` is the base resource path to point to, and behaves the same as before. If not present, the generator will attempt to guess the base resource path with the given model name minus `_` and pluralized as best as possible.'
3. The `label` is used for aesthetic purposes.
4. The `key` is the required related_field to filter the given resource by (eg `category_id`).
5. `fields` specifies the fields to be shown in the inline, if `fields` is omitted, then all fields of the related model will be shown.

This will finally generate a `<ReferenceManyField>` with a list of all the related items.

*NOTE: The inlines will only be generated on the `Show` and `Edit` components. The Edit inlines will include edit buttons on the right side of an entry.*

### Sortable Fields

All fields in the list views are considered not sortable unless specified in the `x-detail-page-definitions` as such:

```
"x-detail-page-definitions": {
  "category": {
    "inlines": [
      {
        "model": "pet",
        "rest_resource_name": "pets",
        "label": "Pets",
        "key": "category_id",
        "fields": [
          "name",
          "date_of_birth"
        ]
      }
    ],
    "sortable_fields": [
      "id"
    ]
  },
  "pet": {
    "sortable_fields": [
      "id"
    ]
  }
}
```

### Responsive Fields

If you would like a resource list view to support a response view specify the fields you would like in the `x-detail-page-definitions` as such:

```
"x-detail-page-definitions": {
  "category": {
    "inlines": [
      {
        "model": "pet",
        "rest_resource_name": "pets",
        "label": "Pets",
        "key": "category_id",
        "fields": [
          "name",
          "date_of_birth"
        ]
      }
    ],
    "sortable_fields": [
      "id"
    ]
  },
  "pet": {
    "sortable_fields": [
      "id"
    ],
    "responsive_fields": {
      "primary": "name",
      "secondary": "status",
      "tertiary": "id"
    }
  }
}
```

This will use the suggested implementation https://marmelab.com/react-admin/Theming.html#responsive-utility.

### List Filters

List filters are all generated in an additional files suffixed by `Filter.js`. In order to generate filters, the path in charge of dictating the list component must contain optional query parameters. These will be noticed by the generator and added to the list components filter props. Taking from the `pet` specification established above we have:

```
"get": {
  "operationId": "pet_list",
  "parameters": [
    {
      "description": "An Optional Filter by pet_id.",
      "in": "query",
      "name": "pet_id",
      "required": false,
      "type": "integer"
    },
    {
      "description": "A name for a given pet.",
      "in": "query",
      "name": "name",
      "required": false,
      "type": "string",
      "minLength": 3
    },
    {
      "description": "A date range filter for pet date of birth",
      "in": "query",
      "name": "date_of_birth",
      "required": false,
      "type": "string",
      "x-filter": {
        "format": "date",
        "range": true
      }
    }
  ],
  "produces": [
    "application/json"
  ],
  "responses": {
    "200": {
      "description": "",
      "schema": {
        "type": "array",
        "items": {
          "$ref": "#/definitions/pet"
        }
      }
    }
  },
  "tags": []
}
```

Here we have one parameter named `pet_id`. This parameter is given `in` the `query`. This will generate a filter component for Pet list with a single filter option, many can be added to the parameters for more filter options.
The filter `type`/`format` is important for the component to be used and maps to the table as given above in the `Definition Configuration` section. Also each query parameter can have a `minLength` attribute which will dictate in the `dataProvider.js` to only query when the minimum length of input has been typed in that filter.

*NOTE*: Array filters are handled, however only with a CSV format parser on the TextField input. The input will be transformed into a list joined by `,`. ie typing in "hello you,8 9" will become "hello,you,8,9". Validation is performed on an integer type only. 

### Relation Filter Dropdowns

If you would like a filter to be a dropdown selection of a related model rather than just a text/number input, add the previously mentioned `x-related-info` to the parameter. The only 2 attributes used with the `x-related-info` on a filter parameter, are `rest_resource_name` and `label`.

*NOTE* If you would like to not include a parameter as a filter, add the following to the parameter definition:

`"x-admin-exlude": true`

### Date range filters

There is a custom DateRangeInput component included in the generation. In order to use it in a filter provide the following extra info on the desired `query` parameter:

```
"x-filter": {
  "format": "date"/"date-time",
  "range": true/false
}
```

## Permissions

By setting the flag `--permissions` one can have permissions on each view/action (list, show, edit, create, remove) throughout the admin interface.
This method follows the paradigm explained on https://marmelab.com/react-admin/Authorization.html. 

One can specify a list of roles required to perform a certain action on a resource endpoint as such:

```
...
"operationId": "pet_list",
"x-permissions": [
  "admin",
  "content_editor"
],
...
```

With this setup, a utility function `permitted` is included. This function is given the roles declared for that resource action and checks if the current user role is within that list. This will decide whether or not to render that component.

### Permissions Store

This is an option for multiple resource permission handling, ie. storing what resource actions (list, edit, create, remove) the user has (instead of just a single role) and then using this store to control the React Admin view.

Instead of the permitted check you can have a PermissionStore setup on your React Admin generated code. For this you can set the flag `--permissions-store` when running the generator. To handle permissions in your swagger specification, add a `x-permissions` array to each one of the `list`, `create`, `update` and `delete` methods specified above in your specification at the `operationId` level. An example is shown below:

```
...
"operationId": "pet_list",
"x-permissions": [
  "pet:read",
  ...
],
...
```

It can be seen that permission to get a pet list from the API will require the user to have all the permissions listed in the `x-permissions` array.

When the permission flag is set on generation, a file `PermissionsStore.js` will be created which instantiates a PermissionsStore Singleton instance that can be imported into any of your files has the following attributes:

| Attribute                                      | Description                                                                                                                                  |
| -----------------------------------------------| ---------------------------------------------------------------------------------------------------------------------------------------------|
| loadPermissions(permissions)                   | Load permission flags with the `permissions` list given.                                                                                     |
| getResourcePermission(resource, permission)    | Get the resource permission flag for the user. ie `getResourcePermission('pet', 'list')`                                                     |
| permissionFlags                                | The permission flags mapping that is populated after loadPermissions has been loaded.                                                        |


Example:

If I have the single `pet_list` operation with the permissions listed above and a user with the permissions `["pet:read"]`, when the PermissionsStore is loaded, then the following permissionFlags object will be created and can be requested with the `getResourcePermission` function:

```
{
  pets: [object Object] {
    list: true
  }
}
```

If the user has the permissions `["owner:read"]` then the above flag will be `false`. 

These permissions will need to be loaded prior to the Admin being rendered. Therefore on login, if you would like to use the PermissionsStore, please call `loadPermissions` with a list of the permissions you want loaded prior to rendering the Main Admin component.

*NOTE*: If an endpoint has no permissions listed, it is assumed that all users have permission to perform that action for BOTH permission setups. 

## Omit Exporter Button

With the `--omit-exporter` flag, the generator will create `ListAction.js` files for each resource WITHOUT the export button present.
This will prevent the rendering of an export button.

## authProvider

A basic auth provider setup is included from https://marmelab.com/react-admin/Authentication.html and https://marmelab.com/react-admin/Authorization.html and is generic.

## dataProvider

The given `dataProvider.js` will perform the following:
* Convert a REST (JSON) request to an HTTP request for the service to be integrated with.
* Convert a HTTP response to a REST (JSON) response for consumption in the React Admin.

Replace with your own dataProvider if this is not what you need.

## Generated code formatting

The generated code will not be pretty due to the templates being quite difficult to keep good formatting.
Therefore a suggestion would be to add a shell script to run after generating:

```
#!/bin/bash
# A script to run prettier on all generated admin js files before melding.

FILES=`find ./{your_generated_directory} -type f -name '*.js'`
for file in $FILES
do
yarn prettier --write --single-quote --tab-width 4 --print-width 100 "$file"
done
```

Make sure you have installed the npm package `prettier`.

## TODOS (What would be cool as well)

* Fix up templates folder/file organization, thus resulting in some minor code changes. (Neatening up).
* Add more range based filter types (like integer/number range).