import IsError from "@/components/IsError";
import IsLoading from "@/components/IsLoading";
import { getAuthor, updateAuthor } from "@/services/authorsService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

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

const UpdateAuthor: React.FC = () => {
  const params = useParams();
  const authorId = params.authorId;
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  // SCHEMA
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      date_of_birth: new Date(),
    },
  });
  // FETCH DATA
  const {
    data: author,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["Author", authorId],
    queryFn: () => getAuthor(authorId),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    refetchOnReconnect: true,
  });

  // MUTATE
  const mutateUpdate = useMutation({
    mutationFn: updateAuthor,
    onSuccess: (data) => {
      queryClient.setQueryData(["author", authorId], data);
      queryClient.refetchQueries({ queryKey: ["authors"] });
      toast.success("Thêm user thành công!");
      navigate("/authors");
    },
    onError: () => {
      toast.error("Error");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const data: authorRequest = values;
    toast.warning("Đang cập nhật!");
    mutateUpdate.mutate({ data: data, id: authorId });
  };
  console.log(typeof author?.data.date_of_birth);
  useEffect(() => {
    if (author) {
      form.setValue("name", author.data.name);
      form.setValue("date_of_birth", new Date(author.data.date_of_birth));
    }
  }, [author]);
  if (isLoading) return <IsLoading />;
  if (isError) return <IsError />;
  return (
    <div className="p-2 m-4">
      <ManagerHeader
        title="Update Author"
        description="cập nhật tác giả!"
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

export default UpdateAuthor;
