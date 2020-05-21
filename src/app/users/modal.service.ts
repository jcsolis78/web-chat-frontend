import { Injectable, EventEmitter } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ModalService {

  public modalCreate: boolean = false; 

  private _uploadNotifier = new EventEmitter<any>();

  constructor() { }

  get uploadNotifier(): EventEmitter<any>{
    return this._uploadNotifier; 
  }

  modalOpen(){
    this.modalCreate = true; 
  } 

  modalClose(){
    this.modalCreate = false; 
  }


}
