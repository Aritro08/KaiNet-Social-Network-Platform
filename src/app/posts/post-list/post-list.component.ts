import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from 'src/app/models/post.model';
import { SearchService } from 'src/app/search/search.service';
import { PostService } from '../post.service';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit {

  userId: string;
  posts: Post[];
  isAuth = false;
  authSub: Subscription;
  votedSub: Subscription;
  searchPostsSub: Subscription;
  url: string;
  arrowUp = faArrowUp;
  arrowDown = faArrowDown;
  commentFa = faComment;

  constructor(private postService: PostService, private authService: AuthService, 
    private router: Router, private searchService: SearchService) { }

  ngOnInit(): void {
    this.posts = [];
    this.url = this.router.url;
    this.isAuth = this.authService.getIsAuth();
    this.authSub = this.authService.getAuthStatus().subscribe(status => {
      this.isAuth = status;
    });
    this.userId = this.authService.getUserId();
    if(this.url === '/') {
      this.postService.getPosts().subscribe(resData => {
        this.posts = resData.posts;
        this.setVoteStatus();
      });
    } else {
      this.searchService.emitPosts.subscribe(postData => {
        if(postData) {
          this.posts = postData.posts;
          this.setVoteStatus();
        }
      });
    }
  }

  upVote(post: Post) {
    let newCount;
    let type;
    if(!post.upvoted) {
      newCount = post.upvotes.up_count + 1;
      post.upvotes.up_count = newCount;
      post.upvoted = true;
      type = 'toggleOn';
    } else {
      newCount = post.upvotes.up_count - 1;
      post.upvotes.up_count = newCount;
      post.upvoted = false;
      type = 'toggleOff';
    }
    this.postService.upVotesUpdate(post.id, this.userId, newCount, type);
  }

  downVote(post: Post) {
    let newCount;
    let type;
    if(!post.downvoted) {
      newCount = post.downvotes.down_count + 1;
      post.downvotes.down_count = newCount;
      post.downvoted = true;
      type = 'toggleOn';
    } else {
      newCount = post.downvotes.down_count - 1;
      post.downvotes.down_count = newCount;
      post.downvoted = false;
      type = 'toggleOff';
    }
    this.postService.downVotesUpdate(post.id, this.userId, newCount, type);
  }

  viewPost(id: string) {
    this.router.navigate(['/post/' + id]);
  }

  setVoteStatus() {
    this.posts.forEach(post => {
      post.upvotes.up_users.find(user => {
        if(user === this.userId) {
          post.upvoted = true;
          return true;
        }
      });
      if(post.upvoted) {
        return;
      }
      post.downvotes.down_users.find(user => {
        if(user === this.userId) {
          post.downvoted = true;
          return true;
        }
      });
    });
  }
}
