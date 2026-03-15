export interface Product {
  productId: number;
  name: string;
  description: string;
  actualPrice: number;
  startingPrice: number;
  imageUrl?: string;
  createdAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  actualPrice: number;
  startingPrice: number;
  imageUrl?: string;
}
