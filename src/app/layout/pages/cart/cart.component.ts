import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CartService } from '../../../shared/services/cart.service';
import { CartProducts, ProductElement } from '../../../shared/interfaces/cart-product';
import { log } from 'console';
import { LoadingComponent } from "../../additions/loading/loading.component";
import { RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [LoadingComponent, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {

  data!: CartProducts;
  productList: ProductElement[] = [];
  cartDone : boolean = false;
  updatingCart : boolean = false;
  platform = inject(PLATFORM_ID);
  emptyCart : boolean = false;

  constructor(private _cart:CartService) { }

  ngOnInit(): void {
    this.getCartProducts();
    this.updatingCart = true;
    if(isPlatformBrowser(this.platform))
      localStorage.setItem('currentPage', 'cart');
  }

  getCartProducts(){
    this._cart.getCartProducts().subscribe({
      next: (res)=> {
        this.data = res.data;
        this.productList = res.data.products;
        this.cartDone = true;
        this.updatingCart = false;
        this._cart.cartItemsNumber.next(res.numOfCartItems);
        localStorage.setItem('cartItemsNumber', res.numOfCartItems);
        if(this._cart.cartItemsNumber.value == 0)
          this.emptyCart = true;
        else
          this.emptyCart = false;
      },
      error: (err)=> {
        console.log(err);
        this.cartDone = true;
        this.updatingCart = false;
      }
    })
  }

  updateQuantity(productId:string, productCount:number){
    this.updatingCart = true;
    if(productCount <= 0){
      this._cart.removeProductFromCart(productId).subscribe({
        next: (res)=> {
          this._cart.cartItemsNumber.next(res.numOfCartItems);
          this.getCartProducts();
        },
        error: (err)=> {
          console.log(err);
        }
      })
    }
    else
    {
      this._cart.updateProductQuantity(productId, productCount).subscribe({
        next: (res)=> {
          this._cart.cartItemsNumber.next(res.numOfCartItems);
          this.getCartProducts();
        },
        error: (err)=> {
          console.log(err);
        }
      })
    }
    
  }

  clearCart(){
    this.updatingCart = true;
    this._cart.removeAllProductsFromCart().subscribe({
      next: ()=> {
        this.getCartProducts();
      },
      error: (err)=> {
        console.log(err);
      }
    })
  }

}

