import { Component, OnInit } from '@angular/core';
import { UserChat } from '../chat/models/user-chat';
import { UserService } from './user.service';
import { Router, ActivatedRoute } from '@angular/router';
import  swal from 'sweetalert2'

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public user: UserChat = new UserChat();
  public title: string = 'Crear Usuario';

  constructor(public userService: UserService,
    private router: Router,
    public activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
   this.getUser();
  }

   getUser(): void{
    this.activateRoute.params.subscribe(params => {     
      let username = params['username']
      console.log(username)
      if(username){
        this.userService.getUser(username).subscribe((u) => this.user = u

        )
      }
    })
  }

   create(): void{

    this.userService.create(this.user)
    .subscribe(user => {
      this.router.navigate(['/login']);
      swal.fire('New User',  `User ${user.username} has been created.`,'success'); 
      }); 

  }

  update(): void{
    this.userService.update(this.user)
    .subscribe( user => {
      this.router.navigate(['/users'])
      swal.fire('Updated',`User ${user.username} has been updated`,'success')
    })
  }



}
