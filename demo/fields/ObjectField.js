/**
 * Generic React Admin Custom Fields!
 * Change/add at your own risk!
**/
import React from 'react';
import {
    TextField
} from 'react-admin';

const objectToText = ModifiedComponent => props => {
    let data = props.record[props.source];
    props.record[props.source] = data instanceof Object ? JSON.stringify(data) : data;
    return <ModifiedComponent {...props} addLabel />;
};

const ObjectField = objectToText(TextField);

export default ObjectField;
/* End of ObjectField.js */