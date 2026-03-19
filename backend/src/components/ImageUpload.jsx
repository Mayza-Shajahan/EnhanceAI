import React, { useState } from "react";
import { UploadCloud } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ImageUpload() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", image);

    const res = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    setPreview(url);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
      <Card className="w-full max-w-lg rounded-2xl shadow-xl">
        <CardContent className="p-6 text-center">
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:bg-gray-50"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <UploadCloud className="mx-auto mb-4" size={40} />
            <p className="text-lg font-semibold">Drag & Drop Image</p>
            <p className="text-sm text-gray-500">or click to upload</p>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>

          {preview && (
            <div className="mt-6">
              <img
                src={preview}
                alt="preview"
                className="rounded-xl shadow-md max-h-64 mx-auto"
              />
            </div>
          )}

          {image && (
            <Button className="mt-6 w-full" onClick={handleUpload}>
              Enhance Image
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
