import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from 'src/app/models/post.model';
import { ProfileService } from '../../profile.service';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-profile-posts-view',
  templateUrl: './profile-posts-view.component.html',
  styleUrls: ['./profile-posts-view.component.css']
})
export class ProfilePostsViewComponent implements OnInit, OnDestroy {

  dispPosts = [];
  posts: Post[] = [];
  routerSub: Subscription;
  fetchPostsSub: Subscription;
  userId: string;
  id: string;
  arrowUp = faArrowUp;
  arrowDown = faArrowDown;
  commentFa = faComment;

  constructor(private profileService: ProfileService, 
            private authService: AuthService, 
            private router: Router,
            private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.routerSub = this.router.events.subscribe(event => {
      if(event instanceof NavigationStart) {
        this.dispPosts = [];
      }
    });
    this.fetchPostsSub = this.route.paramMap.subscribe((params: ParamMap) => {
      if(params.has('id')) {
        this.id = params.get('id');
        this.profileService.getPostsByUserId(this.id).subscribe(resData => {
          this.posts = resData.posts;
          while(this.posts.length) {
            this.dispPosts.push(this.posts.splice(0,3));
          }
        });
      }
    });
  }

  viewPost(id: string) {
    this.router.navigate(['/post/' + id]);
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
    this.fetchPostsSub.unsubscribe();
  }
}
