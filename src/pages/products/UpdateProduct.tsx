import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProduct,
  listProductAuthors,
  listProductCategories,
  updateProduct,
} from "@/services/productService";
import IsLoading from "@/components/IsLoading";
import IsError from "@/components/IsError";
import ManagerHeader from "@/components/ManagerHeader";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InfoProduct from "@/components/tabsproduct/InfoProduct";
import DescriptionProduct from "@/components/tabsproduct/DescriptionProduct";
import ImageProduct from "@/components/tabsproduct/ImageProduct";
import DetailProduct from "@/components/tabsproduct/DetailProduct";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { productRequest } from "@/types/product/types";

const produtDetailSchema = z.object({
  name: z.string(),
  value: z.string(),
});

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name phải trên 3 ký tự!",
  }),
  alias: z.string(),
  cost: z.number(),
  price: z.number(),
  sale: z.number(),
  enabled: z.boolean(),

  shortDescription: z.string(),
  fullDescription: z.string(),

  authorId: z.number(),
  categoryId: z.number(),

  productDetails: z.array(produtDetailSchema),
});

const UpdateProduct: React.FC = () => {
  const params = useParams();
  const productId = params.productId;

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [image, setImage] = useState<File>();
  const [extraImage, setExtraImage] = useState<File[]>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      alias: "",
      cost: 0,
      price: 0,
      sale: 0,
      enabled: true,

      shortDescription: "",
      fullDescription: "",

      authorId: 0,
      categoryId: 0,

      productDetails: [],
    },
  });

  // FETCH PRODUCT
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    refetchOnReconnect: true,
  });

  // FETCH AUTHOR AND CATEGORY FORM
  const {
    data: authors,
    isLoading: authorIsLoading,
    isError: authorIsError,
  } = useQuery({
    queryKey: ["authorsDTO"],
    queryFn: listProductAuthors,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    refetchOnReconnect: true,
  });

  const {
    data: categories,
    isLoading: categoryIsLoading,
    isError: categoryIsError,
  } = useQuery({
    queryKey: ["categoriesDTO"],
    queryFn: listProductCategories,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (product) {
      form.setValue("name", product?.data.name);
      form.setValue("alias", product?.data.alias);
      form.setValue("shortDescription", product?.data.shortDescription);
      form.setValue("fullDescription", product?.data.fullDescription);
      form.setValue("cost", product?.data.cost);
      form.setValue("price", product?.data.price);
      form.setValue("sale", product?.data.sale);
      form.setValue("authorId", product?.data.authorId);
      form.setValue("categoryId", product?.data.categoryId);

      form.setValue("productDetails", product?.data.productDetails);
    }
  }, [product]);

  // MUTATE
  const mutateUpdate = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["products"] });
      toast.success("Thêm product thành công!");
      navigate("/products");
    },
    onError: () => {
      toast.error("Error");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const data: productRequest = values;
    toast.warning("Đang cập nhật!");
    mutateUpdate.mutate({ data, image, extraImage, productId });
  };
  if (isLoading || authorIsLoading || categoryIsLoading) return <IsLoading />;
  if (isError || authorIsError || categoryIsError) return <IsError />;
  return (
    <div className="p-2 m-4">
      <ManagerHeader
        title="Update Product"
        description="Cập nhật sản phẩm!"
      ></ManagerHeader>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-4">
            <h1 className="text-center text-green-400 text-3xl font-mono font-bold">
              PRODUCT FORM
            </h1>
            <Tabs defaultValue="info">
              <TabsList className="w-full justify-between">
                <TabsTrigger value="info">Info</TabsTrigger>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              <TabsContent value="info">
                <InfoProduct
                  categories={categories}
                  authors={authors}
                  form={form}
                />
              </TabsContent>
              <TabsContent value="description">
                <DescriptionProduct form={form} />
              </TabsContent>
              <TabsContent className="flex gap-4" value="images">
                <ImageProduct
                  image={image}
                  setImage={setImage}
                  extraImage={extraImage}
                  setExtraImage={setExtraImage}
                  mainImage={product?.data.mainImage}
                  productImages={product?.data.productImages}
                />
              </TabsContent>
              <TabsContent value="details">
                <DetailProduct form={form} />
              </TabsContent>
            </Tabs>

            <Button className="mt-6 w-16 float-end bg-green-500" type="submit">
              Save
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateProduct;
