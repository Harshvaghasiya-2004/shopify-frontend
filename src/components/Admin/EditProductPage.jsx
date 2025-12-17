import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  fetchProductDetails,
  updateProduct,
} from "../../redux/slices/productsSlice";
import axios from "axios";

const EditProductPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products
  );
  const { user } = useSelector((state) => state.auth);

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct) {
      setProductData(selectedProduct);
    }
  }, [selectedProduct]);

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    countInStock: "",
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: "",
    material: "",
    gender: "",
    images: [],
  });

  // Handle basic inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //     // Backend returns { images: [{ url, public_id, alt }] }
  //     const newImages = data.images.map((img, index) => ({
  //       url: img.url,
  //       altText: img.alt || files[index].name.split(".")[0], // Use filename as fallback alt
  //       publicId: img.public_id, // Optional: Store for delete later
  //     }));

  //     setProductData((prev) => ({
  //       ...prev,
  //       images: [...prev.images, ...newImages], // Append new images
  //     }));

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const formData = new FormData();
    formData.append("image", files[0]); // Only one file since backend is single

    try {
      setUploading(true);

      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      // Use backend response directly
      const newImage = {
        url: data.url,
        altText: files[0].name.split(".")[0], // fallback alt
        publicId: data.public_id,
      };

      setProductData((prev) => ({
        ...prev,
        images: [...prev.images, newImage], // append
      }));

      e.target.value = ""; // clear input
      toast.success("Image uploaded!");
    } catch (error) {
      console.error(
        "Image upload error:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProduct({ id, productData }));
    navigate("/admin/products");
  };
  if (loading) return <p>Loading</p>;
  if (error) return <p>Error..{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Edit Product</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block font-semibold mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            rows={4}
            required
          />
        </div>

        {/* Price */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Stock */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Stock</label>
          <input
            type="number"
            name="countInStock"
            value={productData.countInStock}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* SKU */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">SKU</label>
          <input
            type="text"
            name="sku"
            value={productData.sku}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Sizes Input */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Sizes (comma separated)
          </label>
          <input
            type="text"
            placeholder="S, M, L, XL"
            className="border px-4 py-2 rounded w-full"
            onChange={(e) =>
              setProductData({
                ...productData,
                sizes: e.target.value.split(",").map((s) => s.trim()),
              })
            }
          />
        </div>

        {/* Colors Input */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Colors (comma separated)
          </label>
          <input
            type="text"
            placeholder="Red, Blue, Black"
            className="border px-4 py-2 rounded w-full"
            onChange={(e) =>
              setProductData({
                ...productData,
                colors: e.target.value.split(",").map((c) => c.trim()),
              })
            }
          />
        </div>

        {/* Images */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Upload Images</label>

          <input
            type="file"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-2"
          />
          {uploading && <p>Uploading Image...</p>}

          <div className="flex gap-4 mt-4 flex-wrap">
            {productData.images.map((image, index) => (
              <div key={index}>
                <img
                  src={image.url}
                  alt={`product-${index}`}
                  className="w-20 h-20 object-cover rounded-md shadow-md"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white rounded-md py-2 hover:bg-green-600 transition-colors"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
