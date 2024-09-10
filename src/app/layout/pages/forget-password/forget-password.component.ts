import { Component, inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { FlowbiteService } from '../../../shared/services/flowbite.service';
import { FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {
  errorMessage: string = '';
  successMessage: string = '';
  email: string = '';
  isLoading : boolean = false;
  formNumber : number = 1;
  platform = inject(PLATFORM_ID);

  constructor(private _auth: AuthService, private flowbiteService: FlowbiteService, private _router: Router, private _toastr:ToastrService ) { }

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite(flowbite => {
    // Your custom code here
    console.log('Flowbite loaded', flowbite);
    });

    this.formNumber = 1;
    if(isPlatformBrowser(this.platform))
      localStorage.setItem('currentPage', 'forgetPassword');
  }


  emailForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
  });

  codeForm: FormGroup = new FormGroup({
    resetCode: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]{5,6}$/)]),
  });

  resetForm: FormGroup = new FormGroup({
    // email: new FormControl(null, [Validators.required, Validators.email]),
    newPassword: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Z][a-z0-9]{5,14}$/)]),
    confirmPassword: new FormControl(null, [Validators.required, this.confirmPasswordValidator.bind(this)]),
  });

  confirmPasswordValidator(control: FormControl): ValidationErrors | null {
    // Check if control.parent exists (might not be fully initialized yet)
    if (!control.parent) {
      return null;
    }

    // Access the password control from the parent form group
    const passwordControl = control.parent.get('newPassword');
    const confirmPasswordControl = control.parent.get('confirmPassword');

    // Check if both password and rePassword controls exist
    if (!passwordControl || !confirmPasswordControl) {
      return null; // Avoid errors during initialization
    }

    const password = passwordControl.value;
    const rePassword = confirmPasswordControl.value;

    if (password !== rePassword && rePassword != null) {
      return { confirmPasswordError: 'Passwords must match' };
    }

    return null;
  }

  verifyEmail(){
    this.isLoading = true;
    this._auth.forgetPassword(this.emailForm.value.email).subscribe({
      next: (response) => {
        // console.log(response);
        if(response.statusMsg == 'success'){
          this.errorMessage = '';
          this.email = this.emailForm.value.email;
          this._toastr.success(response.message);
          this.isLoading = false;
          this.formNumber++;
        }
      },
      error: (errorMessage) => {
        this.errorMessage = errorMessage.error.message;
        this.isLoading = false;
      }
    });
  }

  verifyCode(){
    this.isLoading = true;
    this._auth.verifyCode(this.codeForm.value.resetCode).subscribe({
      next: (response) => {
        // console.log(response);
        if(response.status == 'Success'){
          this.errorMessage = '';
          this.isLoading = false;
          this.formNumber++;
        }
      },
      error: (errorMessage) => {
        this.errorMessage = errorMessage.error.message;
        this.isLoading = false;
      }
    });
  }

  resetPassword(){
    this.isLoading = true;
    this._auth.resetPassword(this.email, this.resetForm.value.newPassword).subscribe({
      next: (response) => {
        if(response.token){
          this.errorMessage = '';
          this.isLoading = false;
          this._router.navigate(['/login']);
        }
      },
      error: (errorMessage) => {
        this.errorMessage = errorMessage.error.message;
        this.isLoading = false;
      }
    });
  }

}
