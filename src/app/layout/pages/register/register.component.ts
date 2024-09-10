import { Component, inject, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {


  errorMessage: string = '';
  isLoading : boolean = false;
  platform = inject(PLATFORM_ID);

  constructor(private _auth: AuthService, private _Router: Router) { }

  ngOnInit(): void {
    if(isPlatformBrowser(this.platform))
      localStorage.setItem('currentPage', 'register');
  }

  registerForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Z][a-z0-9]{5,14}$/)]),
    rePassword: new FormControl(null, [Validators.required, this.confirmPasswordValidator.bind(this)]),
    phone: new FormControl(null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)])
  });

  confirmPasswordValidator(control: FormControl): ValidationErrors | null {
    // Check if control.parent exists (might not be fully initialized yet)
    if (!control.parent) {
      return null;
    }

    // Access the password control from the parent form group
    const passwordControl = control.parent.get('password');

    // Check if both password and rePassword controls exist
    if (!passwordControl) {
      return null; // Avoid errors during initialization
    }

    const password = passwordControl.value;
    const rePassword = control.value;

    if (password !== rePassword) {
      return { confirmPasswordError: 'Passwords must match' };
    }

    return null;
  }

  submitData() {
    this.isLoading = true;
    // console.log(this.registerForm);
    this._auth.register(this.registerForm.value).subscribe({
      next: (response) => {
        if (response.message == 'success') {
          localStorage.setItem('userToken', response.token);
          this._Router.navigate(['/login']);
          // this._Router.navigateByUrl('/login');
        }
        this.isLoading = false;
      },
      error: (errorMessage) => { 
        // console.log(errorMessage) 
        this.errorMessage = errorMessage.error.message;
        this.isLoading = false;
      }
    });
  }

  clearFrom(){
    this.registerForm.reset();
  }

}
