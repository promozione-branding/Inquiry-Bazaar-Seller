"use client"
import ProductForm from '@/components/Supplier/Product/ProductForm';
import ProductGrid from '@/components/Supplier/Product/ProductGrid';
import axios from 'axios';
import { ArrowLeft, Plus, Search } from 'lucide-react'
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import NeedHelpModal from '@/components/Supplier/Product/NeedHelpModal';
import ImageForm from '@/components/Supplier/Product/ImageForm';

export default function Products() {
  const { user } = useSelector((state) => state.auth);
  const [isAddActive, setAddActive] = useState(false)
  const [activeTab, setActiveTab] = useState("basic");
  const [description, setDescription] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [needHelp, setNeedHelp] = useState(false);
  const [images, setImages] = useState([]);

  const tabs = [
    { id: "basic", label: "Basic Info" },
    { id: "category", label: "Category" },
    { id: "price", label: "Price" },
    { id: "description", label: "Description" },
    { id: "specifications", label: "Specifications" },
    { id: "other", label: "Other" },
  ];

  const [form, setForm] = useState({
    supplierId: user?._id,
    name: "",
    brandName: "",
    slug: "",
    categoryId: "",
    subCategoryId: "",
    price: "",
    oldPrice: "",
    unit: "",
    priceType: "on_request",
    minOrderQty: 1,
    description: description,
    deliveryTime: "",
    paymentTerms: "",
    packagingDetails: "",
    supplyAbility: "",
    metaTitle: "",
    metaDescription: "",
    specifications: [],
    youtubeLink: "",
  });

  const getProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/product?supplierId=${user._id}`);
      // console.log(res)
      setProducts(res.data.data);
    } catch (err) {
      console.log("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      getProducts();
    }
  }, [user]);

  const handleSave = async () => {
    if (saving) return
    if (!form.name || !form.categoryId || !form.subCategoryId) return toast.error("Fill all required fields");

    if (form.youtubeLink?.trim()) {
      const isYoutubeUrl = form.youtubeLink.includes("youtube.com/watch?v=") || form.youtubeLink.includes("youtu.be/");

      if (!isYoutubeUrl) {
        toast.error("Please enter a valid YouTube URL");
        return;
      }
    }

    setSaving(true)
    const saveProduct = async () => {
      const formData = new FormData();
      let updatedImages = [...images];

      if (!updatedImages.some((img) => img.isPrimary) && updatedImages.length) {
        updatedImages[0].isPrimary = true;
      }

      const formattedImages = updatedImages.map((img) => ({
        url: img.url || null,
        isPrimary: img.isPrimary,
        isOld: img.isOld,
      }));

      Object.keys(form).forEach((key) => {
        if (key === "specifications") {
          formData.append(
            "specifications",
            JSON.stringify(form.specifications || [])
          );
        } else {
          formData.append(key, form[key]);
        }
      });

      updatedImages.forEach((img) => {
        if (!img.isOld && img.file) {
          formData.append("files", img.file);
        }
      });

      formData.append("imagesState", JSON.stringify(formattedImages));

      let res;
      if (editId) {
        res = await axios.put(`/api/product/${editId}`, formData);
      } else {
        res = await axios.post("/api/product", formData);
      }

      if (!res?.data?.success) {
        throw new Error(res?.data?.error || "Failed to save product");
      }
      return res.data;
    };

    try {
      await toast.promise(saveProduct(), {
        loading: editId ? "Updating product..." : "Saving product...",
        success: editId ? "Product updated!" : "Product added!",
        error: "Could not save product",
      });
      resetForm();
      setImages([]);
      setAddActive(false);
      getProducts();
    } finally {
      setSaving(false)
    }
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name || "",
      brandName: item.brandName || "",
      slug: item.slug || "",
      categoryId: item.categoryId || "",
      subCategoryId: item.subCategoryId || "",
      price: item.price || "",
      oldPrice: item.oldPrice || "",
      unit: item.unit || "",
      priceType: item.priceType || "on_request",
      minOrderQty: item.minOrderQty || 1,
      description: item.description || "",
      deliveryTime: item.deliveryTime || "",
      paymentTerms: item.paymentTerms || "",
      packagingDetails: item.packagingDetails || "",
      supplyAbility: item.supplyAbility || "",
      metaTitle: item.metaTitle || "",
      metaDescription: item.metaDescription || "",
      specifications: item.specifications || [],
      youtubeLink: item.youtubeLink || "",
    });

    const formattedImages = item?.media.map((img) => ({
      url: img.url || null,
      isPrimary: img.isPrimary,
      isOld: img.isOld,
      type: img.type,
    }));
    setImages(formattedImages);
    setEditId(item._id);
    setAddActive(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/product/${id}`);
      toast.success("Product deleted successfully");
      getProducts();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const resetForm = () => {
    setForm({
      supplierId: user?._id,
      name: "",
      brandName: "",
      slug: "",
      categoryId: "",
      subCategoryId: "",
      price: "",
      oldPrice: "",
      unit: "",
      priceType: "on_request",
      minOrderQty: 1,
      description: "",
      deliveryTime: "",
      paymentTerms: "",
      packagingDetails: "",
      supplyAbility: "",
      metaTitle: "",
      metaDescription: "",
      specifications: [],
      youtubeLink: "",
    });
    setActiveTab("basic")
    setImages([])
    setEditId(null);
  };

  return (<div className="p-4 md:p-6 w-full bg-gray-100">
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 bg-white px-4 py-3 rounded-xl shadow-sm">
      <div className='flex items-center gap-3'>
        <h1 className="text-2xl font-bold text-gray-800">
          Products
        </h1>
        <button onClick={() => { setAddActive(!isAddActive); resetForm(), setActiveTab("basic") }} className="flex items-center gap-2 bg-[#0a5183] text-white px-4 py-2 rounded-lg shadow hover:bg-[#074977] transition">
          {isAddActive ?
            <>
              <ArrowLeft size={18} />
              Back
            </>
            :
            <>
              <Plus size={18} />
              Add
            </>}
        </button>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto">
        <select name="" className='input py-2.5! text-gray-600'>
          <option value="">Select Category</option>
          {/* <option value="">Ball Pens</option> */}
        </select>
        <div className="relative w-full">
          <Search
            size={18}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Search..."
            className="input pl-8!"
          />
        </div>
      </div>
    </div>

    {isAddActive ? (
      <div className="grid lg:grid-cols-3 gap-5">
        <ImageForm
          images={images}
          setImages={setImages}
        />

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow p-2 flex flex-wrap gap-1.5">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition
              ${activeTab === tab.id ? "bg-[#D01132] text-white" : "hover:bg-[#fbe9ec] text-[#D01132] border border-[#D01132]"}`}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <ProductForm
              activeTab={activeTab}
              description={description}
              setDescription={setDescription}
              form={form}
              setForm={setForm}
            />

            <div className="flex justify-between items-center gap-3 mt-6">
              <div className="items-center">
                {activeTab == "category" && (
                  <span onClick={() => setNeedHelp(true)} className='text-blue-600 hover:underline cursor-pointer'>
                    Need help?
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setAddActive(false); resetForm() }} className="cursor-pointer px-5 py-2 rounded-lg bg-[#D01132] text-white">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving} className="cursor-pointer px-6 py-2 bg-[#0a5183] text-white rounded-lg">
                  {editId ?
                    saving ? "Updating..." : "Update"
                    : saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <ProductGrid
        products={products}
        loading={loading}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    )}

    <NeedHelpModal open={needHelp} onClose={() => setNeedHelp(false)} user={user} />
  </div>)
}