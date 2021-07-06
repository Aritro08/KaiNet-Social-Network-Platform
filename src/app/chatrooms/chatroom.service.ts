import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Chatroom } from "../models/chatroom.model";

@Injectable({providedIn: 'root'})

export class ChatroomsService {

    constructor(private http: HttpClient) {}

    createRoom(name: string, admin: string) {
        return this.http.post('http://localhost:3000/api/chats/create-room', {name, admin});
    }

    getChatlist(id: string) {
        return this.http.get<{chatlist: Chatroom[], message: string}>('http://localhost:3000/api/chats/chatlist/' + id);
    }

    getChatroomData(id: string) {
        return this.http.get<{users: any, chatroom: Chatroom, message: string}>('http://localhost:3000/api/chats/chatroom/' + id);
    }

    addMemberToRoom(memberId: string, roomId: string) {
        return this.http.put('http://localhost:3000/api/chats/add-to-room', {memberId, roomId});
    }

}