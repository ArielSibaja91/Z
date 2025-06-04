export interface Notification {
    _id: string;
    from: {
        _id: string;
        username: string;
        profileImg: string;
    };
    to: string;
    type: 'follow' | 'like';
    read: boolean;
};