import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ProfileData } from 'src/app/models/profile.model';
import { ProfileService } from 'src/app/profile/profile.service';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: ProfileData[] = [];
  curUser: ProfileData;
  userId: string;
  
  constructor(private searchService: SearchService, 
    private authService: AuthService, 
    private profileService: ProfileService,
    private router: Router) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.profileService.getUserData(this.userId).subscribe(user => {
      this.curUser = user;
    });
    this.searchService.emitUsers.subscribe(users => {
      if(users) {
        this.users = users;
        // this.setFriendStatus();
      }
    });
  }

  // onAddfriend(user: ProfileData) {
  //   let id = user._id;
  //   if(!this.curUser.friendList.includes(id)&&!this.curUser.sentRequests.includes(id)) {
  //     user.friendStatus = "Request sent";
  //     this.searchService.sendRequest(id, this.userId);
  //   }
  // }

  // onAcceptfriend(user: ProfileData) {
  //   let id = user._id;
  //   if(!this.curUser.friendList.includes(id)&&this.curUser.recvRequests.includes(id)) {
  //     user.friendStatus = "Friend";
  //     this.profileService.acceptFriendRequest(id, this.userId);
  //   }
  // }

  onViewProfile(id: string) {
    this.router.navigate(['/profile/' + id]);
  }

  // setFriendStatus() {
  //   if(this.curUser) {
  //     this.users.forEach(user => {
  //       let id = user._id;
  //       if(this.curUser.friendList.includes(id)) {
  //         user.friendStatus = "Friend";
  //       } else if(this.curUser.sentRequests.includes(id)) {
  //         user.friendStatus = "Request sent";
  //       } else if(this.curUser.recvRequests.includes(id)) {
  //         user.friendStatus = "Accept request";
  //       } else {
  //         user.friendStatus = "Add friend";
  //       }
  //     });
  //   }
  // }

}
