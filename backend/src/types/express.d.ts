import { User } from './index';

declare global {
  namespace Express {
    interface Request {
      user?: Pick<User, 'id' | 'email' | 'name'>;
    }
  }
}

export {};
