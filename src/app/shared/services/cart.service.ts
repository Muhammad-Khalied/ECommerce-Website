import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../Base/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItemsNumber = new BehaviorSubject(0);
  x = Inject(PLATFORM_ID);

  constructor(private _http:HttpClient) { }

  ngOnInit(): void {
    this.getCartProducts().subscribe({
      next:(res)=>{
        console.log(res);
        this.cartItemsNumber.next(res.numOfCartItems);
      }
    })
  }

  addProductToCart(id:string):Observable<any>{
    return this._http.post(`${environment.baseUrl}/cart`, 
      {
        productId:id
      },
      {
        headers: {
          token:localStorage.getItem('userToken')!
        }
      }
    );
  }

  updateProductQuantity(id:string, quantity:number):Observable<any>{
    return this._http.put(`${environment.baseUrl}/cart/${id}`, 
      {
        count:quantity
      },
      {
        headers: {
          token:localStorage.getItem('userToken')!
        }
      }
    );
  }

  getCartProducts():Observable<any>{
    return this._http.get(`${environment.baseUrl}/cart`, {
      headers: {
        token:localStorage.getItem('userToken')!
      }
    });
  }

  removeProductFromCart(id:string):Observable<any>{
    return this._http.delete(`${environment.baseUrl}/cart/${id}`, {
      headers: {
        token:localStorage.getItem('userToken')!
      }
    });
  }

  removeAllProductsFromCart():Observable<any>{
    return this._http.delete(`${environment.baseUrl}/cart`, {
      headers: {
        token:localStorage.getItem('userToken')!
      }
    });
  }

}
