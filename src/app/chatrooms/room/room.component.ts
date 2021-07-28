import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Chatroom } from 'src/app/models/chatroom.model';
import { ProfileData } from 'src/app/models/profile.model';
import { ProfileService } from 'src/app/profile/profile.service';
import { ChatroomsService } from '../chatroom.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html' ,
  styleUrls: ['./room.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class RoomComponent implements OnInit, OnDestroy {

  userId: string;
  userName: string;
  chatroomId: string;
  getMessage: Subscription;
  addedUser: Subscription;
  userLeft: Subscription;
  profileData: ProfileData;
  chatroom: Chatroom;
  roomMembers: ProfileData[];
  friends: ProfileData[];

  constructor(private route: ActivatedRoute, 
            private chatroomService: ChatroomsService, 
            private authService: AuthService,
            private profileService: ProfileService,
            private socket: Socket,
            private router: Router) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.profileService.getUserData(this.userId).subscribe(userData => {
      this.profileData = userData;
    });
    this.profileService.getUserFriends(this.userId).subscribe(resData => {
      this.friends = resData.friends;
    });
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.chatroomId = params.get('id');
      this.getRoomData();
    });
    this.getMessage = this.chatroomService.getChatMessage().subscribe(resData => {
      this.createMessageTemplate(resData.message, resData.from, resData.image, resData.datetime);
    });
    this.addedUser = this.chatroomService.getAddedUserStatus().subscribe(resData => {
      this.roomMembers.push(resData);
      this.chatroom.users.push(resData._id);
      const alertString = resData.username + " added to the room";
      this.createAlertTemplate(alertString);
    });
    this.userLeft = this.chatroomService.getUserLeftStatus().subscribe(resData => {
      this.roomMembers = this.roomMembers.filter(elem => elem.username !== resData.username);
      this.chatroom.users = this.chatroom.users.filter(id => id !== resData.memberId);
      const alertString = resData.username + " left the room";
      this.createAlertTemplate(alertString);
    });
  }

  addToRoom(user: ProfileData) {
    this.chatroomService.addMemberToRoom(user, this.chatroomId, this.chatroom.name).subscribe(() => {
      console.log(this.friends);
      this.getRoomData();
    });
  }

  leaveRoom() {
    this.chatroomService.leaveRoom(this.userId, this.chatroomId, this.chatroom.name, this.profileData.username).subscribe(() => {
      this.router.navigate(['/chatrooms']);
    });
  }

  getRoomData() {
    this.chatroomService.getChatroomData(this.chatroomId).subscribe(resData => {
      this.chatroom = resData.chatroom;
      this.roomMembers = resData.users;
      this.socket.connect();
      this.socket.emit('joinRoom', this.chatroom.name);
    });
  }

  onSubmit(messageForm: NgForm) {
    if(messageForm.valid) { 
      const datetime = this.getDatetime(); 
      const messageData = {
        roomName: this.chatroom.name,
        from: this.profileData.username,
        message: messageForm.value.message,
        image: this.profileData.profileImage,
        datetime: datetime
      }
      this.chatroomService.sendChatMessage(messageData, this.chatroom._id);
    }
    messageForm.resetForm();
  }

  createAlertTemplate(alert: string) {
    const chatBox = document.querySelector('.chat-box');
    const alertDiv = document.createElement('div');
    alertDiv.innerHTML = `
      <div class="chat-alert">
        <p class="chat-alert-text">${alert}</p>
      </div>
    `;
    chatBox.appendChild(alertDiv);
    chatBox.scrollTop = chatBox.scrollHeight; 
  }

  createMessageTemplate(message: string, from: string, image: string, datetime: string) {
    const textDiv = document.createElement('div');
    const chatBox = document.querySelector('.chat-box');
    textDiv.innerHTML = `
      <div class="message-row row">
        <div class="col-md img-col">
            <img src="${image}" class="msgimg img-responsive">
        </div>
        <div class="chat-content col-md-11">
            <p class="from">${from}</p>
            <p class="datetime">${datetime}</p>
            <p class="message">${message}</p>
        </div>
      </div>
    `;
    chatBox.appendChild(textDiv);
    chatBox.scrollTop = chatBox.scrollHeight; 
  }

  getDatetime() {
    const current = new Date();
    let date = current.getDate() + '/' + (current.getMonth()+1) + '/' + current.getFullYear();
    let min = current.getMinutes().toString();
    let hours = current.getHours().toString();
    if(current.getMinutes().toString().length == 1) {
      min = '0' + current.getMinutes().toString();
    } 
    if (current.getHours().toString().length == 1) {
      hours = '0' + current.getHours().toString();
    } 
    const datetime = date + ' ' + hours + ':' + min;
    return datetime;
  }

  onClose() {
    window.history.back();
  }

  ngOnDestroy() {
    this.socket.emit('leaveRoom', this.chatroom.name);
    this.socket.disconnect();
    this.getMessage.unsubscribe();
    this.addedUser.unsubscribe();
    this.userLeft.unsubscribe();
  }

}
