import React from 'react';
import NotAllowed from '@material-ui/icons/NotInterested';

const NoPermissions = () => (
	<div>
        <div>
            <NotAllowed style={ { width: '9em', height: '9em' } } />
            <h1>Forbidden</h1>
            <div>You do not have any permissions</div>
        </div>
    </div>
)

export default NoPermissions;