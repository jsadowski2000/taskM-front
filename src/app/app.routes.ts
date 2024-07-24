import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TaskListComponent } from './tasklist/tasklist.component';
import { AuthGuard } from './auth/authguard';


export const routeConfig: Routes = [
    {path: '', component:LoginComponent},
    {path: 'register', component:RegisterComponent},
    {path: 'tasks', component:TaskListComponent,canActivate:[AuthGuard]} 
];



export default routeConfig;



  
