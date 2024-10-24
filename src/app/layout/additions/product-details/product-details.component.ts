import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../shared/services/product.service';
import { RootObject } from '../../../shared/interfaces/product';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CartService } from '../../../shared/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { LoadingComponent } from "../loading/loading.component";
import { WishlistService } from '../../../shared/services/wishlist.service';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CarouselModule, LoadingComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})

export class ProductDetailsComponent {
  id!:string;
  isWish: boolean = false;
  isDone = false;
  loading: boolean = false;
  productDetails!: RootObject ;
  platform = inject(PLATFORM_ID);


  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }


  constructor(private _route:ActivatedRoute, private _product: ProductService, private _cart:CartService, private _toastr:ToastrService, private _wish: WishlistService, private _auth: AuthService) { 
  }

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
    });
    if(isPlatformBrowser(this.platform))
      localStorage.setItem('currentPage', `productDetails/${this.id}`);
    this.getProductDetails();
  }

  getProductDetails(){
    this._product.getSpecificProduct(this.id).subscribe({
      next: (res)=>{
        this.productDetails = res.data;
        if(this._auth.isLogin.value){
          this.getWishList();
        }else{
          this.isDone = true;
          this.isWish = false;
        }
        // console.log(this.productDetails);
      },
      error: (err) => {
        console.log(err);
      }
    })

  }

  addProductToCart(id: string) {
    if(!this._auth.isLogin.value){
      this._toastr.info('Please login to add product to cart');
      return;
    }
    this.loading = true;
    this._cart.addProductToCart(id).subscribe({
      next: (res)=> {
        // console.log(res);
        this._toastr.success(res.message);
        this._cart.cartItemsNumber.next(res.numOfCartItems);
        localStorage.setItem('cartItemsNumber', res.numOfCartItems);
        this.loading = false;
      },
      error: (err)=> {
        console.log(err);
        this._toastr.error(err.message);
        this.loading = false;
      }
    })
  }

  addToWishList(id: string) {
    if(!this._auth.isLogin.value){
      this._toastr.info('Please login to add product to cart');
      return;
    }
    this.loading = true;
    this._wish.addToWishList(id).subscribe({
      next: (res)=> {
        // console.log(res);
        this._toastr.success(res.message);
        this.loading = false;
        this.isWish = true;
      },
      error: (err)=> {
        console.log(err);
        this._toastr.error(err.message);
        this.loading = false;
      }
    })
  }

  removeFromWishList(id: string) {
    if(!this._auth.isLogin.value){
      this._toastr.info('Please login to add product to cart');
      return;
    }
    this.loading = true;
    this._wish.removeFromWishList(id).subscribe({
      next: (res)=> {
        // console.log(res);
        this._toastr.success(res.message);
        this.loading = false;
        this.isWish = false;
      },
      error: (err)=> {
        console.log(err);
        this._toastr.error(err.message);
        this.loading = false;
        this.isWish = false;
      }
    })
  }

  getWishList(){
    this._wish.getWishList().subscribe({
      next:(res)=>{
        for(let item of res.data){
          if(item.id === this.id){
            this.isWish = true;
          }
        }
        this.isDone = true;
      },
      error:(err)=>{
        console.log(err);
        this.isDone = true;
      }
    })
  }


}
