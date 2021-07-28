import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";

import { environment } from "src/environments/environment";

const APIURL = environment.apiUrl + 'posts';

@Injectable({providedIn:'root'})

export class PostService {

    commentsSub = new Subject<{comments: any}>();
    countSub = new Subject<number>();

    constructor(private http: HttpClient, private router: Router) {}

    getPostById(postId: string) {
        return this.http.get<{post: any}>(APIURL + '/' + postId).pipe(map(postData => this.formatPost(postData.post)));
    }

    getPosts() {
        return this.http.get<{posts: any}>(APIURL).pipe(map(postData => {
            return {
                posts: postData.posts.map(post => this.formatPost(post))
            };
        }));
    }

    addPost(title: string, content: string, image: File, userId: string, username: string) {
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image);
        postData.append('userId', userId);
        postData.append('username', username);
        this.http.post(APIURL, postData).subscribe(resData => {
            this.router.navigate(['/']);
        });
    }

    editPost(id: string, title: string, content: string, image: File | string) {
        let postData;
        if(typeof image == 'object') {
        postData = new FormData();
        postData.append('id', id);
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image);
        } else {
            postData = { id: id, title: title, content: content, image: image };
        }
        this.http.put(APIURL + '/edit/' + id, postData).subscribe(resData => {
            this.router.navigate(['/']);
        });
    }

    deletePost(id: string) {
        this.http.delete(APIURL + '/delete/' + id).subscribe(resData => {
            this.router.navigate(['/']);
        });
    }

    upVotesUpdate(postId: string, userId: string, count: number, type: string) {
        const updateData = {userId: userId, count: count, type: type};
        this.http.put(APIURL + '/upvote/' + postId, updateData).subscribe();
    }

    downVotesUpdate(postId: string, userId: string, count: number, type: string) {
        const updateData = {userId: userId, count: count, type: type};
        this.http.put(APIURL + '/downvote/' + postId, updateData).subscribe();
    }

    addComment(content: string, parentId: string, userName:string, postId: string, userId: string) {
        const commenData = {parentId: parentId, userName: userName, content: content, userId: userId};
        this.http.post<{count: number}>(APIURL + '/comment/' + postId, commenData).subscribe(resData => {
            this.countSub.next(resData.count);
            this.getComments(postId).subscribe(resData => {
                this.commentsSub.next(resData);
            });
        });
    }

    getComments(id: string) {
        return this.http.get<{comments: any}>(APIURL + '/comment/' + id);
    }

    deleteComment(commentId: string, postId: string) {
        this.http.request<{count: number}>('delete', APIURL + '/comment/' + commentId, {
            headers: {}, 
            body: {'postId': postId}}).subscribe(resData => {
            this.countSub.next(resData.count);
            this.getComments(postId).subscribe(resData => {
                this.commentsSub.next(resData);
            });
        });
    }

    editComment(id: string, content: string) {
        return this.http.put(APIURL + '/comment/' + id, {content: content});
    }

    formatPost(post: any) {
        return {
            id: post._id,
            title: post.title,
            content: post.content,
            image: post.image,
            upvotes: post.upvotes,
            downvotes: post.downvotes,
            userId: post.userId,
            username: post.username,
            upvoted: false,
            downvoted: false,
            postDate: post.postDate,
            commentCount: post.commentCount
        };
    }
}