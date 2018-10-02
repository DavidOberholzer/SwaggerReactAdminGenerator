/**
 * Generated ReactAdmin.js code. Edit at own risk.
 * When regenerated the changes will be lost.
**/
import React from 'react';
import { Admin, Resource } from 'react-admin';

import authProvider from './auth/authProvider';
{% if permissions_store %}
import PermissionsStore from './auth/PermissionsStore';
{% endif %}
import catchAll from './catchAll';
import customRoutes from './customRoutes';
import dataProvider from "./dataProvider";
import MyLayout from './MyLayout';
import { theme } from './theme';
{% if not permissions_store %}
import { permitted } from './utils';
{% endif %}

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
        customRoutes={customRoutes}
        dataProvider={dataProvider}
        title="{{ title }}"
        theme={theme}
    >
        {permissions => [
            {% for name, details in resources.items() %}
            {% if details.methods %}
                {% if permissions_store %}PermissionsStore.getResourcePermission('{{ name }}', 'list'){% else %}permitted({{ details.methods.list.permissions }}){% endif %}
                    ? <Resource
                        name="{{ name }}"
                        {% for method, action in details.methods.items() %}
                        {% if method in supported_components %}
                        {% if method in ["list", "show"] %}
                        {{ method }}={ {{ details.title }}{{ method|title }} }
                        {% else %}
                        {{ method }}={ {% if permissions_store %}PermissionsStore.getResourcePermission('{{ name }}', '{{ method }}'){% else %}permitted({{ action.permissions }}){% endif %} ? {{ details.title }}{{ method|title }} : null }
                        {% endif %}
                        {% endif %}
                        {% endfor %}
                    /> : null,
            {% endif %}
            {% endfor %},
            <Resource name="catchAll" />
        ]}
    </Admin>
);

export default ReactAdmin;
/** End of Generated Code **/