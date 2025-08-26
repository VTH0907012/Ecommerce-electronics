"use client";
import { useEffect, useState } from "react";
import { Category } from "@/types/Category";
import toast from "react-hot-toast";
import { deleteOldImage } from "@/utils/deleteOldImage";
import { createCategory, updateCategory } from "@/utils/cateApi";
import Image from "next/image";

interface Props {
  category: Category | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CategoryFormModal({
  category,
  onClose,
  onSuccess,
}: Props) {
  const [form, setForm] = useState<Category>({
    name: "",
    description: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (category) setForm(category);
  }, [category]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setForm({ ...form, image: URL.createObjectURL(file) }); // Xem trước ảnh
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }
    if (!form.image.trim()) {
      toast.error("Vui lòng chọn ảnh danh mục");
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl = form.image;

      if (imageFile) {
        // Upload ảnh mới nếu có
        const uploadData = new FormData();
        uploadData.append("images", imageFile);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });

        const result = await res.json();
        imageUrl = result.imageUrls?.[0];

        // Xóa ảnh cũ nếu có
        if (category?.image) {
          const oldImagePath = category.image;
          await deleteOldImage(oldImagePath);
        }
      }

      const payload = {
        name: form.name,
        description: form.description,
        image: imageUrl,
      };

      if (category?._id) {
        await updateCategory(category._id, payload);
        toast.success("Cập nhật danh mục thành công");
      } else {
        await createCategory(payload);
        toast.success("Thêm danh mục thành công");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      if (err.response?.status === 400 && err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {category ? "Cập nhật danh mục" : "Thêm danh mục mới"}
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
                Tên danh mục *
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nhập tên danh mục"
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
                placeholder="Nhập mô tả danh mục"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hình ảnh
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500 transition">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="mt-2 text-sm text-gray-600">
                    Chọn ảnh hoặc kéo thả vào đây
                  </span>
                </label>
              </div>
              {form.image && (
                <div className="mt-2">
                  <Image
                    src={form.image}
                    alt="Xem trước"
                    width={128} // h-32 = 128px
                    height={128}
                    className="object-contain rounded-md border border-gray-200"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
              disabled={isLoading}
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
              disabled={isLoading}
            >
              {isLoading && (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {category ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
