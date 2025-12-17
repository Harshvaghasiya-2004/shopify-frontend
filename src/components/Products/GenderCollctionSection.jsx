import React from "react";
import mansCollectionImage from "../../assets/mens-collection.webp";
import womansCollectionImage from "../../assets/womens-collection.webp";
import { Link } from "react-router-dom";

const GenderCollctionSection = () => {
  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="mx-auto container flex flex-col md:flex-row gap-8">
        <div className="flex-1 relative">
          <img
            src={womansCollectionImage}
            alt="Women collection"
            className="w-full h-[700px] object-cover"
          />
          <div className="absolute bottom-8 left-8 bg-white/90 p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Women's Collection
            </h2>
            <Link
              to="/collections/all?gender=Women"
              className="text-gray-900 underline"
            >
              Shop Now
            </Link>
          </div>
        </div>
        <div className="flex-1 relative">
          <img
            src={mansCollectionImage}
            alt="Men collection"
            className="w-full h-[700px] object-cover"
          />
          <div className="absolute bottom-8 left-8 bg-white/90 p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Men's Collection
            </h2>
            <Link
              to="/collections/all?gender=Men"
              className="text-gray-900 underline"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenderCollctionSection;
