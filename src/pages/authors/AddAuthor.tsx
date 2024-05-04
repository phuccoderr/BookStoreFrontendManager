import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ManagerHeader from "@/components/ManagerHeader";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAuthor } from "@/services/authorsService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface authorRequest {
  name: string;
  date_of_birth: Date;
}
const formSchema = z.object({
  name: z.string().min(3, {
    message: "Name phải trên 3 ký tự!",
  }),
  date_of_birth: z.date({ required_error: "A date of birth is required." }),
});

const AddAuthor: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // SCHEMA
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      date_of_birth: new Date(),
    },
  });
  const mutateCreate = useMutation({
    mutationFn: createAuthor,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["authors"] });
      toast.success("Thêm author thành công!");
      navigate("/authors");
    },
    onError: () => {
      toast.error("Error");
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const data: authorRequest = values;
    toast.warning("Đang cập nhật!");
    mutateCreate.mutate(data);
  };
  return (
    <div className="p-2 m-4">
      <ManagerHeader
        title="Add Author"
        description="Thêm tác giả!"
      ></ManagerHeader>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-4">
            <h1 className="text-center text-green-400 text-3xl font-mono font-bold">
              AUTHOR FORM
            </h1>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên tác giả!" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem className="flex flex-col mt-2">
                  <FormLabel>Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date: Date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Your date of birth is used to calculate your age.
                  </FormDescription>
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

export default AddAuthor;
