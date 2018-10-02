/**
 * Generated catchAll.js code. Edit at own risk.
 * When regenerated the changes will be lost.
 **/
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { NotFound } from 'react-admin';

{% if permissions %}
import NoPermissions from './pages/NoPermissions';
{% endif %}

class catchAll extends Component {
    render() {
        return localStorage.getItem('id_token') ? (
            {% if permissions %}
            localStorage.getItem('{% if permissions_store %}permissions{% else %}role{% endif %}') ? (
                <NotFound />
            ) : (
                <NoPermissions />
            )
            {% else %}
            <NotFound />
            {% endif %}
        ) : (
            <Redirect push to="/login" />
        );
    }
}

export default catchAll;
/** End of Generated Code **/
