import React, { useRef } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FaSearch } from "react-icons/fa";

interface searchProps {
  inputKeyword: string | undefined;
  setInputKeyword: React.Dispatch<React.SetStateAction<string | undefined>>;
  setKeyword: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const SearchList: React.FC<searchProps> = ({
  inputKeyword = "",
  setInputKeyword,
  setKeyword,
}) => {
  const ref = useRef(null);
  const handleParamKeyword = () => {
    setKeyword(inputKeyword);
  };

  const handleClear = () => {
    setKeyword(undefined);
    setInputKeyword("");
  };
  return (
    <div className="flex max-w-sm items-center space-x-2">
      <Input
        type="text"
        placeholder="Tìm kiếm"
        ref={ref}
        value={inputKeyword}
        onChange={(e) => setInputKeyword(e.target.value)}
      />
      <Button type="button" onClick={handleParamKeyword}>
        <FaSearch />
      </Button>
      <Button type="button" onClick={handleClear}>
        Clear
      </Button>
    </div>
  );
};

export default SearchList;
