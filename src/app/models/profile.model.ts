export interface ProfileData{
    _id: string,
    username: string,
    email: string,
    bio: string,
    profileImage: string,
    sentRequests: Array<string>, 
    recvRequests: Array<string>, 
    friendList: Array<string>,
    friendStatus: string
}