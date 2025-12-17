import React, { useEffect, useState } from "react";
import Hero from "../components/Layout/Hero";
import GenderCollctionSection from "../components/Products/GenderCollctionSection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductDetails from "../components/Products/ProductDetails";
import ProductGrid from "../components/Products/ProductGrid";
import FeaturedCollection from "../components/Products/FeaturedCollection";
import FeatureSection from "../components/Products/FeatureSection";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productsSlice";
import axios from "axios";

const Home = () => {
  const dispatch = useDispatch();

  const { loading, products, error } = useSelector((state) => state.products);

  const [bestSellerProduct, setBestSellerProduct] = useState(null);

  useEffect(() => {
    // fetch products for a specific collection
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category: "Bottom Wear",
        limit: 8,
      })
    );
    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
        );
        setBestSellerProduct(response.data);
      } catch (error) {
        console.error(
          "Fetch Best Seller Error:",
          error.response?.data?.message || error.message
        );
        throw error;
      }
    };
    fetchBestSeller();
  }, [dispatch]);
  return (
    <div>
      <Hero />
      <GenderCollctionSection />
      <NewArrivals />

      {/* Best Seller */}
      <h2 className="text-3xl text-center font-bold mb-4">Best Seller</h2>

      {bestSellerProduct ? (
        <ProductDetails productId={bestSellerProduct._id} />
      ) : (
        <p className="text-center">Loading best seller product...</p>
      )}

      <div className="mx-auto container">
        <h2 className="text-3xl text-center font-bold mb-4">
          Top Were for Women
        </h2>
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
      <FeaturedCollection />
      <FeatureSection />
    </div>
  );
};

export default Home;
