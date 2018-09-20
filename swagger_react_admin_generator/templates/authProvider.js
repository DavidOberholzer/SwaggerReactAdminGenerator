/**
 * Generic Admin on rest Auth Client!
 * Change for your desired auth client setup.
**/
import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK } from 'react-admin';

export default (type, params) => {
    if (type === AUTH_LOGOUT) {
        {% if permissions %}
        localStorage.removeItem('permissions');
        {% endif %}
        localStorage.removeItem('token');
        return Promise.resolve();
    }
    if (type === AUTH_ERROR) {
        const status  = params.message.status;
        if (status === 401 || status === 403) {
            {% if permissions %}
            localStorage.removeItem('permissions');
            {% endif %}
            localStorage.removeItem('token');
            return Promise.reject();
        }
        return Promise.resolve();
    }
    if (type === AUTH_CHECK) {
        return {% if permissions %}localStorage.getItem('permissions') && {% endif %}localStorage.getItem('token') ? Promise.resolve() : Promise.reject();
    }
    return Promise.resolve();
}
/* End of Generic authClient.js */