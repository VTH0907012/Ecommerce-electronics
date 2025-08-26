import { User } from "./User";

export interface Comment {
  _id: string;
  product: any; 
  user: User;      
  content: string;
  rating?: number; 
  createdAt: string;
  updatedAt: string;
}