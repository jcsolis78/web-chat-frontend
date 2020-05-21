import { Component, OnInit } from '@angular/core';
import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Message } from './models/message';
import { UserChat } from './models/user-chat';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '../users/modal.service';
import { URL_BACKEND } from '../config/config';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  private client: Client; 
  connected: boolean = false; 
  message: Message = new Message();
  messages: Message[] = []; 

  

  user: UserChat = new UserChat();  
  users: UserChat[] = []; 

  userSelected: UserChat; 

  writing: string; 
  clientId: string; 

  urlBackend: string = URL_BACKEND; 

  constructor(public activateRoute: ActivatedRoute, 
    public modalService: ModalService, 
    private router: Router) {
    this.clientId = 'id-' + new Date().getUTCMilliseconds() + '-' + Math.random().toString(36).substr(2); 
   }

  ngOnInit(): void {
    
    

    this.client = new Client();
    this.client.webSocketFactory = ()=>{
      return new SockJS( URL_BACKEND +  "/webchat"); 
    }

    this.readParameter();


    this.client.onConnect = (frame) => {
      console.log('Conectados: ' + this.client.connected + " : " + frame); 
      this.connected = true; 

      this.client.subscribe('/chat/message', event => {
        let message: Message = JSON.parse(event.body) as Message;
        message.date = new Date(message.date); 

        if(!this.message.color && message.typeMessage == 'NEW_USER' 
          && this.message.username == message.username){

            this.message.color = message.color; 

            this.user.username = message.username; 
            this.user.status = true; 


        }

        this.messages.push(message); 
        this.client.publish({destination: '/app/users', body: JSON.stringify(this.user)});
        console.log(message); 
        console.log("Nuevo "); 
      }); 

      this.client.subscribe('/chat/writing', event => {
            this.writing = event.body;
            setTimeout(() => this.writing = '', 3000)
      });

      this.client.subscribe('/chat/history/' + this.clientId, event => {
          const historyChat = JSON.parse(event.body) as Message[];
          this.messages = historyChat.map(m => {
            m.date = new Date(m.date);
            return m; 
          }).reverse(); 
      }); 

      this.client.subscribe('/chat/users', event => {
        const userChat = JSON.parse(event.body) as UserChat[];
        this.users = userChat.map(u => {
          return u; 
        });
        console.log("Users: " + this.users.length); 
      });

      this.client.publish({destination: '/app/history', body: this.clientId}); 

      this.message.typeMessage='NEW_USER'; 
      this.client.publish({destination: '/app/message', body: JSON.stringify(this.message)}); 

      this.modalService.uploadNotifier.subscribe(user => {
        this.users = this.users.map(userOrigin => {
          if(user.id == userOrigin.id){
            userOrigin.picture = user.picture; 
          }
          return userOrigin; 
        })
      })

    }

    this.client.onDisconnect = (frame) => {
      console.log('Desconectados: ' + !this.client.connected + " : " + frame); 



      this.user.status=false; 

      this.connected = false; 
      this.message = new Message();
      this.messages = []; 
    }

    
  }

  readParameter(): void{
    this.activateRoute.paramMap.subscribe(params => {
      let username: string = params.get('username'); 
      if(username){
        this.message.username = username; 
        this.connect(); 
      }
    });
  }

  connect():void{
    this.client.activate(); 
  }

  unconnect():void{
    this.message.typeMessage='LEAVE'; 
    this.client.publish({destination: '/app/message', body: JSON.stringify(this.message)}); 
    this.client.publish({destination: '/app/users', body: JSON.stringify(this.user)});
    this.client.deactivate();
    this.router.navigate(['/login']); 
  }

  sendMessage():void{
    this.message.typeMessage='MESSAGE'; 
    this.client.publish({destination: '/app/message', body: JSON.stringify(this.message)}); 
    this.message.text = '';

  }

  writingEvent():void{
    this.client.publish({destination: '/app/writing', body: this.message.username}); 
  }

  modalOpen(user: UserChat){
    this.userSelected = user; 
    this.modalService.modalOpen(); 
  }

}
