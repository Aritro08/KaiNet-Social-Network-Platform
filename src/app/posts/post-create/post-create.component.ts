import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { mimeType } from 'src/app/mime-type.validator';
import { Post } from 'src/app/models/post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {

  imagePrev: string;
  userId: string;
  username: string;
  postForm: FormGroup;
  editMode = false;
  postId: string;
  post: Post;

  constructor(private authService: AuthService, private postService: PostService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.postForm = new FormGroup({
      'title': new FormControl(null, {validators: [Validators.required]}),
      'content': new FormControl(''),
      'image': new FormControl(null)
    });
    this.route.paramMap.subscribe((params: ParamMap) => {
      if(params.has('id')) {
        this.editMode = true;
        this.postId = params.get('id');
        this.postService.getPostById(this.postId).subscribe(postData => {
          this.post = postData;
          this.imagePrev = this.post.image;
          this.postForm.setValue({
            'title': this.post.title,
            'content': this.post.content,
            'image': this.post.image
          });
        });
      } else {
        this.editMode = false;
        this.postId = null;
      }
    });
    this.username = this.authService.getUserName();
    this.userId = this.authService.getUserId();
  }

  onAddPost() {
    const title = this.postForm.value.title;
    const content = this.postForm.value.content;
    const image = this.postForm.value.image;
    if(!this.editMode) {
      this.postService.addPost(title, content, image, this.userId, this.username);
    } else {
      this.postService.editPost(this.postId, title, content, image);
    }
  }

  onAddImage(event: Event) {
    const file = (<HTMLInputElement>event.target).files[0];
    this.postForm.patchValue({image: file});
    this.postForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePrev = <string>reader.result;
    }
    reader.readAsDataURL(file);
  }

  onCancel() {
    window.history.back();
  }

}
