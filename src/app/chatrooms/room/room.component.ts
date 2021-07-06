import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Chatroom } from 'src/app/models/chatroom.model';
import { ProfileData } from 'src/app/models/profile.model';
import { ProfileService } from 'src/app/profile/profile.service';
import { ChatroomsService } from '../chatroom.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html' ,
  styleUrls: ['./room.component.css']
})

export class RoomComponent implements OnInit {

  userId: string;
  chatroomId: string;
  chatroom: Chatroom;
  roomMembers: ProfileData[];
  friends: ProfileData[];

  constructor(private route: ActivatedRoute, 
            private chatroomService: ChatroomsService, 
            private authService: AuthService,
            private profileService: ProfileService) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.profileService.getUserFriends(this.userId).subscribe(resData => {
      this.friends = resData.friends;
    });
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.chatroomId = params.get('id');
      this.getRoomData();
    });
  }

  addToRoom(memberId: string) {
    this.chatroomService.addMemberToRoom(memberId, this.chatroomId).subscribe(() => {
      this.getRoomData();
    });
  }

  getRoomData() {
    this.chatroomService.getChatroomData(this.chatroomId).subscribe(resData => {
      this.chatroom = resData.chatroom;
      this.roomMembers = resData.users;
    });
  }

}
