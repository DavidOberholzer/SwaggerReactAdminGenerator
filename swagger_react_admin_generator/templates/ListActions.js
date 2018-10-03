/**
 * Generated {{ title }}ListActions.js code. Edit at own risk.
 * When regenerated the changes will be lost.
**/
import React from 'react';
import { CardActions, {% if resource.methods.create %}CreateButton, {% endif %}RefreshButton } from 'react-admin';

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
        <CreateButton basePath={basePath} />
        {% endif %}
        <RefreshButton />
    </CardActions>
);

export default {{ resource.title }}ListActions;

/** End of Generated Code **/
