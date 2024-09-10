import { Router } from '@angular/router';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentService } from '../../../shared/services/payment.service';
import { CartService } from '../../../shared/services/cart.service';
import { isPlatformBrowser } from '@angular/common';
import { AddressService } from '../../../shared/services/address.service';

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
  cartNumber : number = 0;
  platform = inject(PLATFORM_ID);

  constructor(private _address: AddressService, private _cart: CartService, private _Router: Router) { }

  checkoutForm: FormGroup = new FormGroup({

    details: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    phone: new FormControl(null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]),
    city: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(15)])
  });

  ngOnInit(): void {
    this.getCart();
    if(isPlatformBrowser(this.platform)){
      if(parseInt(localStorage.getItem('cartItemsNumber')!) == 0){
        this._Router.navigate([localStorage.getItem('currentPage')!]);
      }
      localStorage.setItem('currentPage', 'checkout');
    }
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
    this._address.checkout(this.cartId, this.checkoutForm.value).subscribe({
      next: (response) => {
        console.log(this.checkoutForm.value);
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
