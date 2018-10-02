/**
 * Generated {{ title }}Edit.js code. Edit at own risk.
 * When regenerated the changes will be lost.
**/
import React from 'react';
import { {% if resource.methods.remove %}DeleteButton, {% endif %}SaveButton, Toolbar } from 'react-admin';

{% if resource.methods.remove %}
{% if permissions_store %}
import PermissionsStore from '../auth/PermissionsStore';
{% else %}
import { permitted } from '../utils';
{% endif %}
{% endif %}

const {{ resource.title }}EditToolbar = props => (
    <Toolbar {...props}>
        <SaveButton
            label="Save"
            submitOnEnter={true}
        />
        <SaveButton
            label="Save and Continue Editing"
            redirect={false}
            submitOnEnter={false}
            variant="flat"
        />
        {% if resource.methods.remove %}
        { {% if permissions_store %}PermissionsStore.getResourcePermission('{{ name }}', 'remove'){% else %}permitted({{ resource.methods.remove.permissions }}){% endif %} && (
            <DeleteButton resource="{{ name }}" record={props.record} />
        )}
        {% endif %}
    </Toolbar>
);

export default {{ resource.title }}EditToolbar;
/** End of Generated Code **/