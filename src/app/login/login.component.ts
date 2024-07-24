import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthResponseDto } from './authResponseInteface';
import { CookieService } from 'ngx-cookie-service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, RouterModule,MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,],
  providers: [ToastrService,CookieService],
})
export class LoginComponent {

  constructor(private toastr: ToastrService, private router: Router, private cookieService: CookieService){}


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
      this.cookieService.set('jwt', responseData.token);
      this.cookieService.set('refresh_token', responseData.refreshToken);
      this.router.navigateByUrl('/tasks');
    }                             
  }
}
