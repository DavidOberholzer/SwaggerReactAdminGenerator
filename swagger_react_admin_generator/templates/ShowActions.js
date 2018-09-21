import React, { Component } from 'react';
import { {% if "remove" in methods %}DeleteButton, {% endif %}ListButton, RefreshButton{% if "edit" in methods %}, EditButton{% endif %} } from 'react-admin';
import { CardActions } from '@material-ui/core/Card';

{% if permissions %}
{% if "edit" in methods or "remove" in methods %}
import PermissionsStore from '../auth/PermissionsStore';
{% endif %}
{% endif %}

class {{ title }}ShowActions extends Component {
    render() {
        const { basePath{% if "edit" in methods or "remove" in methods %}, data{% endif %} } = this.props;
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
