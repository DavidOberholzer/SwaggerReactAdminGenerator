/**
 * Generated Pet.js code. Edit at own risk.
 * When regenerated the changes will be lost.
**/
import React from 'react';
import {
    Create,
    SimpleForm,
    List,
    SimpleShowLayout,
    Show,
    Edit,
    Datagrid,
    ShowButton
} from 'admin-on-rest';
import ObjectField from '../fields/ObjectField';
import PermissionsStore from '../auth/PermissionsStore';
import EmptyField from '../fields/EmptyField';

import PetFilter from '../filters/PetFilter';

const validationCreatePet = values => {
    const errors = {};
    if (!values.name) {
        errors.name = ["name is required"];
    }
    return errors;
};

const validationEditPet = values => {
    const errors = {};
    return errors;
};

const choiceCreateStatus = [
    { id: 'available', name: 'available' },
    { id: 'pending', name: 'pending' },
    { id: 'sold', name: 'sold' },
];

const choiceEditStatus = [
    { id: 'available', name: 'available' },
    { id: 'pending', name: 'pending' },
    { id: 'sold', name: 'sold' },
];

export const PetList = props => (
    <List {...props} title="Pet List" filters={<PetFilter />}>
        <Datagrid bodyOptions={ { showRowHover: true } }>
            <NumberField source="id" />
            <ReferenceField label="Category" source="category_id" reference="categories" linkType="show" allowEmpty>
                <NumberField source="name" />
            </ReferenceField>
            <TextField source="name" />
            <ObjectField source="metadata" addLabel />
            <DateField source="last_eaten" />
            <DateField source="date_of_birth" />
            <SelectField source="status" />
        </Datagrid>
    </List>
);

export const PetCreate = props => (
    <Create {...props} title="Pet Create">
        <SimpleForm validate={validationCreatePet} redirect="show">
            <TextInput source="name" />
            <LongTextInput source="metadata" format={value => value instanceof Object ? JSON.stringify(value) : value} parse={value => { try { return JSON.parse(value); } catch (e) { return value; } }} />
            <DateInput source="last_eaten" />
            <TextInput source="photoUrls" />
            <SelectInput source="status" choices={choiceCreateStatus} />
        </SimpleForm>
    </Create>
);

export const PetShow = props => (
    <Show {...props} title="Pet Show">
        <SimpleShowLayout>
            <NumberField source="id" />
            <ReferenceField label="Category" source="category_id" reference="categories" linkType="show" allowEmpty>
                <NumberField source="name" />
            </ReferenceField>
            <TextField source="name" />
            <ObjectField source="metadata" addLabel />
            <DateField source="last_eaten" />
            <DateField source="date_of_birth" />
            <SelectField source="status" />
        </SimpleShowLayout>
    </Show>
);

export const PetEdit = props => (
    <Edit {...props} title="Pet Edit">
        <SimpleForm validate={validationEditPet}>
            <TextInput source="name" />
            <DateInput source="last_eaten" />
            <TextInput source="photoUrls" />
            <SelectInput source="status" choices={choiceEditStatus} />
        </SimpleForm>
    </Edit>
);

/** End of Generated Code **/