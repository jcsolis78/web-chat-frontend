import { Component, OnInit, Input } from '@angular/core';
import { UserChat } from 'src/app/chat/models/user-chat';
import { UserService } from '../user.service';
import Swal from 'sweetalert2';
import { ModalService } from '../modal.service';
import { URL_BACKEND } from 'src/app/config/config';

@Component({
  selector: 'user-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  @Input() user: UserChat; 
  public title: string = 'User Details'; 
  public selectedPhoto: File; 

  urlBackend: string = URL_BACKEND; 

  constructor(private userService: UserService,
     public modalService: ModalService) { }

  ngOnInit(): void {
    
  }


  getPhoto(event){
      this.selectedPhoto = event.target.files[0]; 
      console.log(this.selectedPhoto); 
      if(this.selectedPhoto.type.indexOf('image') < 0){
        Swal.fire('Image error', 'The file is not an image','error'); 
        this.selectedPhoto = null; 
      }
  }
  setPhoto(){

    if(this.selectedPhoto){

        this.userService.uploadFile(this.selectedPhoto, this.user.username)
        .subscribe(user => {
          this.user = user;
          this.modalService.uploadNotifier.emit(this.user);
          Swal.fire('Image uploaded', `Image ${this.user.picture} successfully uploaded `,'success');
        });

    }else{
      
        Swal.fire('Upload error', 'You must select a picture','error'); 

    }
  }

  closeModal(){
    this.modalService.modalClose();
    this.selectedPhoto = null; 
  }

}
