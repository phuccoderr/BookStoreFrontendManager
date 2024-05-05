import React from "react";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";

interface imageProductsProps {
  image: File | undefined;
  setImage: React.Dispatch<React.SetStateAction<File | undefined>>;
  extraImage: File[] | undefined;
  setExtraImage: React.Dispatch<React.SetStateAction<File[] | undefined>>;
  mainImage?: string;
  productImages?: [];
}

const ImageProduct: React.FC<imageProductsProps> = ({
  image,
  setImage,
  extraImage,
  setExtraImage,
  mainImage,
  productImages,
}) => {
  console.log("images", productImages);
  console.log("extra", extraImage);
  return (
    <>
      <div className=" w-full gap-1.5 mt-4">
        <h4 className="mb-4 font-bold leading-none">Main Image</h4>
        <Input
          type="file"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFile = e.target.files && e.target.files[0];
            if (selectedFile) {
              setImage(selectedFile);
            }
          }}
        />
        {image ? (
          <img
            src={URL.createObjectURL(image)}
            loading="lazy"
            width={200}
            height={250}
            className="rounded-lg mt-2"
          />
        ) : (
          <img
            src={mainImage}
            loading="lazy"
            width={200}
            height={250}
            className="rounded-lg mt-2"
          />
        )}
      </div>
      <ScrollArea className="h-72 w-full rounded-md border bg-slate-100">
        <div className="p-4">
          <h4 className="mb-4 font-bold leading-none">Extra Images</h4>
          <Input
            id="picture"
            type="file"
            multiple
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const selectedFiles = e.target.files;
              if (selectedFiles) {
                const newFiles: File[] = [];
                for (let i = 0; i < selectedFiles.length; i++) {
                  newFiles.push(selectedFiles[i]);
                }
                setExtraImage(() => [...newFiles]);
              }
            }}
          />
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          {extraImage
            ? extraImage.map((ei, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(ei)}
                  loading="lazy"
                  width={180}
                  height={250}
                  className="rounded-lg mt-2"
                />
              ))
            : productImages?.map((pi: { name: string }, index) => (
                <img
                  key={index}
                  src={pi.name}
                  loading="lazy"
                  width={180}
                  height={250}
                  className="rounded-lg mt-2"
                />
              ))}
        </div>
      </ScrollArea>
    </>
  );
};

export default ImageProduct;
