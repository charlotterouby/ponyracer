import { RegisterComponent } from '../register/register.component';
import { LoginComponent } from '../login/login.component';

export const USERS_ROUTES: Array<Object> = [
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'login',
        component: LoginComponent
    }
];
