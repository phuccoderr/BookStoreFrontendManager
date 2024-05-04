import DialogDelete from "@/components/DialogDelete";
import IsError from "@/components/IsError";
import IsLoading from "@/components/IsLoading";
import ManagerHeader from "@/components/ManagerHeader";
import PaginationList from "@/components/PaginationList";
import SearchList from "@/components/SearchList";
import TableHeadSort from "@/components/TableHeadSort";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteCategory, listCategories } from "@/services/categroiesService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

interface category {
  id: number;
  name: string;
  alias: string;
  imageURL: string;
}

const Categories: React.FC = () => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [sort, setSort] = useState<string>("asc");
  const [inputKeyword, setInputKeyword] = useState<string>();
  const [keyword, setKeyword] = useState<string>();
  const queryClient = useQueryClient();
  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories", pageNumber, sort, keyword],
    queryFn: () => listCategories(pageNumber, sort, keyword),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    refetchOnReconnect: true,
  });
  const totalPages = categories?.data.total_pages;

  // MUTATE
  const mutationDelete = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["categories"] });
      toast.success("Xoá category thành công!");
    },
    onError: () => {
      toast.error("Error");
    },
  });

  if (isLoading) return <IsLoading />;
  if (isError) return <IsError />;
  return (
    <div className="p-2 m-4">
      <ManagerHeader
        title="Manager Categories"
        description="Đây là trang quản lý các danh mục sản phẩm"
      />
      <div className="flex items-center justify-between mt-4">
        <Link to="/category">
          <Button>Add Categories</Button>
        </Link>
        <SearchList
          inputKeyword={inputKeyword}
          setInputKeyword={setInputKeyword}
          setKeyword={setKeyword}
        />
      </div>
      <div>
        <Table>
          <TableCaption>Đây là danh sách các danh mục</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHeadSort sort={sort} setSort={setSort} />
              <TableHead>Name</TableHead>
              <TableHead>Alias</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.data.categories.map((c: category) => (
              <TableRow key={c.id}>
                <TableCell>{c.id}</TableCell>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.alias}</TableCell>
                <TableCell>
                  <img
                    className="rounded"
                    src={c.imageURL}
                    alt=""
                    width={50}
                    height={50}
                  />
                </TableCell>
                <TableCell className="flex gap-2">
                  <Link to={`/category/${c.id}`}>
                    <Button>Update</Button>
                  </Link>
                  <DialogDelete
                    entityId={c.id}
                    entity="category"
                    mutationDelete={mutationDelete}
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

export default Categories;
