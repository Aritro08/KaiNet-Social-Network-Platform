import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from 'src/app/models/post.model';
import { ProfileService } from '../../profile.service';

@Component({
  selector: 'app-profile-posts-view',
  templateUrl: './profile-posts-view.component.html',
  styleUrls: ['./profile-posts-view.component.css']
})
export class ProfilePostsViewComponent implements OnInit {

  dispPosts = [];
  posts: Post[];
  userId: string;

  constructor(private profileService: ProfileService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.profileService.getPostsByUserId(this.userId).subscribe(resData => {
      this.posts = resData.posts;
      while(this.posts.length) {
        this.dispPosts.push(this.posts.splice(0,3));
      }
    });
  }

  viewPost(id: string) {
    this.router.navigate(['/post/' + id]);
  }
}
