import { Routes } from '@angular/router';
import { UserComponent } from './components/user/usercomponent';
import { UserForm } from './components/user-form/user-form';
import { Auth } from './components/auth/auth';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'users/page/0'
    },
    {
        path: 'users',
        component: UserComponent,
    },
    {
        path: 'users/create',
        component: UserForm,
        canActivate: [authGuard]
    },
    {
        path: 'users/edit/:id',
        component: UserForm,
        canActivate: [authGuard]
    }, {
        path: 'users/page/:page',
        component: UserComponent,
    },
    {
        path: 'login',
        component: Auth
    }

];
