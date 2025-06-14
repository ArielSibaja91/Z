export interface User {
    _id: string;
    username: string;
    fullName: string;
    password: string;
    profileImg: string;
    coverImg: string;
    bio: string;
    link: string;
    following: string[];
    isFollowing: boolean;
    followers: string[];
    createdAt: Date;
};

export interface Comment {
    _id: string;
    user: User;
    text: string;
    createdAt: Date;
};

export interface Post {
    _id: string;
    user: User;
    text: string;
    img?: string;
    comments: Comment[];
    likes: string[];
    createdAt: Date;
};

export interface PostProps {
    post: Post;
};