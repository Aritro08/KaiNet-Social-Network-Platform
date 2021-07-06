import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Chatroom } from '../models/chatroom.model';
import { ChatroomsService } from './chatroom.service';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatrooms.component.html',
  styleUrls: ['./chatrooms.component.css']
})

export class ChatroomsComponent implements OnInit {

  roomName: string;
  userId: string;
  chatlist: Chatroom[];

  constructor(private authService: AuthService, private chatroomsService: ChatroomsService, private router: Router) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.getChatlist();
  }

  onSubmit(f: NgForm) {
    this.chatroomsService.createRoom(f.value.roomName, this.userId).subscribe(() => {
      this.getChatlist();
    });
    f.resetForm();
  }

  getChatlist() {
    this.chatroomsService.getChatlist(this.userId).subscribe(resData => {
      this.chatlist = resData.chatlist;
    });
  }

  viewRoom(id: string) {
    this.router.navigate(['/chatroom/' + id]);
  }

}
