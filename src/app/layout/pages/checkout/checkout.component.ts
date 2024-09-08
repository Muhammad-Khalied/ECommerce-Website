import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentService } from '../../../shared/services/payment.service';
import { CartService } from '../../../shared/services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  isLoading: boolean = false;
  cartId : string = '';

  constructor(private _payment: PaymentService, private _cart: CartService, private _Router: Router) { }

  checkoutForm: FormGroup = new FormGroup({
    details: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]),
    phone: new FormControl(null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]),
    city: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(15)])
  });

  ngOnInit(): void {
    this.getCart();
    localStorage.setItem('currentPage', 'checkout');
  }

  getCart() {
    this._cart.getCartProducts().subscribe({
      next: (response) => {
        this.cartId = response.cartId;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  submitData() {
    this.isLoading = true;
    this._payment.checkout(this.cartId, this.checkoutForm.value).subscribe({
      next: (response) => {
        console.log(response);
        window.location.href = response.session.url;
        // console.log(response);
        this.isLoading = false;
      },
      error: (error) => {
        console.log(error);
        this.isLoading = false;
      }
    })

  }

  resetFrom() {
    this.checkoutForm.reset();
  }

}
