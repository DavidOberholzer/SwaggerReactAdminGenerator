/**
 * Generated ReactAdmin.js code. Edit at own risk.
 * When regenerated the changes will be lost.
**/
import { Admin, Resource } from 'react-admin';

import AuthLoginPage from './auth/authLogin';
import authProvider from './auth/authProvider';
import PermissionsStore from './auth/PermissionsStore';
import catchAll from './catchAll';
import dataProvider, { httpClient } from "./dataProvider";
import MyLayout from './MyLayout';
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
        catchAll={catchAll}
        dataProvider={dataProvider('rest_server_url', httpClient)}
        loginPage={AuthLoginPage}
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