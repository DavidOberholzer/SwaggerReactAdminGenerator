/**
 * Generated ReactAdmin.js code. Edit at own risk.
 * When regenerated the changes will be lost.
**/
import React from 'react';
import { Admin, Resource } from 'react-admin';

import authProvider from './auth/authProvider';
import catchAll from './catchAll';
import customRoutes from './customRoutes';
import dataProvider from "./dataProvider";
import MyLayout from './MyLayout';
import { theme } from './theme';

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
    </Admin>
);

export default ReactAdmin;
/** End of Generated Code **/