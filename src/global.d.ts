interface IUserPayload {
  _id: string;
  name: string;
  email: string;
  role: sting;
}

type IMediaType = {
  version: number;
  display_name: string;
  public_id: string;
  format: string;
  resource_type: string;
};

type IRole = 'user' | 'admin';
type IVisibility = 'public' | 'private' | 'friends';

declare namespace Express {
  export interface Request {
    currentUser: IUserPayload;
  }
}
