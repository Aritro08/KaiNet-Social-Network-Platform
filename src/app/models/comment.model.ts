export interface Comment {
    _id: string,
    parentId: string,
    postId: string,
    userId: string,
    username: string,
    content: string,
    children: Array<Comment>
    commentDate: Date
    replyFormDisplay: boolean
}