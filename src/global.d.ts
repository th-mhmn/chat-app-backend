interface IUserPayload {
  _id: string;
  name: string;
  email: string;
  role: sting;
}

type IRole = 'user' | 'admin';
type IVisibility = 'public' | 'private' | 'friends';
type IReaction =
  | 'like'
  | 'love'
  | 'happy'
  | 'dislike'
  | 'angry'
  | 'thoughtful'
  | 'inspirational';

declare namespace Express {
  export interface Request {
    currentUser: IUserPayload;
  }
}
