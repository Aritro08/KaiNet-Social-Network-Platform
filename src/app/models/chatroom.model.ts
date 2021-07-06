export interface Chatroom {
    _id: string,
    name: string,
    admin: string,
    users: Array<string>,
    messages: Array<any>
}