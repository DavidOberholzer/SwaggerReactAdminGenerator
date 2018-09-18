/**
 * Generic React Admin Custom Fields!
 * Change/add at your own risk!
 **/
import React from 'react';

// WORKAROUND: For SimpleShowLayout not allowing any fields without props
// IE nulled fields from permissions checks...
// If a permission check is not true then an empty field with props is used.
class EmptyField extends React.Component {
    render() {
        return null;
    }
}

export default EmptyField;
/* End of EmptyField.js */
