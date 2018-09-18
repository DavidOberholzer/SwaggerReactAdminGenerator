/**
 * Generated Category.js code. Edit at own risk.
 * When regenerated the changes will be lost.
**/
import React from 'react';
import {
    Create,
    ReferenceManyField,
    SimpleForm,
    List,
    SimpleShowLayout,
    Show,
    Datagrid,
    ShowButton
} from 'admin-on-rest';

import CategoryFilter from '../filters/CategoryFilter';

const validationCreateCategory = values => {
    const errors = {};
    if (!values.name) {
        errors.name = ["name is required"];
    }
    return errors;
};

export const CategoryList = props => (
    <List {...props} title="Category List" filters={<CategoryFilter />}>
        <Datagrid bodyOptions={ { showRowHover: true } }>
            <NumberField source="id" />
            <TextField source="name" />
            <UrlField source="info" />
            <DateField source="created_at" />
            <DateField source="updated_at" />
        </Datagrid>
    </List>
);

export const CategoryCreate = props => (
    <Create {...props} title="Category Create">
        <SimpleForm validate={validationCreateCategory} redirect="show">
            <TextInput source="name" />
            <TextInput source="info" />
            <ReferenceManyField label="Pets" reference="pets" target="category_id">
                <Datagrid bodyOptions={ { showRowHover: true } }>
                    <TextField source="name" />
                    <DateField source="date_of_birth" />
                </Datagrid>
            </ReferenceManyField>
        </SimpleForm>
    </Create>
);

export const CategoryShow = props => (
    <Show {...props} title="Category Show">
        <SimpleShowLayout>
            <NumberField source="id" />
            <TextField source="name" />
            <UrlField source="info" />
            <DateField source="created_at" />
            <DateField source="updated_at" />
            <ReferenceManyField label="Pets" reference="pets" target="category_id">
                <Datagrid bodyOptions={ { showRowHover: true } }>
                    <TextField source="name" />
                    <DateField source="date_of_birth" />
                </Datagrid>
            </ReferenceManyField>
        </SimpleShowLayout>
    </Show>
);

/** End of Generated Code **/