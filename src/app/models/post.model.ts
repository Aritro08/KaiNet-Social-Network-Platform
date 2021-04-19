export interface Post {
    id: string,
    title: string,
    content: string,
    image: string,
    upvotes: {
        up_count: number,
        up_users: Array<string>
    },
    downvotes: {
        down_count: number,
        down_users: Array<string>
    },
    userId: string,
    username: string,
    upvoted: boolean,
    downvoted: boolean,
    postDate: Date,
    commentCount: number
}