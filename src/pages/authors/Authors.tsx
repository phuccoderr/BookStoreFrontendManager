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
import { deleteAuthor, listAuthors } from "@/services/authorsService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

interface author {
  id: number;
  name: string;
  date_of_birth: string;
}

const Authors: React.FC = () => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [sort, setSort] = useState<string>("asc");
  const [inputKeyword, setInputKeyword] = useState<string>();
  const [keyword, setKeyword] = useState<string>();
  const queryClient = useQueryClient();
  // FETCH DATA
  const {
    data: authors,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["authors", pageNumber, sort, keyword],
    queryFn: () => listAuthors(pageNumber, sort, keyword),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    refetchOnReconnect: true,
  });
  const totalPages = authors?.data.total_pages;
  // MUTATE
  const mutationDelete = useMutation({
    mutationFn: deleteAuthor,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["authors"] });
      toast.success("Xoá Author thành công!");
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
        title="Manager Authors"
        description="Đây là trang quản lý các tác giả"
      />
      <div className="flex items-center justify-between mt-4">
        <Link to="/author">
          <Button>Add Authors</Button>
        </Link>
        <SearchList
          inputKeyword={inputKeyword}
          setInputKeyword={setInputKeyword}
          setKeyword={setKeyword}
        />
      </div>
      <div>
        <Table>
          <TableCaption>Đây là danh sách các tác giả</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHeadSort sort={sort} setSort={setSort} />
              <TableHead>Name</TableHead>
              <TableHead>dateOfBirth</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {authors?.data.authors.map((a: author) => (
              <TableRow key={a.id}>
                <TableCell>{a.id}</TableCell>
                <TableCell>{a.name}</TableCell>
                <TableCell>{a.date_of_birth}</TableCell>
                <TableCell className="flex gap-2">
                  <Link to={`/author/${a.id}`}>
                    <Button>Update</Button>
                  </Link>
                  <DialogDelete
                    entityId={a.id}
                    entity="author"
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

export default Authors;
