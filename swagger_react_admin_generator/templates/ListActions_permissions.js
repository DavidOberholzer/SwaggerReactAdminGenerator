/**
 * Generated {{ title }}ListActions.js code. Edit at own risk.
 * When regenerated the changes will be lost.
**/
import React from 'react';
import { CardActions, {% if resource.methods.create %}CreateButton, {% endif %}RefreshButton } from 'react-admin';

{% if resource.methods.create %}
{% if permissions_store %}
import PermissionsStore from '../auth/PermissionsStore';
{% else %}
import { permitted } from '../utils';
{% endif %}
{% endif %}

const {{ resource.title }}ListActions = ({
    basePath,
    displayedFilters,
    filters,
    filterValues,
    resource,
    showFilter
}) => (
    <CardActions>
        {filters && React.cloneElement(filters, {
            resource,
            showFilter,
            displayedFilters,
            filterValues,
            context: 'button',
        })}
        {% if resource.methods.create %}
        { {% if permissions_store %}PermissionsStore.getResourcePermission('{{ name }}', 'create'){% else %}permitted({{ resource.methods.create.permissions }}){% endif %} && (
            <CreateButton basePath={basePath} />
        )}
        {% endif %}
        <RefreshButton />
    </CardActions>
);

export default {{ resource.title }}ListActions;

/** End of Generated Code **/
