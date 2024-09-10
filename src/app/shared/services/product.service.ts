import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../Base/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private _categoriesDone = new BehaviorSubject<boolean>(false);
  categoriesDone$ = this._categoriesDone.asObservable();

  constructor(private _http:HttpClient) { }

  getProducts(page: string = '1'):Observable<any>{
    return this._http.get(`${environment.baseUrl}/products`,{
      params: {
        page: page,
        limit: '20',
      }
    });
  }

  getSpecificProduct(id:string):Observable<any>{
    return this._http.get(`${environment.baseUrl}/products/${id}`);
  }

  getCategories():Observable<any>{
    return this._http.get(`${environment.baseUrl}/categories`);
  }

  setCategoriesDone(status: boolean) {
    this._categoriesDone.next(status);
  }

}
