import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthResponseDto } from './authResponseInteface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, RouterModule],
  providers: [ToastrService],
})
export class LoginComponent {

  constructor(private toastr: ToastrService, private router: Router){}


  loginData = {
    email: '',
    password: '',
  };


  async onLoginSubmit() {
    console.log(this.loginData);

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const response = await fetch('http://localhost:5099/auth/login', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(this.loginData),
    });

    if (!response.ok) {
      console.log('TOAST');
      this.toastr.error('Login Failed', 'ERROR', { timeOut: 5000 });

    } else 
    {
      const responseData: AuthResponseDto = await response.json();
      this.toastr.success('Login successful', 'Succes', { timeOut: 5000 });
      localStorage.setItem('jwt', responseData.token);
      localStorage.setItem('refresh_token', responseData.refreshToken)
      this.router.navigateByUrl('/tasks');
    }                             
  }
}
