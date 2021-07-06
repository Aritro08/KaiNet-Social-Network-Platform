import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { PostService } from '../posts/post.service';

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

    constructor(private http: HttpClient, private router: Router, private postService: PostService) {}

    getUserData(id: string){
        return this.http.get<{user: any}>('http://localhost:3000/api/users/' + id).pipe(map(userData => this.formatUser(userData.user)));
    }

    updateUserData(id: string, username: string, email: string, bio: string, image: File | string){
        let userData;
        if (typeof(image) === 'object') {
            userData = new FormData();
            userData.append('id', id);
            userData.append('username', username);
            userData.append('email', email);
            userData.append('bio', bio);
            userData.append('image', image, id);
        } else {
            userData = { id: id, username: username, email: email, bio: bio, image: image }
        }
        this.http.put('http://localhost:3000/api/users/' + id, userData).subscribe(resData => {
            this.getUserData(id).subscribe(userData => {
                localStorage.setItem('username', userData.username);
                this.user_name = userData.username;
                this.emitUserName.next(this.user_name);
            });
        });
    }

    getPostsByUserId(userId: string) {
        return this.http.get<{posts: any}>('http://localhost:3000/api/posts/user/' + userId).pipe(map(postData => {
            return {
                posts: postData.posts.map(post => this.postService.formatPost(post))
            };
        }));
    }

    getUserFriends(id: string) {
        return this.http.get<{friends: any}>('http://localhost:3000/api/users/friends/' + id);
    }

    getUserFriendRequests(id: string) {
        return this.http.get<{requests: any}>('http://localhost:3000/api/users/friend-requests/' + id);
    }

    sendRequest(id: string, userId: string) {
        this.http.put('http://localhost:3000/api/users/friend/' + userId, {id: id}).subscribe(resData => {
            console.log(resData);
        });
    }

    acceptFriendRequest(id: string, userId: string) {
        this.http.put('http://localhost:3000/api/users/accept-friend/' + id, {id: userId}).subscribe();
    }

    rejectFriendRequest(id: string, userId: string) {
        this.http.put('http://localhost:3000/api/users/reject-friend/' + id, {id: userId}).subscribe();
    }

    deleteFriend(id: string, userId: string) {
        this.http.request('delete', 'http://localhost:3000/api/users/delete-friend/' + id, {
            headers: {},
            body: {'id': userId}
        }).subscribe();
    }

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