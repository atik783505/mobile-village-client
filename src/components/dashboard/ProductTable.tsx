"use client";

import { Chip, Button, Table } from "@heroui/react";
import { Plus, Package, Search, Edit3, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
// আপনার পূর্বে ঘোষিত ProductData ইন্টারফেসটি ইমপোর্ট বা ব্যবহার করুন
import type { ProductData } from "@/types"; // আপনার ফোল্ডার স্ট্রাকচার অনুযায়ী পাথ দিয়ে নিন

const columns = [
  { id: "name", name: "Product Info" },
  { id: "category", name: "Category" },
  { id: "price", name: "Price" },
  { id: "stock", name: "Stock & Status" },
  { id: "actions", name: "Actions" },
];

interface ProductTableProps {
  initialProducts: ProductData[];
}

export default function ProductTable({ initialProducts }: ProductTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Search filter
  const filteredProducts = useMemo(() => {
    return (initialProducts || []).filter((product) => {
      const query = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        (product.brand && product.brand.toLowerCase().includes(query))
      );
    });
  }, [initialProducts, searchQuery]);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Manage Inventory
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Organize, track stock, and manage your product catalogue.
            </p>
          </div>
        </div>
        <Link href="/dashboard/admin/manage-product/new">
          <Button className="bg-emerald-600 text-white font-medium px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-500/20 flex items-center gap-2 cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Button>
        </Link>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Search Toolbar */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between gap-4 bg-gray-50/50">
          <div className="relative w-full max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, category, SKU, brand..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
            />
          </div>
          <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
            Total: {filteredProducts.length} Items
          </span>
        </div>

        {/* Table Container */}
        <Table aria-label="Products management table" className="w-full">
          <Table.ScrollContainer className="h-[450px] overflow-y-auto">
            <Table.Content className="w-full">
              <Table.Header className="sticky top-0 z-10 bg-gray-50 border-b border-gray-100 text-gray-600 font-semibold text-xs uppercase tracking-wider">
                {columns.map((col) => (
                  <Table.Column
                    key={col.id}
                    id={col.id}
                    isRowHeader={col.id === "name"}
                    className="py-3.5 px-6 text-left"
                  >
                    {col.name}
                  </Table.Column>
                ))}
              </Table.Header>
              <Table.Body className="divide-y divide-gray-50">
                <Table.Collection items={filteredProducts}>
                  {(product) => {
                    const stock = product.stock ?? 0;
                    const isOutOfStock = stock <= 0;

                    return (
                      <Table.Row
                        key={product.sku}
                        className="hover:bg-emerald-50/30 transition-colors"
                      >
                        {/* 1. Product Name, Brand & SKU */}
                        <Table.Cell className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900 text-sm">
                              {product.name}
                            </span>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                              {product.brand && (
                                <span className="font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                  {product.brand}
                                </span>
                              )}
                              <span>SKU: {product.sku}</span>
                            </div>
                          </div>
                        </Table.Cell>

                        {/* 2. Category */}
                        <Table.Cell className="py-4 px-6 text-gray-600 text-sm">
                          {product.category}
                        </Table.Cell>

                        {/* 3. Price & Discount Price */}
                        <Table.Cell className="py-4 px-6">
                          <div className="flex items-baseline gap-2">
                            {product.discountPrice ? (
                              <>
                                <span className="font-semibold text-emerald-600 text-sm">
                                  ${product.discountPrice}
                                </span>
                                <span className="text-xs text-gray-400 line-through">
                                  ${product.price}
                                </span>
                              </>
                            ) : (
                              <span className="font-semibold text-gray-900 text-sm">
                                ${product.price}
                              </span>
                            )}
                          </div>
                        </Table.Cell>

                        {/* 4. Stock & Status */}
                        <Table.Cell className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Chip
                              color={isOutOfStock ? "danger" : stock < 5 ? "warning" : "success"}
                              size="sm"
                              variant="soft"
                              className="font-semibold"
                            >
                              {isOutOfStock
                                ? "Out of Stock"
                                : stock < 5
                                ? `Low Stock (${stock})`
                                : "In Stock"}
                            </Chip>
                            {!isOutOfStock && (
                              <span className="text-xs text-gray-500">
                                ({stock} left)
                              </span>
                            )}
                          </div>
                        </Table.Cell>

                        {/* 5. Actions */}
                        <Table.Cell className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Link href={`/dashboard/admin/manage-product/${product.id}`}>
                              <button
                                title="View"
                                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </Link>
                            <Link href={`/dashboard/admin/manage-product/${product.id}/edit`}>
                              <button
                                title="Edit"
                                className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-600 hover:text-emerald-700 transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                            </Link>
                            <Link href={`/dashboard/admin/manage-product/${product.id}/delete`}>
                              <button
                                title="Delete"
                                className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-500 hover:text-rose-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </Link>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    );
                  }}
                </Table.Collection>
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>
    </div>
  );
}