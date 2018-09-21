import React, { Component } from 'react';
import { DeleteButton, ListButton, RefreshButton, EditButton } from 'react-admin';
import { CardActions } from '@material-ui/core/Card';

{% if permissions %}
import PermissionsStore from '../auth/PermissionsStore';
{% endif %}

class {{ title }}ShowActions extends Component {
    render() {
        const { basePath, data } = this.props;
        return (
            <CardActions>
                {% if "edit" in methods %}
                {% if permissions %}
                {PermissionsStore.getResourcePermission('{{ name }}', 'edit') && (
                    <EditButton basePath={basePath} record={data} />
                )}
                {% else %}
                <EditButton basePath={basePath} record={data} />
                {% endif %}
                {% endif %}
                <ListButton basePath={basePath} />
                {% if "remove" in methods %}
                {% if permissions %}
                {PermissionsStore.getResourcePermission('{{ name }}', 'remove') && (
                    <DeleteButton basePath={basePath} record={data} />
                )}
                {% else %}
                <DeleteButton basePath={basePath} record={data} />
                {% endif %}
                {% endif %}
                <RefreshButton />
            </CardActions>
        );
    }
}

export default {{ title }}ShowActions;
