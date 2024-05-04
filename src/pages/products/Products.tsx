import IsError from "@/components/IsError";
import IsLoading from "@/components/IsLoading";
import ManagerHeader from "@/components/ManagerHeader";
import PaginationList from "@/components/PaginationList";
import SearchList from "@/components/SearchList";
import TableHeadSort from "@/components/TableHeadSort";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { listProducts } from "@/services/productService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Products: React.FC = () => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [sort, setSort] = useState<string>("asc");
  const [inputKeyword, setInputKeyword] = useState<string>();
  const [keyword, setKeyword] = useState<string>();
  const queryClient = useQueryClient();
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", pageNumber, sort, keyword],
    queryFn: () => listProducts(pageNumber, sort, keyword),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    refetchOnReconnect: true,
  });
  const totalPages = products?.data.total_pages;
  if (isLoading) return <IsLoading />;
  if (isError) return <IsError />;
  return (
    <div className="p-2 m-4">
      <ManagerHeader
        title="Manager Products"
        description="Đây là trang quản lý danh sách sản phẩm!"
      />
      <div className="flex items-center justify-between mt-4">
        <Link to="/product">
          <Button>Add Products</Button>
        </Link>
        <SearchList
          inputKeyword={inputKeyword}
          setInputKeyword={setInputKeyword}
          setKeyword={setKeyword}
        />
      </div>
      <div>
        <Table>
          <TableCaption>Đây là danh sách các sản phẩm</TableCaption>
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
            {products?.data.products.map((p: any) => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.alias}</TableCell>
                <TableCell>
                  <img
                    className="rounded"
                    src={p.mainImage}
                    alt=""
                    width={50}
                    height={50}
                  />
                </TableCell>
                <TableCell className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Product Details</Button>
                    </DialogTrigger>
                    <DialogContent className="h-[512px] w-[512px]">
                      <DialogHeader>
                        <DialogTitle>Product: {p.name}</DialogTitle>
                        <Tabs defaultValue="info">
                          <TabsList className="w-full justify-between">
                            <TabsTrigger value="info">Info</TabsTrigger>
                            <TabsTrigger value="description">
                              Description
                            </TabsTrigger>
                            <TabsTrigger value="images">Images</TabsTrigger>
                            <TabsTrigger value="details">Details</TabsTrigger>
                          </TabsList>
                          <TabsContent value="info">
                            <div className="flex items-center justify-between gap-2">
                              <div className="w-full">
                                <Label htmlFor="name">Name:</Label>
                                <Input id="name" value={p.name} readOnly />
                              </div>
                              <div className="w-full">
                                <Label htmlFor="alias">Alias:</Label>
                                <Input id="alias" value={p.alias} readOnly />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="cost">Cost:</Label>
                              <Input id="cost" value={p.cost} readOnly />

                              <Label htmlFor="price">Price:</Label>
                              <Input id="price" value={p.price} readOnly />

                              <Label htmlFor="sale">Sale:</Label>
                              <Input id="sale" value={p.sale} readOnly />
                            </div>
                            <div></div>
                          </TabsContent>
                          <TabsContent value="description">
                            <div>
                              <Label htmlFor="shortDescription">
                                Short Description:
                              </Label>
                              <Textarea
                                id="shortDescription"
                                value={p.shortDescription}
                                placeholder="Type your message here."
                                readOnly
                              />

                              <Label htmlFor="fullDescription">
                                Full Description:
                              </Label>
                              <Textarea
                                id="fullDescription"
                                value={p.fullDescription}
                                placeholder="Type your message here."
                                readOnly
                              />
                            </div>
                          </TabsContent>
                          <TabsContent className="flex gap-4 " value="images">
                            <div className="p-4">
                              <h1 className="font-bold mb-2">Main Image</h1>
                              <img src={p.mainImage} width={200} height={100} />
                            </div>
                            <ScrollArea className="h-72 w-56 rounded-md border bg-slate-100">
                              <div className="p-4">
                                <h4 className="mb-4 font-bold leading-none">
                                  Extra Images
                                </h4>
                                {p.productImages.map((image: any) => (
                                  <div key={image.id}>
                                    <img
                                      src={image.name}
                                      width={200}
                                      height={100}
                                    />
                                    <Separator className="my-2" />
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          </TabsContent>
                          <TabsContent value="details">
                            {p.productDetails.map((d: any) => (
                              <div className="flex items-center gap-2">
                                <div>
                                  <Label>Name:</Label>
                                  <Input value={d.name} readOnly />
                                </div>
                                <div>
                                  <Label>Value:</Label>
                                  <Input value={d.value} readOnly />
                                </div>
                              </div>
                            ))}
                          </TabsContent>
                        </Tabs>
                      </DialogHeader>

                      <DialogFooter>
                        <DialogClose asChild>
                          <Button className="mt-auto" type="button">
                            Close
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Link to={`/category/${p.id}`}>
                    <Button>Update</Button>
                  </Link>
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

export default Products;
