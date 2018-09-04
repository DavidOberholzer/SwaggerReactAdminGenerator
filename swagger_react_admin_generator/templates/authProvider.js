/**
 * Generated authProvider.js code. Edit at own risk.
 * When regenerated the changes will be lost.
**/
import { AUTH_CHECK, AUTH_ERROR, AUTH_LOGIN, AUTH_LOGOUT } from 'react-admin';

export default (type, params) => {
    if (type === AUTH_LOGIN) {
        const { username, password } = params;
        if (username === 'admin' && password === 'admin') {
            localStorage.setItem('token', 'tempToken');
        } else {
            return Promise.reject();
        }
    }
    if (type === AUTH_LOGOUT) {
        localStorage.removeItem('token');
    }
    if (type === AUTH_ERROR) {
        const status = params.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('token');
            return Promise.reject();
        }
    }
    if (type === AUTH_CHECK) {
        if (localStorage.getItem('token')) {
            return Promise.reject();
        }
    }
    return Promise.resolve();
}
/** End of Generated authProvider.js Code **/