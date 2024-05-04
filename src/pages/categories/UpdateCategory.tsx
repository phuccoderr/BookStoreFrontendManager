import IsError from "@/components/IsError";
import IsLoading from "@/components/IsLoading";
import { getCategory, updateCategory } from "@/services/categroiesService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ManagerHeader from "@/components/ManagerHeader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

interface categoryRequest {
  name: string;
  alias: string;
}
const formSchema = z.object({
  name: z.string().min(3, {
    message: "Name phải trên 3 ký tự!",
  }),
  alias: z.string(),
});
const UpdateCategory: React.FC = () => {
  const params = useParams();
  const cateId = params.cateId;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [image, setImage] = useState<File | undefined>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      alias: "",
    },
  });

  const unAccent = (name: string): string => {
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "-");
  };
  // GET CATEGORY
  const {
    data: category,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["category", cateId],
    queryFn: () => getCategory(cateId),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    refetchOnReconnect: true,
  });

  // MUTATE
  const mutateUpdate = useMutation({
    mutationFn: updateCategory,
    onSuccess: (data) => {
      queryClient.setQueryData(["category", cateId], data);
      queryClient.refetchQueries({ queryKey: ["categories"] });
      toast.success("Thêm category thành công!");
      navigate("/categories");
    },
    onError: () => {
      toast.error("Error");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const data: categoryRequest = values;
    mutateUpdate.mutate({ data, image, id: cateId });
  };

  const handleSetImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setImage(() => file);
  };

  useEffect(() => {
    if (category) {
      form.setValue("name", category.data.name);
      form.setValue("alias", category.data.alias);
    }
  }, [category]);

  if (isLoading) return <IsLoading />;
  if (isError) return <IsError />;
  return (
    <div className="p-2 m-4">
      <ManagerHeader
        title="Update Category"
        description="Cập nhật danh mục!"
      ></ManagerHeader>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-4">
            <h1 className="text-center text-green-400 text-3xl font-mono font-bold">
              CATEGORY FORM
            </h1>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập tên danh mục!"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        form.setValue("alias", unAccent(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="alias"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alias</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập tên danh mục!"
                      disabled
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <div className="grid w-full max-w-sm items-center gap-1.5 mt-2">
              <Label htmlFor="picture">Avatar</Label>
              <Input id="picture" type="file" onChange={handleSetImage} />
            </div>
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                loading="lazy"
                width={200}
                height={250}
              />
            ) : (
              <img
                className="mt-2"
                src={category?.data?.imageURL}
                width={200}
                height={150}
              />
            )}

            <Button className="mt-4" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateCategory;
