import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,RouterModule,MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private toastr: ToastrService,private router:Router){}
  registerData = {
    email: '',
    username:'',
    password: '',
  };

  resetForm(){
    this.registerData.email ='';
    this.registerData.username ='';
    this.registerData.password ='';
  }

  

  async onRegisterSubmit() {
    console.log(this.registerData);

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const response = await fetch('http://localhost:5099/user/', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(this.registerData),
    });

    if (!response.ok) {
      console.log('TOAST');
      this.toastr.error('Register Failed. Please check your data', 'ERROR', { timeOut: 5000 });
      this.resetForm();
    } else {
      this.toastr.success('Reguster successful, Have Fun', 'Succes', { timeOut: 5000 });
      this.router.navigateByUrl('/');
      
    }
  }
}


