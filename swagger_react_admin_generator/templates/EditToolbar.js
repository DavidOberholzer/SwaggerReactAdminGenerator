/**
 * Generated {{ title }}Edit.js code. Edit at own risk.
 * When regenerated the changes will be lost.
**/
import React from 'react';
import { {% if resource.methods.remove %}DeleteButton, {% endif %}SaveButton, Toolbar } from 'react-admin';

{% if permissions and resource.methods.remove %}
import PermissionsStore from '../auth/PermissionsStore';
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
        {% if permissions %}
        {PermissionsStore.getResourcePermission('{{ name }}', 'remove') && (
            <DeleteButton resource="{{ name }}" record={props.record} />
        )}
        {% else %}
        <DeleteButton />
        {% endif %}
        {% endif %}
    </Toolbar>
);

export default {{ resource.title }}EditToolbar;
/** End of Generated Code **/