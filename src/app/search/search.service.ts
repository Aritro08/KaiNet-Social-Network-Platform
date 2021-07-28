import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { Post } from "../models/post.model";
import { ProfileData } from "../models/profile.model";
import { PostService } from "../posts/post.service";
import { ProfileService } from "../profile/profile.service";

import { environment } from "src/environments/environment";

const APIURL = environment.apiUrl + 'search';

@Injectable({providedIn: 'root'})

export class SearchService {

    posts: Post[];
    users: ProfileData[];
    emitPosts = new BehaviorSubject<{posts: Post[]}>(null);
    emitUsers = new BehaviorSubject<ProfileData[]>(null);

    constructor(private http: HttpClient, private postService: PostService, private profileService: ProfileService) {}

    getPostsByQuery(query: string) {
        let params = new HttpParams().set('searchQuery', query);
        this.http.get<{posts: any}>(APIURL + '/posts', {params: params}).pipe(map(postData => {
            return {
                posts: postData.posts.map(post => this.postService.formatPost(post))
            };
        })).subscribe(postData => {
            this.posts = postData.posts;
            this.emitPosts.next({posts: this.posts});
        });
    }

    getUsersByQuery(query: string) {
        let params = new HttpParams().set('searchQuery', query);
        this.http.get<{users: any}>(APIURL + '/users', {params: params}).pipe(map(userData => {
            return {
                users: userData.users.map(user => this.profileService.formatUser(user))
            };
        })).subscribe(userData => {
            this.users = userData.users;
            this.emitUsers.next(this.users);
        });
    }
}