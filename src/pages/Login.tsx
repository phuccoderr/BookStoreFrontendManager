import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/services/login";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  email: z.string().email({
    message: "Email không đúng định dạng!",
  }),
  password: z.string().min(5, { message: "Mật khẩu phải hơn 5 ký tự!" }),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  // SCHEMA
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // MUTATION LOGIN
  const mutationLogin = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.data.access_token);
      localStorage.setItem("info", JSON.stringify(data.data.info));
      navigate("/");
      toast.success("Đăng nhập thành công!");
    },
    onError: () => {
      toast.error("Email hoặc Password không đúng!");
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutationLogin.mutate(values);
  }

  return (
    <div className="mt-36 flex items-center justify-center">
      <div className="bg-green-50 w-96 rounded-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-4">
            <h1 className="text-center text-green-400 text-3xl font-mono font-bold">
              Login
            </h1>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập email tại đây!" {...field} />
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
                      placeholder="Nhập mật khẩu tại đây!"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>

            <Button className="mt-4" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
