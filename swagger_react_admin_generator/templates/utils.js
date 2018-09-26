/**
 * Generated utils.js code. Edit at own risk.
 * When regenerated the changes will be lost.
 **/

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
