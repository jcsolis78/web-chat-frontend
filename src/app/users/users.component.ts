import { Component, OnInit } from '@angular/core';
import { UserChat } from '../chat/models/user-chat';
import { UserService } from './user.service';
import Swal from 'sweetalert2';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {

  userChats: UserChat[];

  constructor(public userService: UserService, 
    public modalService: ModalService) { }

  ngOnInit(): void {

    this.userService.getUsers().subscribe(
      users => this.userChats = users
    );

  }

  delete(user: UserChat):void{
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: `Are you sure delete user ${user.username}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this.userService.delete(user.id).subscribe(
          response => {
            this.userChats = this.userChats.filter(usr => usr != user)
            swalWithBootstrapButtons.fire(
              'Deleted!',
              'User has been deleted.',
              'success'
            )

          }
        )


      } 
    })
  }

}
