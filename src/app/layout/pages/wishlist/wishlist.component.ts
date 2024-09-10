import { Component, inject, PLATFORM_ID } from '@angular/core';
import { WishlistService } from '../../../shared/services/wishlist.service';
import { RootObject } from '../../../shared/interfaces/product';
import { CartService } from '../../../shared/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { LoadingComponent } from "../../additions/loading/loading.component";
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [LoadingComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent {
  addToWishList(id: string) {
    throw new Error('Method not implemented.');
  }
  wishDone: boolean = false;
  loading: boolean = false;
  wishList: RootObject[] = [];
  platform = inject(PLATFORM_ID);


  constructor(private _wish: WishlistService, private _cart: CartService, private _toastr:ToastrService) { }

  ngOnInit(): void {
    this.getWishList();
    if(isPlatformBrowser(this.platform))
      localStorage.setItem('currentPage', 'wishlist');
  }

  getWishList(){
    this._wish.getWishList().subscribe({
      next:(res)=>{
        // console.log(res);
        this.wishList = res.data;
        this.wishDone = true;
        this.loading = false;
      },
      error:(err)=>{
        console.log(err);
        this.wishDone = true;
        this.loading = false;
      }
    })
  }

  removeProductFromWishList(id:string){
    this.loading = true;
    this._wish.removeFromWishList(id).subscribe({
      next:(res)=>{
        // console.log(res);
        this._toastr.success(res.message);
        this.getWishList();
      },
      error:(err)=>{
        this._toastr.error(err.message);
        console.log(err);
      }
    })
  }

  addToCart(id : string){
    this.loading = true;
    this._cart.addProductToCart(id).subscribe({
      next:(res)=>{
        // console.log(res);
        this._toastr.success(res.message);
        this._cart.cartItemsNumber.next(res.numOfCartItems);
        localStorage.setItem('cartItemsNumber', res.numOfCartItems);
        this.loading = false;
      },
      error:(err)=>{
        this.loading = false;
        this._toastr.error(err.message);
        console.log(err);
      }
    })
  }
  
}
