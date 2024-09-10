import { Component, inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { FlowbiteService } from '../../../shared/services/flowbite.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  errorMessage: string = '';
  isLoading : boolean = false;
  platform = inject(PLATFORM_ID);

  constructor(private _auth: AuthService, private _Router: Router, private flowbiteService: FlowbiteService) { }

  ngOnInit(): void {
    
    if(isPlatformBrowser(this.platform))
      localStorage.setItem('currentPage', 'login');
  }

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Z][a-z0-9]{5,14}$/)])
  });

  submitData() {
    this.isLoading = true;
    // console.log(this.loginForm);
    this._auth.login(this.loginForm.value).subscribe({
      next: (response) => {
        if (response.message == 'success') {
          localStorage.setItem('userToken', response.token);
          this._auth.userInformation();
          this._Router.navigate(['/home']);
          this.isLoading = false;
        }
      },
      error: (errorMessage) => { 
        this.errorMessage = errorMessage.error.message;
        this.isLoading = false;
      }
    });
  }

  clearFrom(){
    this.loginForm.reset();
  }

}
