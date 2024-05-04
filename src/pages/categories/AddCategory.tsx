import React, { ChangeEvent, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "@/services/categroiesService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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
const AddCategory: React.FC = () => {
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

  // MUTATE
  const mutateCreate = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
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
    mutateCreate.mutate({ data, image });
  };
  const handleSetImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setImage(() => file);
  };
  return (
    <div className="p-2 m-4">
      <ManagerHeader
        title="Add Category"
        description="Thêm danh mục!"
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

            <Button className="mt-4" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddCategory;
