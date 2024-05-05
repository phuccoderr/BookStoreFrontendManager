import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { InfoProductProps } from "@/types/product/types";

const DetailProduct: React.FC<InfoProductProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="productDetails"
      render={({ field }) => (
        <>
          <Button
            onClick={() => {
              field.value.push({ name: "", value: "" });
              form.setValue("productDetails", field.value);
            }}
            className="mt-auto"
            type="button"
          >
            Add
          </Button>
          {field.value.map((d, index) => (
            <div className="flex gap-4 items-center" key={index}>
              <div className="w-full">
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập name chi tiết!"
                      type="text"
                      value={d.name}
                      onChange={(e) => {
                        const updatedProductDetails = [...field.value];
                        updatedProductDetails[index].name = e.target.value;
                        form.setValue("productDetails", updatedProductDetails);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>

              <div className="w-full">
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập giá trị value!"
                      type="text"
                      value={d.value}
                      onChange={(e) => {
                        const updatedProductDetails = [...field.value];
                        updatedProductDetails[index].value = e.target.value;
                        form.setValue("productDetails", updatedProductDetails);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>

              <Button
                className="bg-red-400 mt-auto w-16"
                type="button"
                onClick={() => {
                  const updatedProductDetails = [...field.value];

                  updatedProductDetails.pop();
                  form.setValue("productDetails", updatedProductDetails);
                }}
              >
                Delete
              </Button>
            </div>
          ))}
        </>
      )}
    ></FormField>
  );
};

export default DetailProduct;
