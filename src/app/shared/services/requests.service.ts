import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { v4 as uuidv4 } from 'uuid';
import { MD5 } from 'crypto-js'; 
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {

  private audio: HTMLAudioElement | undefined;
  
  private assetsPath = 'assets/img/product-image/';

  baseUrl = environment.CLIENT_SERVER_URI ;
  private sharedVariable = new BehaviorSubject<boolean>(false);


  private dataSource = new BehaviorSubject<any>(null);
  currentData = this.dataSource.asObservable();


  constructor(private http: HttpClient, protected Auth: AuthService) { }
   
  sharedVariable$ = this.sharedVariable.asObservable();
  
  // Method to change the data
  changeData(data: any) {
    this.dataSource.next(data);
  } 
  

  createHeader(){
    const token = this.Auth.getToken();

    let uuid = uuidv4();
    if (token) {
      const  headers = new HttpHeaders()
        .set('Authorization', 'Bearer ' + token)
        .set('XSRF-TOKEN', uuid)
        .set('X-XSRF-TOKEN', MD5(uuid + environment.CSRF_SECRET).toString());
      return headers;
    }
    else{
      const  headers = new HttpHeaders()
        .set('XSRF-TOKEN', uuid)
        .set('X-XSRF-TOKEN', MD5(uuid + environment.CSRF_SECRET).toString());
      return headers;
    }
  }

  createSimpleHeader(){
    const  headers = new HttpHeaders();
    return headers;
  }

  post(uri: string, data?: any){
    return this.http.post<any>(this.baseUrl + uri, data , {headers: this.createHeader()});
  }

  patch(uri: string, data: any){
    return this.http.patch<any>(this.baseUrl + uri, data , {headers: this.createHeader()});

  }
  get(uri: string){
    return this.http.get<any>(this.baseUrl + uri , {headers: this.createHeader()});
  } 
  delete(uri: string){
    return this.http.delete<any>(this.baseUrl + uri , {headers: this.createHeader()});
  }
  getFile(uri: string): Observable<Blob> {
    return this.http.get(uri, { headers: this.createHeader(), responseType: 'blob' });
  }

  setSharedVariable(value: any) {
    this.sharedVariable.next(value);
  }

  getSharedVariable() {
    return this.sharedVariable.value;
  }
 
 
 
 
 

}
