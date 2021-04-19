import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.css']
})
export class AuthFormComponent implements OnInit {

  authForm: FormGroup;
  loginMode = false;

  constructor(private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    this.route.url.subscribe(urlData => {
      if(urlData[0].path == 'login') {
        this.loginMode = true;
      } else {
        this.loginMode = false;
      }
    });
    this.authForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      email: new FormControl(null, Validators.email)
    });
  }

  onSubmit() {
    if(this.loginMode) {
      this.authService.loginUser(this.authForm.value.username, this.authForm.value.password);
    } else {
      this.authService.signUpUser(this.authForm.value.username, this.authForm.value.email, this.authForm.value.password);
    }
    this.authForm.reset();
  }

}
