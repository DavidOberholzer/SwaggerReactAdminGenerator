import React, { Component } from 'react';
import { {% if "create" in methods %}CreateButton, {% endif %}RefreshButton } from 'react-admin';
import CardActions from '@material-ui/core/CardActions';

{% if permissions and "create" in methods %}
import PermissionsStore from '../auth/PermissionsStore';
{% endif %}

class {{ title }}ListActions extends Component {
    render() {
        const {
            {% if resource.filters %}
            resource,
            filters,
            displayedFilters,
            filterValues,
            showFilter,
            {% endif %}
            {% if "create" in methods %}
            basePath
            {% endif %}
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