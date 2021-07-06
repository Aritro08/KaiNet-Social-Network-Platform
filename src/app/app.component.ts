import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  constructor(private authService: AuthService, private socket: Socket) {}

  ngOnInit() {
    this.authService.autoLogin();
    // this.socket.emit('test');
    // this.socket.on('test-back', s => {
    //   console.log(s);
    // });
  }
}
