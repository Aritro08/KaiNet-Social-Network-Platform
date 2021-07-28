import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthFormComponent } from './auth/auth-form/auth-form.component';
import { ChatroomsComponent } from './chatrooms/chatrooms.component';
import { RoomComponent } from './chatrooms/room/room.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostViewComponent } from './posts/post-view/post-view.component';
import { ProfileEditComponent } from './profile/profile-edit/profile-edit.component';
import { FriendListComponent } from './profile/profile-view/friend-list/friend-list.component';
import { FriendRequestsComponent } from './profile/profile-view/friend-requests/friend-requests.component';
import { ProfilePostsViewComponent } from './profile/profile-view/profile-posts-view/profile-posts-view.component';
import { ProfileViewComponent } from './profile/profile-view/profile-view.component';
import { SearchComponent } from './search/search.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path : '', component: PostListComponent},
  { path: 'login', component: AuthFormComponent},
  { path: 'sign-up', component: AuthFormComponent},
  { path: 'search', component: SearchComponent },
  { path: 'profile/:id', component: ProfileViewComponent, children: [
    { path: '', component: ProfilePostsViewComponent },
    { path: 'friend-requests', component: FriendRequestsComponent },
    { path: 'friend-list', component: FriendListComponent }
  ], canActivate: [AuthGuard]},
  { path: 'profile/edit/:id', component: ProfileEditComponent, canActivate: [AuthGuard] },
  { path: 'create-post', component: PostCreateComponent, canActivate: [AuthGuard]},
  { path: 'post/edit/:id', component: PostCreateComponent, canActivate: [AuthGuard]},
  { path: 'post/:id', component: PostViewComponent},
  { path: 'chatrooms', component: ChatroomsComponent, canActivate: [AuthGuard]},
  { path: 'chatroom/:id', component: RoomComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRoutingModule { }
