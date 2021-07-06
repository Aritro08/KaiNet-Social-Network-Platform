import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AuthFormComponent } from './auth/auth-form/auth-form.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { ProfileEditComponent } from './profile/profile-edit/profile-edit.component';
import { ProfileViewComponent } from './profile/profile-view/profile-view.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostViewComponent } from './posts/post-view/post-view.component';
import { CommentsComponent } from './posts/post-view/comments/comments.component';
import { ProfilePostsViewComponent } from './profile/profile-view/profile-posts-view/profile-posts-view.component';
import { SearchComponent } from './search/search.component';
import { UserListComponent } from './search/user-list/user-list.component';
import { FriendRequestsComponent } from './profile/profile-view/friend-requests/friend-requests.component';
import { FriendListComponent } from './profile/profile-view/friend-list/friend-list.component';
import { ChatroomsComponent } from './chatrooms/chatrooms.component';
import { RoomComponent } from './chatrooms/room/room.component';

const socketConfig: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AuthFormComponent,
    PostListComponent,
    ProfileEditComponent,
    ProfileViewComponent,
    PostCreateComponent,
    PostViewComponent,
    CommentsComponent,
    ProfilePostsViewComponent,
    SearchComponent,
    UserListComponent,
    FriendRequestsComponent,
    FriendListComponent,
    ChatroomsComponent,
    RoomComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    SocketIoModule.forRoot(socketConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
