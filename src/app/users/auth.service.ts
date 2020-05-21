import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserChat } from '../chat/models/user-chat';
import { map, catchError } from 'rxjs/operators';
import { URL_BACKEND } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private urlEndPoint: string = URL_BACKEND + '/api/user';

  private HtttpHeaders = new HttpHeaders({'Content-Type': 'application/json'}); 

  constructor(private http: HttpClient) { }


  login(user: UserChat): Observable<any>{

    return this.http.post(`${this.urlEndPoint}/oauth`, user)
      .pipe(
        map((response: any) => response.user as UserChat),
        catchError(e => {
          if (e.error.mensaje) {
            console.error(e.error.mensaje);
          }
          return throwError(e);
        }));
      

  }

}
