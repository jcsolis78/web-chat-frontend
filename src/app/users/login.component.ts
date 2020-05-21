import { Component, OnInit } from '@angular/core';
import { UserChat } from '../chat/models/user-chat';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {


  public title: string = 'Sign In'; 
  public user: UserChat; 
  public newUser: boolean = false; 


  constructor(public authService: AuthService,
    private router: Router) { 
    this.user = new UserChat();
  }

  ngOnInit(): void {
  }

  login(): void{
    console.log(this.user);

    if(this.user.username == null || this.user.username.length == 0  
      || this.user.password == null || this.user.password.length == 0){
      Swal.fire('Login Error', 'Bad Credentials','error');
      return; 
    }

    this.authService.login(this.user).subscribe(response => {
      console.log(response);
      this.router.navigate([`/chat/${response.username}`]); 
      Swal.fire('Login',`Welcome ${response.username}`);
    }, err => {
      if(err.status == 400){
        Swal.fire('Login Error', 'Bad Credentials','error');
      }
    } );
    

  }

}
