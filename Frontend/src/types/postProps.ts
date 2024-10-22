export interface User {
    _id?: string;
    username?: string;
    fullName?: string;
    profileImg?: string;
    coverImg?: string;
    bio?: string;
    link?: string;
    following?: string[];
    followers?: string[];
};

export interface Comment {
    _id: string;
    user: User;
    text: string;
};

export interface Post {
    _id: string;
    user: User;
    text: string;
    img?: string;
    comments: Comment[];
    likes: string[];
};

export interface PostProps {
    post: Post;
};