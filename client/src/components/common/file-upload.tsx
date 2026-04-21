"use client";

import { ImagePlus, X } from "lucide-react";
import * as React from "react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { FileUpload, FileUploadTrigger } from "@/components/ui/file-upload";
import { toast } from "sonner";
import { fetchScanSlip } from "@/features/transactions/services/transaction.services";

interface ExampleProps {
  onScanSuccess?: (data: any) => void;
}

export const UploadImage = ({ onScanSuccess }: ExampleProps = {}) => {
  const [files, setFiles] = React.useState<File[]>([]);

  const coverPreview = files.length > 0 ? URL.createObjectURL(files[0]) : null;

  useEffect(() => {
    const scanSlip = async () => {
      if (files.length === 0) return;
      console.log(files);

      const formData = new FormData();
      formData.append("file", files[0]);
      console.log(formData.get("file"));
      try {
        toast.loading("The system is now reading the receipt...", {
          id: "scanning",
          position: "top-center",
        });

        const res = await fetchScanSlip(formData);

        toast.success("Successfully read data", {
          id: "scanning",
          position: "top-center",
        });

        console.log("Response from our API:", res.data);

        const slipInfo = res.data;

        if (onScanSuccess && slipInfo) {
          onScanSuccess(slipInfo);
        }
      } catch (error) {
        console.error(error);
        toast.error("อ่านสลิปไม่สำเร็จ โปรดลองอีกครั้ง", { id: "scanning" });
      }
    };

    scanSlip();
  }, [files]);

  const handleRemove = () => {
    setFiles([]);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <FileUpload
        value={files}
        onValueChange={setFiles}
        accept="image/*"
        maxFiles={1}
        maxSize={5 * 1024 * 1024}
      >
        <FileUploadTrigger asChild>
          <div
            className={`group relative cursor-pointer overflow-hidden rounded-lg border-2 
          border-dashed transition-all duration-300 w-full ${
            coverPreview
              ? "border-transparent shadow-lg"
              : "border-primary/30 hover:border-primary/60 bg-background/50 hover:bg-muted/20"
          }`}
          >
            {coverPreview ? (
              <div className="relative w-full h-[350px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverPreview}
                  alt="Cover"
                  className="h-full w-full object-contain bg-black/5 p-2 rounded-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div
                  onClick={() => {
                    setFiles([]);
                  }}
                  className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-2xl"
                >
                  <span className="text-lg text-white  ">Click to change</span>
                </div>
              </div>
            ) : (
              <div className="flex w-full h-[350px] flex-col items-center justify-center gap-4 transition-colors">
                <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <ImagePlus className="size-8 text-white" />
                </div>

                <div className="flex flex-col items-center gap-1 text-center px-6">
                  <h4 className="text-base font-semibold text-foreground">
                    Click to upload or drag and drop
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    SVG, PNG, JPG or GIF (max. 5MB)
                  </p>
                </div>
              </div>
            )}
          </div>
        </FileUploadTrigger>
      </FileUpload>
      {coverPreview && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-4 text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
          onClick={handleRemove}
        >
          <X className="mr-1 size-4" />
          Remove selected slip
        </Button>
      )}
    </div>
  );
};
