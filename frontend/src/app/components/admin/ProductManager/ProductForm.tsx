"use client";

import { useState, useEffect } from "react";
import { createProduct, updateProduct } from "@/utils/productApi";
import { getAllCategorys } from "@/utils/cateApi";
import { getAllBrands } from "@/utils/brandApi";
import toast from "react-hot-toast";
import { Product } from "@/type/Product";
import { deleteOldImage } from "@/utils/deleteOldImage";
import Image from "next/image";

type Category = { _id: string; name: string };
type Brand = { _id: string; name: string };

type Props = {
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function ProductForm({ product, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<Product>({
    _id: "",
    name: "",
    price: 0,
    quantity: 0,
    description: "",
    category: "",
    brand: "",
    images: [],
    discountPrice: 0,
    rating: 0,
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    if (product) {
      setForm({
        ...product,
        category: (product.category as any)?._id || "",
        brand: (product.brand as any)?._id || "",
        images: product.images || [],
      });
      setPreviewImages(product.images || []);
    }

    const fetchData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          getAllCategorys(),
          getAllBrands(),
        ]);
        setCategories(catRes);
        setBrands(brandRes);
      } catch (err) {
        console.error("Failed to load categories or brands", err);
      }
    };

    fetchData();
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setImageFiles(fileArray);

      const previews = fileArray.map((file) => URL.createObjectURL(file));
      setPreviewImages(previews);
    }
  };
  const [errors, setErrors] = useState<Record<string, string>>({});
  const handleSubmit = async () => {
    // Validate form
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Tên sản phẩm không được để trống";
    if (form.price <= 0) newErrors.price = "Giá phải lớn hơn 0";
    if (form.quantity <= 0) newErrors.quantity = "Số lượng lớn hơn 0";
    if (!form.category) newErrors.category = "Vui lòng chọn danh mục";
    if (!form.brand) newErrors.brand = "Vui lòng chọn thương hiệu";
    if (!product && imageFiles.length === 0)
      newErrors.images = "Vui lòng chọn ít nhất 1 hình ảnh";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    //
    try {
      let imageUrls = form.images || [];

      if (imageFiles.length > 0) {
        const uploadData = new FormData();
        imageFiles.forEach((file) => uploadData.append("images", file));

        const res = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });

        const result = await res.json();
        imageUrls = result.imageUrls;

        // Xóa ảnh cũ nếu có
        if (product?.images) {
          const oldImagePath = product.images;
          await deleteOldImage(oldImagePath);
        }
      }

      const payload = {
        name: form.name,
        price: +form.price,
        quantity: +form.quantity,
        description: form.description,
        category: form.category,
        brand: form.brand,
        images: imageUrls,
        rating: form.rating,
        ...(form.discountPrice ? { discountPrice: +form.discountPrice } : {}),
      };

      if (product?._id) {
        await updateProduct(product._id, payload);
        toast.success("Cập nhật thành công");
      } else {
        await createProduct(payload);
        toast.success("Thêm sản phẩm thành công");
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-md shadow-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {product ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên sản phẩm
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nhập tên sản phẩm"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Nhập giá sản phẩm"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá khuyến mãi
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                type="number"
                name="discountPrice"
                value={form.discountPrice || 0}
                onChange={handleChange}
                placeholder="Nhập giá khuyến mãi"
              />
              {errors.discountPrice && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.discountPrice}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số lượng
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="Nhập số lượng"
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thương hiệu
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                name="brand"
                value={form.brand}
                onChange={handleChange}
              >
                <option value="">-- Chọn thương hiệu --</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select>
              {errors.brand && (
                <p className="text-red-500 text-sm mt-1">{errors.brand}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Nhập mô tả sản phẩm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đánh giá
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              type="number"
              name="rating"
              value={form.rating}
              onChange={handleChange}
              min="0"
              max="5"
              step="0.1"
              placeholder="Nhập đánh giá từ 0-5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hình ảnh
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
            {errors.images && (
              <p className="text-red-500 text-sm mt-1">{errors.images}</p>
            )}
            <div className="mt-2 flex gap-2 flex-wrap">
              {previewImages.map((src, index) => (
                <div key={index} className="relative">
                  <Image
                    src={src}
                    alt={`preview-${index}`}
                    width={96} // h-24 = 96px
                    height={96}
                    className="object-cover rounded-md border"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {product ? "Cập nhật" : "Thêm"}
          </button>
        </div>
      </div>
    </div>
  );
}
