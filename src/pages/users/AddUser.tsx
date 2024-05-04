import React, { ChangeEvent, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ManagerHeader from "@/components/ManagerHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveUser } from "@/services/usersService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
interface userRequest {
  email: string;
  name: string;
  password: string;
  confirmPassword?: string;
  enabled: boolean;
  role: string;
}
const formSchema = z
  .object({
    email: z.string().email({
      message: "Email không đúng định dạng!",
    }),
    name: z.string().min(1, {
      message: "Name phải trên 3 ký tự!",
    }),
    password: z.string(),
    confirmPassword: z.string(),
    enabled: z.boolean(),
    role: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không trùng khớp!",
    path: ["confirmPassword"],
  });

const AddUser: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [image, setImage] = useState<File>();
  // SCHEMA
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      enabled: true,
      role: "Sale",
    },
  });

  const mutationCreate = useMutation({
    mutationFn: saveUser,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["users"] });
      toast.success("Thêm user thành công!");
      navigate("/users");
    },
    onError: () => {
      toast.error("Error");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const data: userRequest = values;
    mutationCreate.mutate({ data, image });
  };
  const handleSetImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setImage(() => file);
  };
  return (
    <div className="p-2 m-4">
      <ManagerHeader
        title="Add User"
        description="Thêm tài khoản quản trị!"
      ></ManagerHeader>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-4">
            <h1 className="text-center text-green-400 text-3xl font-mono font-bold">
              USER FORM
            </h1>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Nhập email!" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên người quản trị!" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passowrd</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Nhập mật khẩu!"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Nhập mật khẩu!"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input disabled {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <Checkbox name={field.name} />
                  <label className="text-sm">Enabled</label>
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

export default AddUser;
