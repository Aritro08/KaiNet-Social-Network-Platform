import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ProfileData } from 'src/app/models/profile.model';
import { ProfileService } from '../../profile.service';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.css']
})

export class FriendListComponent implements OnInit {

  user: ProfileData;
  userFriends: ProfileData[];
  userId: string;

  constructor(private profileService: ProfileService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.profileService.getUserFriends(this.userId).subscribe(resData => {
      this.userFriends = resData.friends;
    });
  }

  onDeleteFriend(id: string) {
    this.profileService.deleteFriend(id, this.userId);
    let delId = this.userFriends.findIndex(friend => friend._id === id);
    this.userFriends.splice(delId, 1);
  }

  viewUser(id: string) {
    this.router.navigate(['/profile/'+ id]);
  } 
}
