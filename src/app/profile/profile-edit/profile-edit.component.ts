
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { mimeType } from '../../mime-type.validator';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {

  private userId: string;
  userName: string;
  imagePrev: string;
  profileForm: FormGroup;

  constructor(private authService: AuthService, private profileService: ProfileService, private router: Router) { }

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      username: new FormControl(null),
      email: new FormControl(null),
      bio: new FormControl(null),
      image: new FormControl(null)
    });
    this.userId = this.authService.getUserId();
    this.profileService.getUserData(this.userId).subscribe(userData => {
      this.imagePrev = userData.profileImage;
      this.profileForm.setValue({
        'username': userData.username,
        'email': userData.email,
        'bio': userData.bio,
        'image': userData.profileImage
      });
    });
  }

  onSubmit() {
    const username = this.profileForm.value.username;
    const email = this.profileForm.value.email;
    const bio = this.profileForm.value.bio;
    const image = this.profileForm.value.image;
    this.profileService.updateUserData(this.userId, username, email, bio, image);
    this.router.navigate(['/']);
  }

  onAddImage(event: Event) {
    const file = (<HTMLInputElement>event.target).files[0];
    this.profileForm.patchValue({image: file});
    this.profileForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePrev = <string>reader.result;
    }
    reader.readAsDataURL(file);
  }

}
