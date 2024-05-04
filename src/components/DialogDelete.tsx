import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { UseMutationResult } from "@tanstack/react-query";
import { toast } from "react-toastify";
interface dialogDeleteProps {
  entityId: number;
  entity: string;
  mutationDelete: UseMutationResult<
    {
      status: number;
      statusText: string;
      data: unknown;
    },
    Error,
    number,
    unknown
  >;
}
const DialogDelete: React.FC<dialogDeleteProps> = ({
  entityId,
  entity,
  mutationDelete,
}) => {
  const handleDeleteUser = (id: number) => {
    toast.warning("Đang cập nhật!");
    mutationDelete.mutate(id);
  };
  return (
    <Dialog>
      <DialogTrigger className="bg-red-400 rounded-md p-2">
        Delete
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete {entity} ID: {entityId}
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xoá {entity} này không ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            className="bg-green-600"
            onClick={() => handleDeleteUser(entityId)}
          >
            Ok
          </Button>
          <DialogClose asChild>
            <Button type="button">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDelete;
