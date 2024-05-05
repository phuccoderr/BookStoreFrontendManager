import { UseFormReturn } from "react-hook-form";

export interface InfoProductProps {
  form: UseFormReturn<{
    name: string;
    alias: string;
    cost: number;
    price: number;
    sale: number;
    enabled: boolean;
    shortDescription: string;
    fullDescription: string;
    authorId: number;
    categoryId: number;
    productDetails: {
      name: string;
      value: string;
    }[];
  }>;
  authors?: dataProps | undefined;
  categories?: dataProps | undefined;
}

interface dataProps {
  status: number;
  statusText: string;
  data: any;
}

export interface productRequest {
  name: string;
  alias: string;
  cost: number;
  price: number;
  sale: number;
  enabled: boolean;

  authorId: number;
  categoryId: number;

  shortDescription: string;
  fullDescription: string;

  productDetails?: details[];
}

interface details {
  name: string;
  value: string;
}
