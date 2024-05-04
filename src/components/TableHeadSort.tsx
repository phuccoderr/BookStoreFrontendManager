import React from "react";
import { TableHead } from "./ui/table";

interface tableHeadSort {
  sort: string;
  setSort: React.Dispatch<React.SetStateAction<string>>;
}

const TableHeadSort: React.FC<tableHeadSort> = ({ sort, setSort }) => {
  const handleParamSort = () => {
    const sortOrder = sort === "asc" ? "desc" : "asc";
    setSort(sortOrder);
  };
  return (
    <TableHead className="cursor-pointer underline" onClick={handleParamSort}>
      Id
    </TableHead>
  );
};

export default TableHeadSort;
