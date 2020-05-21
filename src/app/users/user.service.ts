import { Injectable } from '@angular/core';
import { UserChat } from '../chat/models/user-chat';
import { Observable, of,  throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { URL_BACKEND } from '../config/config';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private urlEndPoint: string =  URL_BACKEND + '/api/user';

  private HtttpHeaders = new HttpHeaders({'Content-Type': 'application/json'}); 

  constructor(private http: HttpClient) { }

  getUsers(): Observable<UserChat[]> {
    return this.http.get<UserChat[]>(this.urlEndPoint); 
  }

  create(user: UserChat): Observable<UserChat>{
    return this.http.post<UserChat>(this.urlEndPoint, user, {headers: this.HtttpHeaders})
  }

  getUser(username: string): Observable<UserChat>{
    return this.http.get<UserChat>(`${this.urlEndPoint}/${username}`);
  }

  update(user: UserChat): Observable<UserChat>{
    return this.http.put<UserChat>(`${this.urlEndPoint}/${user.username}`, user, {headers: this.HtttpHeaders})
  }

  delete(id: string): Observable<UserChat>{
    return this.http.delete<UserChat>(`${this.urlEndPoint}/${id}`, {headers: this.HtttpHeaders});
  }

  uploadFile(fileName: File, username: string): Observable<UserChat>{
    let formData = new FormData();
    formData.append("file", fileName);
    formData.append("username", username);
    return this.http.post(`${this.urlEndPoint}/upload`,formData).pipe(
      map((response: any) => response.user as UserChat),
      catchError(e => {
        console.error(e.error.message); 
        Swal.fire(e.error.message, e.error.error, 'error');
        return throwError(e);
        
      })
    );
  }
}
