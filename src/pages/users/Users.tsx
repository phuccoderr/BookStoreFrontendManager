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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteUser, listUsers } from "@/services/usersService";
import React, { useState } from "react";
import ManagerHeader from "@/components/ManagerHeader";
import PaginationList from "@/components/PaginationList";
import IsLoading from "@/components/IsLoading";
import IsError from "@/components/IsError";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import SearchList from "@/components/SearchList";
import TableHeadSort from "@/components/TableHeadSort";
import DialogDelete from "@/components/DialogDelete";

interface user {
  id: number;
  name: string;
  email: string;
  photo: string;
}

const Users: React.FC = () => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [sort, setSort] = useState<string>("asc");
  const [inputKeyword, setInputKeyword] = useState<string>();
  const [keyword, setKeyword] = useState<string>();
  const queryClient = useQueryClient();
  // GET USERS
  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users", pageNumber, sort, keyword],
    queryFn: () => listUsers(pageNumber, sort, keyword),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    refetchOnReconnect: true,
  });
  const totalPages = users?.data.total_pages;
  // MUTATION DELETE
  const mutationDelete = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["users"] });
      toast.success("Xoá user thành công!");
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
        title="Manager User"
        description="Đây là trang quản lý các tài khoản người dùng quản trị"
      />
      <div className="flex items-center justify-between mt-4">
        <Link to="/user">
          <Button>Add Users</Button>
        </Link>
        <SearchList
          inputKeyword={inputKeyword}
          setInputKeyword={setInputKeyword}
          setKeyword={setKeyword}
        />
      </div>
      <div>
        <Table>
          <TableCaption>Đây là danh sách tài khoản người dùng</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHeadSort sort={sort} setSort={setSort} />
              <TableHead>Photo</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.data.users.map((u: user) => (
              <TableRow key={u.id}>
                <TableCell>{u.id}</TableCell>
                <TableCell>
                  <img
                    className="rounded"
                    src={u.photo}
                    alt=""
                    width={50}
                    height={50}
                  />
                </TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.name}</TableCell>
                <TableCell className="flex gap-2">
                  <Link to={`/user/${u.id}`}>
                    <Button>Update</Button>
                  </Link>
                  <DialogDelete
                    entityId={u.id}
                    entity="user"
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

export default Users;
