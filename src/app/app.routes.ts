import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { authGuard,  } from './guard/auth.guard';
import { TaskListComponent } from './tasklist/tasklist.component';


export const routeConfig: Routes = [
    {path: '', component:LoginComponent},
    {path: 'register', component:RegisterComponent},
    {path: 'tasks', component:TaskListComponent} //canActivate:[authGuard]
];



export default routeConfig;



  
