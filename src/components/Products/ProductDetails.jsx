import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "../../redux/slices/productsSlice";
import { addToCart } from "../../redux/slices/cartSlice";

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error, similarProducts } = useSelector(
    (state) => state.products
  );

  const { user, guestId } = useSelector((state) => state.auth);
  const [mainImage, setMainImage] = useState();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [buttonText, setButtonText] = useState("ADD TO CART");

  const productFetchId = productId || id;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  const handleQuantityChange = (action) => {
    if (action === "plus") setQuantity((p) => p + 1);
    if (action === "minus" && quantity > 1) setQuantity((p) => p - 1);
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error("Please select size before adding to cart.", {
        duration: 1000,
      });
      return;
    }

    if (!selectedColor) {
      toast.error("Please select color before adding to cart.", {
        duration: 1000,
      });
      return;
    }

    setIsButtonDisabled(true);
    setButtonText("ADDING...");

    try {
      console.log("Dispatching addToCart API", {
        productId: productFetchId,
        quantity,
        size: selectedSize,
        color: selectedColor,
        guestId,
        userId: user?._id,
      });

      const resultAction = await dispatch(
        addToCart({
          productId: productFetchId,
          quantity,
          size: selectedSize,
          color: selectedColor,
          guestId,
          userId: user?._id,
        })
      );

      if (addToCart.fulfilled.match(resultAction)) {
        toast.success("Product added to cart", { duration: 1000 });
        setButtonText("ADDED");
      } else {
        throw new Error(resultAction.payload || "Failed to add product");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong", { duration: 1500 });
      setButtonText("ADD TO CART");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error...{error}</p>;

  return (
    <div className="p-6">
      {selectedProduct && (
        <div className="max-w-6xl mx-auto bg-white rounded-lg p-8">
          <div className="flex flex-col md:flex-row gap-10">
            {/* LEFT */}
            <div className="md:w-1/2 flex">
              {/* Desktop Thumbnails */}
              <div className="hidden md:flex flex-col space-y-4 mr-4">
                {selectedProduct?.images?.map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    alt={img.altText}
                    onClick={() => setMainImage(img.url)}
                    className={`w-20 h-20 rounded-lg cursor-pointer border ${
                      mainImage === img.url ? "border-black" : "border-gray-300"
                    }`}
                  />
                ))}
              </div>

              <div className="flex-1">
                {/* Main Image */}
                <img
                  src={mainImage}
                  alt="Main product"
                  className="w-full rounded-lg"
                />

                {/* Mobile Thumbnails */}
                <div className="md:hidden flex gap-4 mt-4 overflow-x-auto">
                  {(selectedProduct?.images || []).map((img, i) => (
                    <img
                      key={i}
                      src={img.url}
                      alt={img.altText}
                      onClick={() => setMainImage(img.url)}
                      className={`w-20 h-20 rounded-lg border ${
                        mainImage === img.url
                          ? "border-black"
                          : "border-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="md:w-1/2">
              <h1 className="text-3xl font-semibold">{selectedProduct.name}</h1>

              <p className="line-through text-gray-500">
                {selectedProduct.orignalPrice}
              </p>
              <p className="text-2xl mb-4">${selectedProduct.price}</p>

              <p className="text-gray-600 mb-6">
                {selectedProduct.description}
              </p>

              {/* COLOR */}
              <div className="mb-4">
                <p className="text-gray-700">Color:</p>
                <div className="flex gap-3 mt-2">
                  {(selectedProduct?.colors || []).map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor === color
                          ? "border-black"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                    />
                  ))}
                </div>
              </div>

              {/* SIZE */}
              <div className="mb-4">
                <p className="text-gray-700">Size:</p>
                <div className="flex gap-2 mt-2">
                  {(selectedProduct?.sizes || []).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded ${
                        selectedSize === size
                          ? "bg-black text-white"
                          : "border-gray-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* QUANTITY */}
              <div className="mb-6">
                <p className="text-gray-700">Quantity:</p>
                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={() => handleQuantityChange("minus")}
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    −
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange("plus")}
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* ADD TO CART BUTTON */}
              <button
                onClick={handleAddToCart}
                disabled={isButtonDisabled}
                className={`w-full py-3 rounded transition ${
                  isButtonDisabled
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-900"
                }`}
              >
                {buttonText}
              </button>

              {/* CHARACTERISTICS */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-2">Characteristics</h3>
                <p>Brand: {selectedProduct.brand}</p>
                <p>Material: {selectedProduct.material}</p>
              </div>
            </div>
          </div>

          <div className="mt-20">
            <h2 className="text-2xl text-center font-medium mb-4">
              You May Also Like
            </h2>
            <ProductGrid
              products={similarProducts}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
