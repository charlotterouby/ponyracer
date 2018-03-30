import { HomeComponent } from './home/home.component';
import { RacesComponent } from './races/races.component';
import { RegisterComponent } from './register/register.component';

export const ROUTES: Array<object> = [
    { path: '', component: HomeComponent },
    { path: 'races', component: RacesComponent },
    { path: 'register', component: RegisterComponent }
];