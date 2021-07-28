import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Comment } from 'src/app/models/comment.model';
import { Post } from 'src/app/models/post.model';
import { PostService } from '../post.service';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.css']
})

export class PostViewComponent implements OnInit {

  isAuth: boolean;
  userId: string;
  userName: string;
  postId: string;
  post: Post;
  authSub: Subscription;
  commentsSub: Subscription;
  countSub: Subscription;
  commentForm: FormGroup;
  comments: Comment[];
  arrowUp = faArrowUp;
  arrowDown = faArrowDown;
  commentFa = faComment;

  constructor(private route: ActivatedRoute, private postService: PostService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.isAuth = this.authService.getIsAuth();
    this.authSub = this.authService.getAuthStatus().subscribe(status => {
      this.isAuth = status;
    });
    this.userName = this.authService.getUserName();
    this.userId = this.authService.getUserId();
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.postId = params.get('id');
    });
    this.postService.getPostById(this.postId).subscribe(postData => {
      this.post = postData;
      this.post.upvotes.up_users.find(user => {
        if(user === this.userId) {
          this.post.upvoted = true;
          return true;
        }
      });
      if(!this.post.upvoted) {
        this.post.downvotes.down_users.find(user => {
          if(user === this.userId) {
            this.post.downvoted = true;
            return true;
          }
        });
      }
    });
    this.commentForm = new FormGroup({
      'content': new FormControl(null, Validators.required)
    });
    this.postService.getComments(this.postId).subscribe(resData => {
      this.comments = resData.comments;
    });
    this.commentsSub = this.postService.commentsSub.subscribe(resData => {
      this.comments = resData.comments;
    });
    this.countSub = this.postService.countSub.subscribe(count => {
      this.post.commentCount = count;
    });
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

  onComment() {
    let comment = this.commentForm.value.content;
    this.commentForm.reset();
    this.postService.addComment(comment, null, this.userName, this.postId, this.userId);
  }

  onEditPost(id: string) {
    this.router.navigate(['/post/edit/' + id]);
  }

  onDeletePost(id: string) {
    this.postService.deletePost(id);
  }

  viewUser(userId: string) {
    this.router.navigate(['/profile/' + userId]);
  }

  closePage() {
    window.history.back();
  }

}
