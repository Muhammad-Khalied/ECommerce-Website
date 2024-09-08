import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../Base/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(private _http: HttpClient) { }

  getBrands():Observable<any>{
    return this._http.get(`${environment.baseUrl}/brands`);
  }

  getSpecificBrand(id:string):Observable<any>{
    return this._http.get(`${environment.baseUrl}/brands/${id}`);
  }

}
