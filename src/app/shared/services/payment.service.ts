import { ShippingDetails } from '../interfaces/payment-data';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private _http: HttpClient) { }
  
  checkout(id: string, address: ShippingDetails): Observable<any> {
    // console.log(address , id);
    return this._http.post(`https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${id}?url=http://localhost:4200`,
      {
        shippingAddress: address
      },
      {
      headers:{
        token: localStorage.getItem('userToken')!
      }
    })
  }

}
