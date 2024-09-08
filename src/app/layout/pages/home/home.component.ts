import { Component } from '@angular/core';
import { ProductService } from '../../../shared/services/product.service';
import { RootObject } from '../../../shared/interfaces/product';
import { RouterLink } from '@angular/router';
import { LoadingComponent } from "../../additions/loading/loading.component";
import { MainSliderComponent } from '../../additions/main-slider/main-slider.component';
import { CategorySliderComponent } from '../../additions/category-slider/category-slider.component';
import { CartService } from '../../../shared/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../../shared/services/wishlist.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, LoadingComponent, MainSliderComponent, CategorySliderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {
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
    localStorage.setItem('currentPage', 'home');
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

}