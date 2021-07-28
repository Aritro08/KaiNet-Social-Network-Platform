import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ProfileData } from 'src/app/models/profile.model';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html' ,
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {

  profileData: ProfileData;
  updatedProfileSub: Subscription;
  userId: string;
  id: string;
  
  constructor(private profileService: ProfileService, private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.route.paramMap.subscribe((params: ParamMap) => {
      if(params.has('id')) {
        this.id = params.get('id');
        this.profileService.getUserData(this.id).subscribe(userData => {
          this.profileData = userData;
          if(this.profileData.recvRequests.includes(this.userId)) {
            this.profileData.friendStatus = "Request sent";
          } else if (this.profileData.friendList.includes(this.userId)) {
            this.profileData.friendStatus = "Friend";
          } else if (this.profileData.sentRequests.includes(this.userId)) {
            this.profileData.friendStatus = "Pending request"
          }
        });
      }
    });
  }

  onAddFriend(user: ProfileData) {
    let id = user._id;
    this.profileService.sendRequest(id, this.userId);
    user.friendStatus = "Request sent";
  }

  onAcceptReq(user: ProfileData) {
    let id = user._id;
    this.profileService.acceptFriendRequest(id, this.userId);
    user.friendStatus = "Friend";
  }

  onRejectReq(user: ProfileData) {
    let id = user._id;
    this.profileService.rejectFriendRequest(id, this.userId);
    user.friendStatus = "Add friend";
  }

  // deleteAcc() {
  //   this.profileService.deleteUser(this.profileData._id);
  // }

}
