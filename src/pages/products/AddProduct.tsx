import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ManagerHeader from "@/components/ManagerHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

interface productRequest {
  name: string;
  alias: string;
  cost: number;
  price: number;
  sale: number;
  enabled: boolean;

  authorId?: number;
  categoryId?: number;

  shortDescription: string;
  fullDescription: string;

  productDetails?: [];
}
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
});
const AddProduct: React.FC = () => {
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
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const data: productRequest = values;
  };
  return (
    <div className="p-2 m-4">
      <ManagerHeader
        title="Add Product"
        description="Thêm sản phẩm!"
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
                <div className="flex items-center justify-between gap-2">
                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập tên sản phẩm!"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
                  </div>
                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="alias"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alias</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
                  </div>
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="cost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập giá chi phí!" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập giá bán ra!" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>

                  <FormField
                    control={form.control}
                    name="sale"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sale</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập giảm giá!" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
                </div>
                <div></div>
              </TabsContent>
              <TabsContent value="description">
                <div>
                  <FormField
                    control={form.control}
                    name="shortDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Description</FormLabel>
                        <FormControl>
                          <Textarea
                            className="h-56"
                            placeholder="Type your message here."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>

                  <FormField
                    control={form.control}
                    name="fullDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Description</FormLabel>
                        <FormControl>
                          <Textarea
                            className="h-56"
                            placeholder="Type your message here."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
                </div>
              </TabsContent>
              <TabsContent className="flex gap-4 " value="images">
                <div className="p-4">
                  <h1 className="font-bold mb-2">Main Image</h1>
                </div>
                <ScrollArea className="h-72 w-56 rounded-md border bg-slate-100">
                  <div className="p-4">
                    <h4 className="mb-4 font-bold leading-none">
                      Extra Images
                    </h4>
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="details"></TabsContent>
            </Tabs>

            <Button className="mt-4" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddProduct;
