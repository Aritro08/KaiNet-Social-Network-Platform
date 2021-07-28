import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Comment } from 'src/app/models/comment.model';
import { PostService } from '../../post.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})

export class CommentsComponent implements OnInit {
  
  @Input() comments;
  @Input() postId;
  isAuth: boolean;
  replyForm: FormGroup;
  userName: string;
  userId: string;
  authSub: Subscription;
  editMode = false;

  constructor(private postService: PostService, private authService: AuthService) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.isAuth = this.authService.getIsAuth();
    this.authSub = this.authService.getAuthStatus().subscribe(status => {
      this.isAuth = status;
    });
    this.userName = this.authService.getUserName();
    this.replyForm = new FormGroup({
      'content': new FormControl(null, Validators.required)
    });
  }

  onAddReply(comment: Comment) {
    let content = this.replyForm.value.content;
    this.replyForm.reset();
    comment.replyFormDisplay = false;
    if(this.editMode) {
      this.postService.editComment(comment._id, content).subscribe(resData => {
        comment.content = content;
      });
    } else {
      this.postService.addComment(content, comment._id, this.userName, this.postId, this.userId);
    }
  }

  onToggleForm(comment: Comment) {
    comment.replyFormDisplay = !comment.replyFormDisplay;
    this.editMode = false;
    this.replyForm.setValue({
      'content': ''
    });
  }

  onDeleteComment(id: string) {
    this.postService.deleteComment(id, this.postId);
  }

  onEditComment(comment: Comment) {
    comment.replyFormDisplay = !comment.replyFormDisplay;
    this.editMode = !this.editMode;
    this.replyForm.setValue({
      'content': comment.content
    });
  }

}
