"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { Plus, Trash2, ArrowLeft, PackagePlus, ImagePlus, Loader2, UploadCloud } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ProductData } from "@/types";
import { createProduct } from "@/lib/actions/product";


export default function AddProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<ProductData>>({
    name: "",
    category: "",
    sku: "",
    price: undefined,
    discountPrice: undefined,
    stock: undefined,
    brand: "",
    shortDescription: "",
    fullDescription: "",
    images: [""],
  });

  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([
    { key: "", value: "" },
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? undefined : Number(value)) : value,
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    const updatedImages = [...(formData.images || [])];
    updatedImages[index] = value;
    setFormData((prev) => ({ ...prev, images: updatedImages }));
  };

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIndex(index);
    setErrorMsg(null);

    const imageFormData = new FormData();
    imageFormData.append("image", file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: "POST",
        body: imageFormData,
      });

      const data = await response.json();

      if (data.success) {
        const imageUrl = data.data.url;
        handleImageChange(index, imageUrl);
      } else {
        setErrorMsg(data.error?.message || "Failed to upload image to ImageBB");
      }
    } catch (err) {
      setErrorMsg("Image upload failed. Please check your connection.");
    } finally {
      setUploadingIndex(null);
    }
  };

  const addImageField = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), ""],
    }));
  };

  const removeImageField = (index: number) => {
    const updatedImages = (formData.images || []).filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: updatedImages }));
  };

  const handleSpecChange = (index: number, field: "key" | "value", value: string) => {
    const updatedSpecs = [...specs];
    updatedSpecs[index][field] = value;
    setSpecs(updatedSpecs);
  };

  const addSpecField = () => {
    setSpecs([...specs, { key: "", value: "" }]);
  };

  const removeSpecField = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const specificationsObj: Record<string, string> = {};
    specs.forEach((item) => {
      if (item.key.trim() !== "") {
        specificationsObj[item.key] = item.value;
      }
    });

    const finalProductData: ProductData = {
      name: formData.name || "",
      sku: formData.sku || "",
      category: formData.category || "",
      price: formData.price || 0,
      stock: formData.stock,
      brand: formData.brand || null,
      shortDescription: formData.shortDescription,
      fullDescription: formData.fullDescription,
      discountPrice: formData.discountPrice || null,
      images: (formData.images || []).filter((img) => img.trim() !== ""),
      specifications: Object.keys(specificationsObj).length > 0 ? specificationsObj : null,
    };

    try {
      const res = await createProduct(finalProductData);

      if (res.success) {
        router.push("/dashboard/admin/manage-product");
      } else {
        setErrorMsg(res.message || "Failed to create product");
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/admin/manage-product"
            className="p-2.5 text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <PackagePlus className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Add New Product</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Fill in the details below to add a product to your store.
              </p>
            </div>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
          {errorMsg}
        </div>
      )}

      {/* Main Form Section */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
                General Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Product Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. iPhone 15 Pro Max"
                    value={formData.name || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                      SKU <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="sku"
                      required
                      placeholder="e.g. IP15PM-256GB"
                      value={formData.sku || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                      Brand
                    </label>
                    <input
                      type="text"
                      name="brand"
                      placeholder="e.g. Apple"
                      value={formData.brand || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Short Description
                  </label>
                  <input
                    type="text"
                    name="shortDescription"
                    placeholder="Brief summary of the product..."
                    value={formData.shortDescription || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Full Description
                  </label>
                  <textarea
                    name="fullDescription"
                    rows={4}
                    placeholder="Detailed description of features, warranty, etc."
                    value={formData.fullDescription || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
                Pricing & Stock
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Price ($) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    placeholder="999.00"
                    value={formData.price ?? ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Discount Price ($)
                  </label>
                  <input
                    type="number"
                    name="discountPrice"
                    min="0"
                    step="0.01"
                    placeholder="899.00"
                    value={formData.discountPrice ?? ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="stock"
                    min="0"
                    placeholder="50"
                    value={formData.stock ?? ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h2 className="text-base font-bold text-gray-900">Specifications</h2>
                <Button
                  type="button"
                  onPress={addSpecField}
                  className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Field</span>
                </Button>
              </div>

              <div className="space-y-3">
                {specs.map((spec, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Key (e.g. RAM)"
                      value={spec.key}
                      onChange={(e) => handleSpecChange(index, "key", e.target.value)}
                      className="w-1/2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g. 12GB)"
                      value={spec.value}
                      onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                      className="w-1/2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                    {specs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSpecField(index)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
                Category
              </h2>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Select Category <span className="text-rose-500">*</span>
                </label>
                <select
                  name="category"
                  required
                  value={formData.category || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                >
                  <option value="">Select a category</option>
                  <option value="Smartphone">Smartphone</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Smartwatch">Smartwatch</option>
                </select>
              </div>
            </div>

            {/* Product Images with ImageBB File Upload */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h2 className="text-base font-bold text-gray-900">Product Images</h2>
                <Button
                  type="button"
                  onPress={addImageField}
                  className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <ImagePlus className="w-3.5 h-3.5" />
                  <span>Add Field</span>
                </Button>
              </div>

              <div className="space-y-4">
                {(formData.images || []).map((img, index) => (
                  <div key={index} className="p-3 bg-gray-50/70 border border-gray-200 rounded-xl space-y-2.5">
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        placeholder="Image URL or upload file below"
                        value={img}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      />
                      {(formData.images || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageField(index)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* File Upload Input */}
                    <div className="flex items-center justify-between">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-lg text-xs font-medium transition shadow-sm">
                        {uploadingIndex === index ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Choose File</span>
                          </>
                        )}
                       <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(index, e)} // এখানে আগের ভুল কোডটি সংশোধন করা হয়েছে
                          disabled={uploadingIndex === index}
                        />
                      </label>

                      {img && (
                        <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                          Uploaded / Linked ✓
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/admin/manage-product"
                className="w-1/2 py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-xl text-center text-sm hover:bg-gray-200 transition-all"
              >
                Cancel
              </Link>
              <Button
                type="submit"
                isDisabled={isSubmitting}
                className="w-1/2 py-3 px-4 bg-emerald-600 text-white font-semibold rounded-xl text-center text-sm hover:bg-emerald-700 transition-all shadow-md shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Product</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}