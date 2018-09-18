/**
 * Generated Menu.js code. Edit at own risk.
 * When regenerated the changes will be lost.
**/
import React from 'react';
import { connect } from 'react-redux';
import { MenuItemLink, getResources, Responsive } from 'react-admin';
import ListIcon from 'material-ui/svg-icons/action/view-list';
import { titleCase } from './utils';

const ICONS = {
    pets: <ListIcon />,
    users: <ListIcon />,
    categories: <ListIcon />,
}

const Menu = ({ resources, onMenuClick, logout }) => (
    <div>
        {resources
            ? resources.map(resource => (
                    <MenuItemLink
                        key={resource.name}
                        to={`/${resource.name}`}
                        primaryText={`${titleCase(resource.name)}`}
                        onClick={onMenuClick}
                        leftIcon={ICONS[resource.name]}
                    />
                ))
            : ''}
        <Responsive small={logout} medium={null} />
    </div>
);

const mapStateToProps = state => ({
    resources: getResources(state)
});

export default connect(mapStateToProps)(Menu);
/** End of Generated Menu.js Code **/