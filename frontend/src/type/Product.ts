export interface Product {
    _id?: string;
    name: string;
    description?: string;
    price: number;
    discountPrice?: number;
    rating?: number;
    category: string;
    brand: string;   
    quantity: number;
    images?: string[];
    createdAt?: string;
    updatedAt?: string;
  }
  