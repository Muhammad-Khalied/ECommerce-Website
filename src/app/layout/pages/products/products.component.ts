import { Component, inject, PLATFORM_ID } from '@angular/core';
import { RootObject } from '../../../shared/interfaces/product';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../../shared/services/cart.service';
import { ProductService } from '../../../shared/services/product.service';
import { LoadingComponent } from "../../additions/loading/loading.component";
import { RouterLink } from '@angular/router';
import { WishlistComponent } from '../wishlist/wishlist.component';
import { WishlistService } from '../../../shared/services/wishlist.service';
import { isPlatformBrowser } from '@angular/common';

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
  otherLoading: boolean = false;
  sliderDone: boolean = false;
  productList: RootObject[] = [];
  wishList: string[] = [];
  search: string = '';
  pageNumber: number = 1;
  platform = inject(PLATFORM_ID);

  constructor(protected _product: ProductService, private _cart: CartService, private _toastr:ToastrService, private _wish: WishlistService) { }

  ngOnInit(): void {
    if(isPlatformBrowser(this.platform)){
      if(localStorage.getItem('pageNumber') != null){
        this.pageNumber = parseInt(localStorage.getItem('pageNumber')!);
      }
      localStorage.setItem('currentPage', 'products');
    }
    this.getAllProducts(this.pageNumber.toString());
    this.getWishList();
    this._cart.getCartProducts().subscribe({
      next:(res)=>{
        this._cart.cartItemsNumber.next(res.numOfCartItems);
      }
    })
  }

  getAllProducts(page: string) {
    this._product.getProducts(this.pageNumber.toString()).subscribe({
        next: (response) => { 
          this.productList = response.data;
          // console.log(this.productList);
          this.otherLoading = false;
        },
        error: (error) => { 
          console.log(error);
          this.otherLoading = false;
        },
      });
  }

  nextPage(){
    if(this.pageNumber <= 2){
      this.otherLoading = true;
      this.pageNumber++;
      localStorage.setItem('pageNumber', this.pageNumber.toString());
      this.getAllProducts(this.pageNumber.toString());
    }else{
      this._toastr.info('No more products');
    }
  }

  previousPage(){
    if(this.pageNumber > 1){
      this.otherLoading = true;
      this.pageNumber--;
      localStorage.setItem('pageNumber', this.pageNumber.toString());
      this.getAllProducts(this.pageNumber.toString());
    }else{
      this._toastr.info('The is the first page');
    }
  }

  addProductToCart(id: string) {
    this.loading = true;
    this._cart.addProductToCart(id).subscribe({
      next: (res)=> {
        // console.log(res);
        this._cart.cartItemsNumber.next(res.numOfCartItems);
        localStorage.setItem('cartItemsNumber', res.numOfCartItems);
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
          this.productsDone = true;
        }
      },
      error:(err)=>{
        console.log(err);
        this.productsDone = true;
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
