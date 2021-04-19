import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ProfileData } from 'src/app/models/profile.model';
import { ProfileService } from '../../profile.service';

@Component({
  selector: 'app-friend-requests',
  templateUrl: './friend-requests.component.html',
  styleUrls: ['./friend-requests.component.css']
})

export class FriendRequestsComponent implements OnInit {

  user: ProfileData;
  userRequests: ProfileData[];
  userId: string;

  constructor(private profileService: ProfileService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.profileService.getUserFriendRequests(this.userId).subscribe(resData => {
      this.userRequests = resData.requests;
    });
  }

  onAcceptReq(id: string) {
    this.profileService.acceptFriendRequest(id, this.userId);
    this.removeReq(id);
  }

  onRejectReq(id: string) {
    this.profileService.rejectFriendRequest(id, this.userId);
    this.removeReq(id);
  }

  removeReq(id: string) {
    let delId = this.userRequests.findIndex(request => request._id === id);
    this.userRequests.splice(delId, 1)
  }

  viewUser(id: string) {
    this.router.navigate(['/profile/'+ id]);
  }
}
