/**
 * Generated authPermissions.js code. Edit at own risk.
 * When regenerated the changes will be lost.
 **/

class PermissionsStore {
    constructor() {
        if (!PermissionsStore.instance) {
            this.requiredPermissions = {
                {% for name, details in resources.items() %}
                {% if details.methods %}
                {{ name }}: {
                    {% for method, action in details.methods.items() %}
                    {% if method != "show" %}
                    {{ method }}: {{ action.permissions }},
                    {% endif %}
                    {% endfor %}
                },
                {% endif %}
                {% endfor %}
            };
            this.permissionFlags = null;
            this.loadPermissions = this.loadPermissions.bind(this);
            this.getResourcePermission = this.getResourcePermission.bind(this);
            this.manyResourcePermissions = this.manyResourcePermissions.bind(this);
            this.getPermissionFlags = this.getPermissionFlags.bind(this);
            PermissionsStore.instance = this;
        }
        return PermissionsStore.instance;
    }
    loadPermissions(permissions) {
        // Given a list of the user permissions, the permission flags are loaded.
        this.permissionFlags = {};
        const allowAccess = (userPermissions, requiredPermissions) => {
            if (requiredPermissions.length > 0) {
                return requiredPermissions.every(permission => {
                    return userPermissions.has(permission);
                });
            } else {
                return true;
            }
        };
        const permissionSet = new Set(userPermissions);
        Object.entries(this.requiredPermissions).map(([resource, permissions]) => {
            this.permissionFlags[resource] = Object.entries(permissions).reduce(
                (total, [action, required]) => {
                    total[action] = allowAccess(permissionSet, required);
                    return total;
                },
                {}
            );
            return null;
        });
        localStorage.setItem('permissions', JSON.stringify(this.permissionFlags));
    }
    getResourcePermission(resource, permission) {
        if (this.permissionFlags) {
            return this.permissionFlags[resource] && this.permissionFlags[resource][permission];
        } else {
            let userPermissions = localStorage.getItem('permissions');
            if (userPermissions) {
                this.permissionFlags = JSON.parse(userPermissions);
                return this.permissionFlags[resource][permission];
            }
        }
        console.log('Permissions store not loaded yet.');
        return false;
    }
    manyResourcePermissions(resourcePermissions) {
        return resourcePermissions.every(([resource, permission]) =>
            this.getResourcePermission(resource, permission)
        );
    }
    getPermissionFlags() {
        if (!this.permissionFlags) {
            let userPermissions = localStorage.getItem('permissions');
            if (userPermissions) {
                this.permissionFlags = JSON.parse(userPermissions);
            }
        }
        return this.permissionFlags;
    }
}

const storeInstance = new PermissionsStore();
Object.freeze(PermissionsStore);

export default storeInstance;

/** End of Generated Code **/
