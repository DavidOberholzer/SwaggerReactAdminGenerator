/**
 * Generated ReactAdmin.js code. Edit at own risk.
 * When regenerated the changes will be lost.
**/
import { Admin, Resource } from 'react-admin';

import authProvider from './auth/authProvider';
import PermissionsStore from './auth/PermissionsStore';
import MyLayout from './MyLayout';
import restClient from './restClient';
import { muiTheme } from './theme';

import {
    PetList,
    PetCreate,
    PetShow,
    PetEdit,
} from './resources/Pet';

import {
    UserList,
    UserCreate,
    UserShow,
    UserEdit,
} from './resources/User';

import {
    CategoryList,
    CategoryCreate,
    CategoryShow,
} from './resources/Category';


const ReactAdmin = () => (
    <Admin
        appLayout={MyLayout}
        authProvider={authProvider}
        dataProvider={restClient('')}
        title="A Pet Admin"
        theme={muiTheme}
    >
        {permissions => [
                PermissionsStore.getResourcePermission('pets', 'list')
                    ? <Resource
                        name="pets"
                        list={ PetList }
                        create={PermissionsStore.getResourcePermission('pets', 'create') ? PetCreate : null}
                        show={ PetShow }
                        edit={PermissionsStore.getResourcePermission('pets', 'edit') ? PetEdit : null}
                    /> : null,
                PermissionsStore.getResourcePermission('users', 'list')
                    ? <Resource
                        name="users"
                        list={ UserList }
                        create={PermissionsStore.getResourcePermission('users', 'create') ? UserCreate : null}
                        show={ UserShow }
                        edit={PermissionsStore.getResourcePermission('users', 'edit') ? UserEdit : null}
                    /> : null,
                PermissionsStore.getResourcePermission('categories', 'list')
                    ? <Resource
                        name="categories"
                        list={ CategoryList }
                        create={PermissionsStore.getResourcePermission('categories', 'create') ? CategoryCreate : null}
                        show={ CategoryShow }
                    /> : null,
        ]}
    </Admin>
);

export default ReactAdmin;
/** End of Generated Code **/