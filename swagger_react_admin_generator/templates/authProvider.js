// in src/authProvider.js
import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_GET_PERMISSIONS } from 'react-admin';
import decodeJwt from 'jwt-decode';

{% if permissions_store %}
import PermissionsStore from './PermissionsStore';
{% endif %}

export default (type, params) => {
    if (type === AUTH_LOGIN) {
        const { username, password } = params;
        const request = new Request('https://mydomain.com/authenticate', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        })
        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(({ token }) => {
                const decodedToken = decodeJwt(token);
                localStorage.setItem('token', token);
                {% if permissions %}
                {% if permissions_store %}
                PermissionsStore.loadPermissions(decodedToken.permissions);
                {% else %}
                localStorage.setItem('role', decodedToken.role);
                {% endif %}
                {% endif %}
            });
    }
    if (type === AUTH_LOGOUT) {
        localStorage.removeItem('token');
        {% if permissions %}
        localStorage.removeItem('{% if permissions_store %}permissions{% else %}role{% endif %}');
        {% endif %}
        return Promise.resolve();
    }
    if (type === AUTH_ERROR) {
        const status  = params.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('token');
            {% if permissions %}
            localStorage.removeItem('{% if permissions_store %}permissions{% else %}role{% endif %}');
            {% endif %}
            return Promise.reject();
        }
        return Promise.resolve();
    }
    if (type === AUTH_CHECK) {
        return localStorage.getItem('token'){% if permissions %} && localStorage.getItem('{% if permissions_store %}permissions{% else %}role{% endif %}'){% endif %} ? Promise.resolve() : Promise.reject();
    }
    {% if permissions %}
    if (type === AUTH_GET_PERMISSIONS) {
        {% if permissions_store %}
        const permissions = PermissionsStore.getPermissionFlags();
        {% else %}
        const permissions = localStorage.getItem('role');
        {% endif %}
        return permissions ? Promise.resolve(permissions) : Promise.reject();
    }
    {% endif %}
    return Promise.reject('Unknown method');
};