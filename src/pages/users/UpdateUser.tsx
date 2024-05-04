import IsError from "@/components/IsError";
import IsLoading from "@/components/IsLoading";
import { getUser, putUser } from "@/services/usersService";
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

interface userRequest {
  email: string;
  name: string;
  enabled: boolean;
  role: string;
}

const formSchema = z.object({
  email: z.string().email({
    message: "Email không đúng định dạng!",
  }),
  name: z.string().min(1, {
    message: "Name phải trên 3 ký tự!",
  }),
  enabled: z.boolean(),
  role: z.string(),
});

const UpdateUser: React.FC = () => {
  const params = useParams();
  const userId = params.userId;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [image, setImage] = useState<File>();
  //FETCH USER
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    refetchOnReconnect: true,
  });

  // MUTATION
  const mutationUpdate = useMutation({
    mutationFn: putUser,
    onSuccess: (data) => {
      queryClient.setQueryData(["user", userId], data);
      queryClient.refetchQueries({ queryKey: ["users"] });
      toast.success("Thêm user thành công!");
      navigate("/users");
    },
    onError: () => {
      toast.error("Error");
    },
  });

  // SCHEMA
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      enabled: false,
      role: "Sale",
    },
  });
  useEffect(() => {
    if (user) {
      form.setValue("email", user.data.email || "");
      form.setValue("name", user.data.name || "");
      form.setValue("enabled", user.data.enabled || false);
      form.setValue("role", user.data.role);
    }
  }, [user]);
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const data: userRequest = values;
    toast.warning("update!");
    mutationUpdate.mutate({ data, image, id: userId });
  };
  const handleSetImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setImage(() => file);
  };
  if (isLoading) return <IsLoading />;
  if (isError) return <IsError />;
  return (
    <div className="p-2 m-4">
      <ManagerHeader
        title={`Update User ${userId}`}
        description="Sửa đổi thông tin tài khoản quản trị!"
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
                    <Input
                      disabled
                      type="email"
                      placeholder="Nhập email!"
                      {...field}
                    />
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
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <Checkbox
                    onCheckedChange={() => field.onChange(!field.value)}
                    checked={field.value}
                  />
                  <label className="text-sm">Enabled {field.value}</label>
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
                src={user?.data?.photo}
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

export default UpdateUser;
