/**
 * Generated ReactAdmin.js code. Edit at own risk.
 * When regenerated the changes will be lost.
**/
import { Admin, Resource } from 'react-admin';

import authProvider from './auth/authProvider';
import PermissionsStore from './auth/PermissionsStore';
import MyLayout from './MyLayout';
import restClient from './restClient';
import { muiTheme } from './theme';

{% for name, details in resources.items() %}
{% if details.methods %}
import {
    {% for method, action in details.methods.items() %}
    {% if method in supported_components %}
    {{ details.title }}{{ method|title }},
    {% endif %}
    {% endfor %}
} from './resources/{{ details.title }}';

{% endif %}
{% endfor %}

const ReactAdmin = () => (
    <Admin
        appLayout={MyLayout}
        authProvider={authProvider}
        dataProvider={restClient('{{ rest_server_url }}')}
        title="{{ title }}"
        theme={muiTheme}
    >
    {% if permissions %}
        {permissions => [
            {% for name, details in resources.items() %}
            {% if details.methods %}
                PermissionsStore.getResourcePermission('{{ name }}', 'list')
                    ? <Resource
                        name="{{ name }}"
                        {% for method, action in details.methods.items() %}
                        {% if method in supported_components %}
                        {% if method in ["list", "show"] %}
                        {{ method }}={ {{ details.title }}{{ method|title }} }
                        {% else %}
                        {{ method }}={PermissionsStore.getResourcePermission('{{ name }}', '{{ method }}') ? {{ details.title }}{{ method|title }} : null}
                        {% endif %}
                        {% endif %}
                        {% endfor %}
                    /> : null,
            {% endif %}
            {% endfor %}
        ]}
    {% else %}
    {% for name, details in resources.items() %}
    {% if details.methods %}
        <Resource
            name="{{ name }}"
            {% for method, action in details.methods.items() %}
            {% if method in supported_components %}
            {{ method }}={ {{ details.title }}{{ method|title }} }
            {% endif %}
            {% endfor %}
        />
    {% endif %}
    {% endfor %}
    {% endif %}
    </Admin>
);

export default ReactAdmin;
/** End of Generated Code **/