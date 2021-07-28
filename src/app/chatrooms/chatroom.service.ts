import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { Chatroom } from "../models/chatroom.model";
import { ProfileData } from "../models/profile.model";

import { environment } from "src/environments/environment";

const APIURL = environment.apiUrl + 'chats'

@Injectable({providedIn: 'root'})

export class ChatroomsService {

    constructor(private http: HttpClient, private socket: Socket) {}

    createRoom(name: string, admin: string) {
        return this.http.post(APIURL + '/create-room', {name, admin});
    }

    getChatlist(id: string) {
        return this.http.get<{chatlist: Chatroom[]}>(APIURL + '/chatlist/' + id);
    }

    getChatroomData(id: string) {
        return this.http.get<{users: any, chatroom: Chatroom}>(APIURL + '/chatroom/' + id);
    }

    addMemberToRoom(user: ProfileData, roomId: string, roomName: string) {
        const memberId = user._id;
        this.socket.emit('add-to-room', {roomName, user});
        return this.http.put(APIURL + '/add-to-room', {memberId, roomId});
    }

    getAddedUserStatus() {
        return this.socket.fromEvent<ProfileData>('added-user');
    }

    leaveRoom(memberId: string, roomId: string, roomName: string, username: string) {
        this.socket.emit('user-leave-room', {roomName, username, memberId});
        return this.http.put(APIURL + '/leave-room', {memberId, roomId});
    }

    getUserLeftStatus() {
        return this.socket.fromEvent<{username: string, memberId: string}>('user-left');
    }

    sendChatMessage(messageData: any, roomId: string) {
        const storedMessage = {
            message: messageData.message,
            from: messageData.from,
            image: messageData.image,
            datetime: messageData.datetime
        }
        this.http.put(APIURL + '/store-message/' + roomId, {storedMessage}).subscribe();
        this.socket.emit('message', messageData);
    }

    getChatMessage() {
        return this.socket.fromEvent<{message: string, from: string, image: string, datetime: string}>('message-back');
    }
}