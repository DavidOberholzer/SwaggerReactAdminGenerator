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
            this.getAndLoadPermissions = this.getAndLoadPermissions.bind(this);
            this.loadPermissions = this.loadPermissions.bind(this);
            this.getResourcePermission = this.getResourcePermission.bind(this);
            this.manyResourcePermissions = this.manyResourcePermissions.bind(this);
            this.getPermissionFlags = this.getPermissionFlags.bind(this);
            PermissionsStore.instance = this;
        }
        return PermissionsStore.instance;
    }
    getAndLoadPermissions(requestDetails) {
        // Here one can make a request and send the result along to `loadPermissions`
        fetch('some_url', requestDetails)
            .then(response => this.loadPermissions(response.data))
            .catch(error => console.error(error));
    }
    loadPermissions(permissions) {
        // Here one can load the permissions object into localStorage and other things you would like.
        this.permissionFlags = {
            ...permissions
        };
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
