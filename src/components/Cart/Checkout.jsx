  import React, { useState, useEffect } from "react";
  import { useNavigate } from "react-router-dom";
  import PayPalButton from "./PayPalButton";
  import { useDispatch, useSelector } from "react-redux";
  import { createCheckout } from "../../redux/slices/checkoutSlice";

  const Checkout = () => {
    const navigate = useNavigate();
    const [checkoutId, setCheckoutId] = useState(null);
    const dispatch = useDispatch();
    const { cart, loading, error } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);

    const [shippingAddress, setShippingAddress] = useState({
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
      phone: "",
    });

    useEffect(() => {
      if (!cart || !cart.products || cart.products.length === 0) {
        navigate("/");
      }
    }),
      [cart, navigate];

    const handleChange = (e) => {
      setShippingAddress({
        ...shippingAddress,
        [e.target.name]: e.target.value,
      });
    };
    const handleCreateCheckout = async (e) => {
      e.preventDefault();
      if (cart && cart.products.length > 0) {
        const res = await dispatch(
          createCheckout({
            checkoutItems: cart.products,
            shippingAddress,
          paymentMethod: "paypal",
            totalPrice: cart.totalPrice,
          })
        );
        if (res.payload && res.payload._id) {
          setCheckoutId(res.payload._id);
        }
      }
    };
    const token = localStorage.getItem("userToken");
    const handlePaymentSuccess = async (details) => {
      try {
        // Example: send payment details to backend
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
          { paymentStatus: "paid", paymentDetails: details },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await handleFinalizeCheckout(checkoutId);
      } catch (error) {
        console.error("Payment processing failed:", error);
        // Optional: show error notification to user
        alert("Payment failed. Please try again.");
      }
    };

    const handleFinalizeCheckout = async (checkoutId) => {
      try {
        console.log(`🛒 Finalizing checkout for ID: ${checkoutId}...`);

        const token = localStorage.getItem("userToken"); // if logged in
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        navigate("/order-confirmation");

        if (!response.ok) {
          throw new Error(
            `Checkout finalization failed (status: ${response.status})`
          );
        }
      } catch (error) {
        console.error(
          "💥 Uh-oh! Something went wrong finalizing your checkout:",
          error
        );
        alert("Checkout failed! Please try again or contact support.");
      }
    };
    if (loading) {
      return <p>Loading...</p>;
    }
    if (error) {
      return <p>Error................{error}</p>;
    }
    if (!cart || !cart.products || cart.products.length === 0) {
      return <p>Your cart is Empty</p>;
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-2xl uppercase py-6">Checkout</h2>

          <form onSubmit={handleCreateCheckout}>
            <h3 className="text-lg mb-4">Contact Details</h3>

            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={user ? user.email : ""}
                className="w-full p-2 border rounded"
                disabled
              />
            </div>

            <h3 className="text-lg mb-4">Delivery</h3>

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={shippingAddress.firstName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={shippingAddress.lastName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={shippingAddress.address}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700">City</label>
                <input
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Country</label>
              <input
                type="text"
                name="country" // ✅ fixed
                value={shippingAddress.country}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Phone</label>
              <input
                type="text"
                name="phone" // ✅ fixed
                value={shippingAddress.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mt-6">
              {!checkoutId ? (
                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 rounded"
                >
                  Continue to Payment
                </button>
              ) : (
                <div>
                  <h3 className="text-lg mb-4">Pay with Paypal</h3>
                  <PayPalButton
                    amount={cart.totalPrice}
                    onSuccess={handlePaymentSuccess}
                    onError={(err) => {
                      alert("Payment failed. Try again.");
                    }}
                  />
                </div>
              )}
            </div>
          </form>
        </div>
        {/* Right side */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg mb-4">Order Summary</h3>
          <div className="border-t border-gray-300 py-4 mb-4">
            {cart.products.map((product, index) => (
              <div
                key={index}
                className="flex items-start py-2 justify-between border-b border-gray-300"
              >
                <div className="flex items-start">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-24 object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-md">{product.name}</h3>
                    <p className="text-gray-500">Size: {product.size}</p>
                    <p className="text-gray-500">Color: {product.color}</p>
                  </div>
                </div>
                <p className="text-xl">₹{product.price?.toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-lg mb-4">
            <span>Subtotal </span>
            <span>₹{cart.totalPrice?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-lg">
            <p>Shipping</p>
            <p>Free</p>
          </div>
          <div className="flex justify-between items-center text-lg mt-4 border-t border-gray-300 pt-4">
            <p>Total</p>
            <p>₹{cart.totalPrice?.toLocaleString()}</p>
          </div>
        </div>
      </div>
    );
  };

  export default Checkout;
