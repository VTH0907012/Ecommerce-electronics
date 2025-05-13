export interface CartItem {
    _id: string;
    name: string;
    price: number;
    discountPrice?: number;
    quantity: number;
    image?: string;
  }
  
 export interface CartState {
    items: CartItem[];
    isOpen: boolean; 
  }