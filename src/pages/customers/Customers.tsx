import IsError from "@/components/IsError";
import IsLoading from "@/components/IsLoading";
import ManagerHeader from "@/components/ManagerHeader";
import PaginationList from "@/components/PaginationList";
import SearchList from "@/components/SearchList";
import TableHeadSort from "@/components/TableHeadSort";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { enabledCustomer, listCustomers } from "@/services/customersSerivce";
import { customer } from "@/types/customerTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "react-toastify";

const Customers: React.FC = () => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [sort, setSort] = useState<string>("asc");
  const [inputKeyword, setInputKeyword] = useState<string>();
  const [keyword, setKeyword] = useState<string>();
  const queryClient = useQueryClient();

  const {
    data: customers,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["customers", pageNumber, sort, keyword],
    queryFn: () => listCustomers(pageNumber, sort, keyword),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    refetchOnReconnect: true,
  });
  const totalPages = customers?.data.total_pages;
  // MUTATE ENABLED CUSTOMERS
  const mutateEnabled = useMutation({
    mutationFn: enabledCustomer,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["customers"] });
      toast.success("Cập nhật thành công!");
    },
    onError: () => {
      toast.error("Error");
    },
  });
  const handleEnabled = (cusId: number, enabled: boolean) => {
    mutateEnabled.mutate({ id: cusId, enabled });
  };

  if (isLoading) return <IsLoading />;
  if (isError) return <IsError />;
  return (
    <div className="p-2 m-4">
      <ManagerHeader
        title="Manager Customers"
        description="Đây là trang quản lý các khách hàng"
      />
      <div className="flex items-center justify-between mt-4">
        <SearchList
          inputKeyword={inputKeyword}
          setInputKeyword={setInputKeyword}
          setKeyword={setKeyword}
        />
      </div>
      <div>
        <Table>
          <TableCaption>Đây là danh sách các khách hàng</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHeadSort sort={sort} setSort={setSort} />
              <TableHead>Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Enabled</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers?.data.customers.map((c: customer) => (
              <TableRow key={c.id}>
                <TableCell>{c.id}</TableCell>
                <TableCell>
                  <img
                    className="rounded"
                    src={c.photo}
                    alt=""
                    width={50}
                    height={50}
                  />
                </TableCell>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>
                  <h1>{c.enabled}</h1>
                  <input
                    className=""
                    type="checkbox"
                    checked={c.enabled}
                    onChange={() => handleEnabled(c.id, !c.enabled)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <PaginationList
          setState={setPageNumber}
          pageNumber={pageNumber}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default Customers;
