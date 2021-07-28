import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { PostService } from '../posts/post.service';

import { environment } from "src/environments/environment";
import { AuthService } from '../auth/auth.service';

const APIURL = environment.apiUrl + 'users';

@Injectable({providedIn: 'root'})

export class ProfileService{

    private user_name: string;
    private emitUserName = new Subject<string>();

    getUserNameSub() {
        return this.emitUserName.asObservable();
    }

    getUserName() {
        return this.user_name;
    }

    constructor(private http: HttpClient, private router: Router, private postService: PostService, private authService: AuthService) {}

    getUserData(id: string){
        return this.http.get<{user: any}>(APIURL + '/' + id).pipe(map(userData => this.formatUser(userData.user)));
    }

    updateUserData(id: string, email: string, bio: string, image: File | string){
        let userData;
        if (typeof(image) === 'object') {
            userData = new FormData();
            userData.append('id', id);
            userData.append('email', email);
            userData.append('bio', bio);
            userData.append('image', image, id);
        } else {
            userData = { id: id, email: email, bio: bio, image: image }
        }
        this.http.put(APIURL + '/' + id, userData).subscribe(resData => {
            // this.getUserData(id).subscribe(userData => {
            //     localStorage.setItem('username', userData.username);
            //     this.user_name = userData.username;
            //     this.emitUserName.next(this.user_name);
            // });
        });
    }

    getPostsByUserId(userId: string) {
        return this.http.get<{posts: any}>(environment.apiUrl + 'posts/user/' + userId).pipe(map(postData => {
            return {
                posts: postData.posts.map(post => this.postService.formatPost(post))
            };
        }));
    }

    getUserFriends(id: string) {
        return this.http.get<{friends: any}>(APIURL+ '/friends/' + id);
    }

    getUserFriendRequests(id: string) {
        return this.http.get<{requests: any}>(APIURL+ '/friend-requests/' + id);
    }

    sendRequest(id: string, userId: string) {
        this.http.put(APIURL+ '/friend/' + userId, {id: id}).subscribe();
    }

    acceptFriendRequest(id: string, userId: string) {
        this.http.put(APIURL+ '/accept-friend/' + id, {id: userId}).subscribe();
    }

    rejectFriendRequest(id: string, userId: string) {
        this.http.put(APIURL+ '/reject-friend/' + id, {id: userId}).subscribe();
    }

    deleteFriend(id: string, userId: string) {
        this.http.request('delete', APIURL+ '/delete-friend/' + id, {
            headers: {},
            body: {'id': userId}
        }).subscribe();
    }

    // deleteUser(id: string) {
    //     this.http.delete(APIURL + '/delete-account/' + id).subscribe(resData => {
    //         this.authService.logout();
    //     });
    // }

    formatUser(user: any) {
        return {
            _id: user._id,
            username: user.username,
            email: user.email,
            bio: user.bio,
            profileImage: user.profileImage,
            sentRequests: user.sentRequests,
            recvRequests: user.recvRequests,
            friendList: user.friendList,
            friendStatus: 'Add friend'
        }
    }
}