import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { HttpClientModule } from '@angular/common/http'; 
import { UsersComponent } from './users/users.component'; 
import { UserService } from './users/user.service';
import { Routes, RouterModule } from '@angular/router';
import { FormComponent } from './users/form.component';
import { ProfileComponent } from './users/profile/profile.component';
import { LoginComponent } from './users/login.component';



const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'users', component: UsersComponent},
  {path: 'users/form', component: FormComponent},
  {path: 'users/form/:username', component: FormComponent},
  {path: 'users/profile/:username', component: ProfileComponent},
  {path: 'login', component: LoginComponent},
  {path: 'chat/:username', component: ChatComponent}
]; 

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    UsersComponent,
    FormComponent,
    ProfileComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    AppRoutingModule,
    FormsModule


  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
