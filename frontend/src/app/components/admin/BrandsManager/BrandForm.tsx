"use client";

import { useEffect, useState } from "react";
import { createBrand, updateBrand } from "@/utils/brandApi";
import { Brand } from "@/type/Brand";
import toast from "react-hot-toast";
import { deleteOldImage } from "@/utils/deleteOldImage";
import Image from "next/image";

type Props = {
  brand: Brand | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function BrandForm({ brand, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<Brand>({
    name: "",
    description: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (brand) setForm(brand);
  }, [brand]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setForm({ ...form, image: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error("Vui lòng nhập tên nhãn hiệu");
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl = form.image;

      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append("images", imageFile);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });

        const result = await res.json();
        imageUrl = result.imageUrls?.[0];

        if (brand?.image) {
          const oldImagePath = brand.image;
          await deleteOldImage(oldImagePath);
        }
      }

      const payload = {
        name: form.name,
        description: form.description,
        image: imageUrl,
      };

      if (brand?._id) {
        await updateBrand(brand._id, payload);
        toast.success("Cập nhật nhãn hiệu thành công");
      } else {
        await createBrand(payload);
        toast.success("Thêm nhãn hiệu thành công");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Lỗi khi lưu nhãn hiệu:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {brand ? "Cập nhật nhãn hiệu" : "Thêm nhãn hiệu mới"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên nhãn hiệu *
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nhập tên nhãn hiệu"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Nhập mô tả nhãn hiệu"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500 transition">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <span className="text-gray-500 text-sm">Chọn ảnh</span>
                  {form.image && (
                    <div className="relative mt-2 h-32 w-auto max-w-[200px]">
                      <Image
                        src={form.image}
                        alt="preview"
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              disabled={isLoading}
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              disabled={isLoading}
            >
              {isLoading ? "Đang lưu..." : brand ? "Cập nhật" : "Thêm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
