export interface ShippingInfo {
    fullName: string;
    phone: string;
    address: string;
    note: string;
    paymentMethod: string;
  }
  
  export interface Item {
    productId: string;  
    quantity: number;
    name: string,
    price: number
  }
  
  export interface Order {
    _id: string;  
    userId: string; 
    shippingInfo: ShippingInfo;  
    items: Item[];  
    total: number;  
    status: "pending_payment_vnpay"|"pending" | "shipped" | "delivered" | "cancelled";  
    createdAt: string; 
  }
 export type OrderStatus ="pending_payment_vnpay"|"pending" | "shipped" | "delivered" | "cancelled";  
