import React, { Component } from 'react';
import { CreateButton, RefreshButton } from 'react-admin';
import { CardActions } from '@material-ui/core/Card';

{% if permissions %}
import PermissionsStore from '../auth/PermissionsStore';
{% endif %}

class {{ title }}ListActions extends Component {
    render() {
        const {
            resource,
            filters,
            displayedFilters,
            filterValues,
            basePath,
            showFilter
        } = this.props;
        return (
            <CardActions>
                {% if resource.filters %}
                {filters &&
                    React.cloneElement(filters, {
                        resource,
                        showFilter,
                        displayedFilters,
                        filterValues,
                        context: 'button'
                    })}
                {% endif %}
                {% if "create" in methods %}
                {% if permissions %}
                {PermissionsStore.getResourcePermission('{{ name }}', 'create') && (
                    <CreateButton basePath={basePath} />
                )}
                {% else %}
                <CreateButton basePath={basePath} />
                {% endif %}
                {% endif %}
                <RefreshButton />
            </CardActions>
        );
    }
}

export default {{ title }}ListActions;