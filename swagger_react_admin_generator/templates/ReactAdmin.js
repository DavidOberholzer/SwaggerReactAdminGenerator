/**
 * Generated ReactAdmin.js code. Edit at own risk.
 * When regenerated the changes will be lost.
**/
import { Admin, Delete, Resource } from 'react-admin';

import { muiTheme } from './Theme';
import authProvider from './authProvider';
import restClient from './restClient';

{% for name, actions in resources.items() %}
{% if actions.has_methods %}
import {
    {% for action, details in actions.items() %}
    {% if action in supported_components and action != 'remove' %}
    {{ actions.title }}{{ action|title }},
    {% endif %}
    {% endfor %}
} from './resources/{{ actions.title }}';

{% endif %}
{% endfor %}

const ReactAdmin = () => (
    <Admin
        title="{{ title }}"
        theme={muiTheme}
        dataProvider={restClient('{{ rest_server_url }}')}
        authProvider={authProvider}
    >
    {% for name, actions in resources.items() %}
    {% if actions.has_methods %}
        <Resource
            name="{{ actions.path }}"
            {% for action, details in actions.items() %}
            {% if action in supported_components %}
            {{ action }}={ {{ actions.title }}{{ action|title }} }
            {% endif %}
            {% endfor %}
        />
    {% endif %}
    {% endfor %}
    </Admin>
);

export default App;
/** End of Generated Code **/