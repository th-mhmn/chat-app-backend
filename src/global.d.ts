interface IUserPayload {
  _id: string;
  name: string;
  email: string;
  role: sting;
}

type IRole = 'user' | 'admin';
type IVisibility = 'public' | 'private' | 'friends';

declare namespace Express {
  export interface Request {
    currentUser: IUserPayload;
  }
}
