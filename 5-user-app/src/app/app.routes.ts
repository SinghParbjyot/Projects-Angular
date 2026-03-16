import { Routes } from '@angular/router';
import { UserComponent } from './components/user/usercomponent';
import { UserForm } from './components/user-form/user-form';

export const routes: Routes = [
    {
        path: "",
        pathMatch : "full",
        redirectTo : "/users"
    },
    {
        path: 'users',
    component: UserComponent,
    },
    {
        path: 'users/create',
        component : UserForm
    },
    {
        path: 'users/edit/:id',
        component: UserForm
    }
    
];
