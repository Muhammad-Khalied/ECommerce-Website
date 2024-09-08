import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../Base/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private _http:HttpClient) { }


  getCategories():Observable<any>{
    return this._http.get(`${environment.baseUrl}/categories`);
  }

  getSpecificCategory(id:string):Observable<any>{
    return this._http.get(`${environment.baseUrl}/categories/${id}`);
  }

  getSubCategories():Observable<any>{
    return this._http.get(`${environment.baseUrl}/subcategories`);
  }

  getSpecificSubCategory(id:string):Observable<any>{
    return this._http.get(`${environment.baseUrl}/subcategories/${id}`);
  }

  getSubcategoriesOfCategory(id:string):Observable<any>{
    return this._http.get(`${environment.baseUrl}/categories/${id}/subcategories`);
  }


}
