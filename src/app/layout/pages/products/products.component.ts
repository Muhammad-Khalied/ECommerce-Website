import { Component } from '@angular/core';
import { RootObject } from '../../../shared/interfaces/product';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../../shared/services/cart.service';
import { ProductService } from '../../../shared/services/product.service';
import { LoadingComponent } from "../../additions/loading/loading.component";
import { RouterLink } from '@angular/router';
import { WishlistComponent } from '../wishlist/wishlist.component';
import { WishlistService } from '../../../shared/services/wishlist.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [LoadingComponent, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  productsDone: boolean = false;
  loading: boolean = false;
  sliderDone: boolean = false;
  productList: RootObject[] = [];
  wishList: string[] = [];
  search: string = '';

  constructor(protected _product: ProductService, private _cart: CartService, private _toastr:ToastrService, private _wish: WishlistService) { }

  ngOnInit(): void {
    this.getAllProducts();
    this.getWishList();
    localStorage.setItem('currentPage', 'products');
    this._cart.getCartProducts().subscribe({
      next:(res)=>{
        this._cart.cartItemsNumber.next(res.numOfCartItems);
      }
    })
  }

  getAllProducts() {
    this._product.getProducts().subscribe({
        next: (response) => { 
          this.productList = response.data;
          // console.log(this.productList);
          this.productsDone = true;
        },
        error: (error) => { 
          console.log(error);
          this.productsDone = true;
        },
      });
  }

  addProductToCart(id: string) {
    this.loading = true;
    this._cart.addProductToCart(id).subscribe({
      next: (res)=> {
        // console.log(res);
        this._cart.cartItemsNumber.next(res.numOfCartItems);
        this._toastr.success(res.message);
        this.loading = false;
      },
      error: (err)=> {
        console.log(err);
        this._toastr.error(err.message);
        this.loading = false;
      }
    })
  }

  searchItem(event: any) {
    this.search = event.target.value;
  }

  getWishList(){
    this._wish.getWishList().subscribe({
      next:(res)=>{
        // console.log(res);
        for(let item of res.data){
          this.wishList.push(item.id);
        }
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

  addToWishList(id: string) {
    this.loading = true;
    this._wish.addToWishList(id).subscribe({
      next: (res)=> {
        // console.log(res);
        this.wishList = res.data;
        this._toastr.success(res.message);
        this.loading = false;
      },
      error: (err)=> {
        console.log(err);
        this._toastr.error(err.message);
        this.loading = false;
      }
    })
  }

  removeFromWishList(id: string) {
    this.loading = true;
    this._wish.removeFromWishList(id).subscribe({
      next: (res)=> {
        // console.log(res);
        this.wishList = res.data;
        this._toastr.success(res.message);
        this.loading = false;
      },
      error: (err)=> {
        console.log(err);
        this._toastr.error(err.message);
        this.loading = false;
      }
    })
  }

  
}
