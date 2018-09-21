import React, { Component } from 'react';
import { {% if "remove" in methods %}DeleteButton, {% endif %}ListButton, RefreshButton, ShowButton } from 'react-admin';
import CardActions from '@material-ui/core/CardActions';

{% if permissions and "remove" in methods %}
import PermissionsStore from '../auth/PermissionsStore';
{% endif %}

class {{ title }}EditActions extends Component {
    render() {
        const { basePath, data } = this.props;
        return (
            <CardActions>
                <ShowButton basePath={basePath} record={data} />
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

export default {{ title }}EditActions;
