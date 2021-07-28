import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ProfileService } from '../profile/profile.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  usernameSub: Subscription;
  usernameUpdateSub: Subscription;
  isAuthSub: Subscription;
  userIdSub: Subscription;
  username: string;
  isAuth: boolean = false;
  userId: string;
  collapseNav = true;
  
  constructor(private authService: AuthService, private profileService: ProfileService) { }

  ngOnInit(): void {
    this.isAuth = this.authService.getIsAuth();
    this.isAuthSub = this.authService.getAuthStatus().subscribe(status => {
      this.isAuth = status;
    });
    this.username = this.authService.getUserName();
    this.usernameSub = this.authService.getUserNameSub().subscribe(username => {
      this.username = username;
    });
    this.usernameUpdateSub = this.profileService.getUserNameSub().subscribe(username => {
      this.username = username;
    });
    this.userId = this.authService.getUserId();
    this.userIdSub = this.authService.getUserIdSub().subscribe(id => {
      this.userId = id;
    });
  }

  toggleNav() {
    this.collapseNav = !this.collapseNav;
    const navlinks = document.querySelectorAll('.nav-link');
    navlinks.forEach(link => {
      if(link.classList.contains('vertical-nav')) {
        link.classList.remove('vertical-nav');
      } else {
        link.classList.add('vertical-nav');
      }
    });
  }

  logoutUser() {
    this.authService.logout();
  }

}
