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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAccount } from "@/services/account";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
interface accountRequest {
  email: string;
  name: string;
  password: string;
  confirmPassword?: string;
  enabled: boolean;
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
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không trùng khớp!",
    path: ["confirmPassword"],
  });

const Account: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [image, setImage] = useState<File>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const infoString = localStorage.getItem("info");
  const info = infoString ? JSON.parse(infoString) : null;
  const accountId = info?.id;

  // SCHEMA
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      enabled: true,
    },
  });

  // MUTATE
  const mutateUpdate = useMutation({
    mutationFn: updateAccount,
    onSuccess: (data) => {
      localStorage.setItem("info", JSON.stringify(data.data));
      queryClient.refetchQueries({ queryKey: ["users"] });
      toast.success("Thêm user thành công!");
      navigate("/account");
    },
    onError: () => {
      toast.error("Error");
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const data: accountRequest = values;
    toast.warning("Đang cập nhật!");
    mutateUpdate.mutate({ data, image, id: accountId });
  };
  useEffect(() => {
    form.setValue("email", info.email || "");
    form.setValue("name", info.name || "");
    form.setValue("enabled", info.enabled);
  }, []);

  const handleSetImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setImage(() => file);
  };
  return (
    <div className="p-2 m-4">
      <ManagerHeader
        title="Account Info"
        description="Thông tin tài khoản của bạn!"
      ></ManagerHeader>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-4">
            <h1 className="text-center text-green-400 text-3xl font-mono font-bold">
              ACCOUNT FORM
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
            <div className="flex justify-start items-center gap-4">
              <Checkbox
                checked={showPassword}
                onClick={() => setShowPassword(!showPassword)}
              />
              <label>Change Password</label>
            </div>
            {showPassword && (
              <>
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
              </>
            )}
            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <Checkbox
                    checked={field.value}
                    name={field.name}
                    onCheckedChange={() => field.onChange(!field.value)}
                  />
                  <label className="text-sm">Enabled</label>
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
              <img className="mt-2" src={info.photo} width={200} height={150} />
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

export default Account;
