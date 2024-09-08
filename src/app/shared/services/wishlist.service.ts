import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { get } from 'http';
import { environment } from '../../Base/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(private _http:HttpClient) { }

  getWishList():Observable<any>{
    return this._http.get(`${environment.baseUrl}/wishlist`, {
      headers: {
        token:localStorage.getItem('userToken')!
      }
    });
  }

  addToWishList(id:string):Observable<any>{
    return this._http.post(`${environment.baseUrl}/wishlist`, {
      productId: id
    },
    {
      headers: {
        token:localStorage.getItem('userToken')!
      }
    }
    );
  }

  removeFromWishList(id:string):Observable<any>{
    return this._http.delete(`${environment.baseUrl}/wishlist/${id}`, 
      {
        headers: {
          token:localStorage.getItem('userToken')!
        }
      },
    )
  }

}
