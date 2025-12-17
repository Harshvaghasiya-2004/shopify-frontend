import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const FilterSidebar = () => {
  const [searchParmas, setSearchParmas] = useSearchParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    color: "",
    size: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 100,
  });
  const [priceRange, setPriceRange] = useState([0, 100]);
  const categories = ["Top Wear", "Bottom Wear"];
  const colors = [
    "Red",
    "Blue",
    "Black",
    "Green",
    "Yellow",
    "Gray",
    "White",
    "pink",
    "Beige",
    "Navy",
  ];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const materials = [
    "Cotton",
    "Wool",
    "Denim",
    "Polyester",
    "Silk",
    "Linen",
    "Viscose",
    "Fleece",
  ];

  const Brands = [
    "Urban Threads",
    "Mordern Fit",
    "Street Style",
    "Beach Breeze",
    "Fashioista",
    "ChicStyle",
  ];

  const genders = ["Men", "Women"];

  useEffect(() => {
    const params = Object.fromEntries([...searchParmas]); // correctly named
    setFilters({
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      size: params.size ? params.size.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: params.minPrice || 0,
      maxPrice: params.maxPrice || 100,
    });
    setPriceRange([0, params.maxPrice || 100]);
  }, [searchParmas]);

  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    let newFilters = { ...filters };

    if (type === "checkbox") {
      if (checked) {
        newFilters[name] = [...(newFilters[name] || []), value];
      } else {
        newFilters[name] = newFilters[name].filter((v) => v !== value);
      }
    } else if (type === "radio") {
      newFilters[name] = value;
    } else if (type === "range") {
      newFilters.maxPrice = Number(value);
    } else {
      // fallback for buttons or other inputs
      newFilters[name] = value;
    }

    console.log(newFilters);
    setFilters(newFilters);
    updateURLParmas(newFilters);
  };

  const updateURLParmas = (newFilters) => {
    const parmas = new URLSearchParams();
    Object.keys(newFilters).forEach((key) => {
      if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
        parmas.append(key, newFilters[key].join(","));
      } else if (newFilters[key]) {
        parmas.append(key, newFilters[key]);
      }
    });
    setSearchParmas(parmas);
    navigate(`?${parmas.toString()}`);
  };

  const handlePriceChange = (e) => {
    const newPrice = e.target.value;
    setPriceRange([0, newPrice]);
    const newFilters = { ...filters, minPrice: 0, maxPrice: newPrice };
    setFilters(filters);
    updateURLParmas(newFilters);
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-medium text-gray-800 mb-4"></h3>
      {/* category filter */}
      <div className="mb-6">
        <label className="text-gray-600 block font-medium mb-2">Category</label>
        {categories.map((category) => (
          <div className="flex items-center mb-1" key={category}>
            <input
              type="radio"
              name="category"
              value={category}
              onChange={handleFilterChange}
              checked={filters.category === category} // ✅ selected if matches
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{category}</span>
          </div>
        ))}
      </div>

      {/* Gender filter */}
      <div className="mb-6">
        <label className="text-gray-600 block font-medium mb-2">Gender</label>
        {genders.map((gender) => (
          <div className="flex items-center mb-1" key={gender}>
            <input
              type="radio"
              name="gender"
              value={gender}
              onChange={handleFilterChange}
              checked={filters.gender === gender} // ✅ selected if matches
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{gender}</span>
          </div>
        ))}
      </div>

      {/* Color filter */}
      <div className="mb-6">
        <label className="text-gray-600 block font-medium mb-2">Color</label>

        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              name="color"
              value={color}
              onClick={handleFilterChange}
              className={`w-8 h-8 rounded-full border cursor-pointer transition hover:scale-110 
  ${filters.color === color ? "ring-2 ring-blue-500" : ""}`}
              style={{ backgroundColor: color.toLowerCase() }}
            />
          ))}
        </div>
      </div>

      {/* Size filter */}
      <div className="mb-6">
        <label className="text-gray-600 block font-medium mb-2">Size</label>

        {sizes.map((size) => (
          <div key={size} className="flex items-center mb-1">
            <input
              type="checkbox"
              name="size"
              value={size}
              onChange={handleFilterChange}
              checked={filters.size.includes(size)} // ✅ checked if selected
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{size}</span>
          </div>
        ))}
      </div>

      {/* Material filter */}
      <div className="mb-6">
        <label className="text-gray-600 block font-medium mb-2">Material</label>

        {materials.map((material) => (
          <div key={material} className="flex items-center mb-1">
            <input
              type="checkbox"
              name="material"
              value={material}
              onChange={handleFilterChange}
              checked={filters.material.includes(material)} // ✅ checked if selected
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{material}</span>
          </div>
        ))}
      </div>

      {/* Brand filter */}
      <div className="mb-6">
        <label className="text-gray-600 block font-medium mb-2">Brand</label>

        {Brands.map((brand) => (
          <div key={brand} className="flex items-center mb-1">
            <input
              type="checkbox"
              name="brand"
              value={brand}
              onChange={handleFilterChange}
              checked={filters.brand.includes(brand)} // ✅ checked if selected
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{brand}</span>
          </div>
        ))}
      </div>

      {/* Price filter */}
      <div className="mb-6">
        <label className="text-gray-600 block font-medium mb-2">
          Price Range
        </label>

        <input
          type="range"
          name="Price Range"
          min={0}
          max={100}
          value={priceRange[1]}
          onChange={handlePriceChange}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />

        <div className="flex justify-between text-gray-600 mt-2">
          <span>$0</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
