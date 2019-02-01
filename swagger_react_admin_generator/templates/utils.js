/**
 * Generated utils.js code. Edit at own risk.
 * When regenerated the changes will be lost.
 **/

{% if permissions and not permissions_store %}
// Permissions check function
export const permitted = requiredPermissions => {
    const role = localStorage.getItem('role');
    if (allowedRoles) {
        const allowedRoles = new Set(requiredPermissions);
        return allowedRoles.has(role);
    } else {
        return true;
    }
}
{% endif %}

// Produce a title case string
export const titleCase = string => {
    return string
        .toLowerCase()
        .split(' ')
        .map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
};

/** End of Generated Code **/
