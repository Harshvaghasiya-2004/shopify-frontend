import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const OrderConfirmationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checkout } = useSelector((state) => {
    state.checkout;
  });
  const calculateEstimateDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10);
    return orderDate.toLocaleDateString();
  };

  useEffect(() => {
    if (checkout && checkout._id) {
      dispatch(clearCart());
      localStorage.removeItem("cart");
    } else {
      navigate("/my-orders");
    }
  }, [checkout, dispatch, navigate]);

  return (
    <div className="max-w-4xl mx-auto  bg-white p-6">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        Thank You for your Order!
      </h1>

      {checkout && (
        <div className="p-6 rounded-lg border border-gray-300">
          {/* Order Info */}
          <div className="flex justify-between mb-8">
            <div>
              <h2 className="text-xl font-semibold">
                Order ID: {checkout._id}
              </h2>
              <p className="text-gray-500">
                Order Date: {new Date(checkout.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-emerald-700 text-sm">
                Estimated Delivery:{" "}
                {calculateEstimateDelivery(checkout.createdAt)}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-8">
            {checkout.checkoutItems.map((item) => (
              <div key={item.productId} className="flex items-center mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
                <div>
                  <h4 className="text-md font-semibold">{item.name}</h4>
                  <p className="text-sm text-gray-500">
                    {item.color} | {item.size}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-md">₹{item.price}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Payment and Delivery Info */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-2">Payment</h4>
              <p className="text-gray-600">PayPal</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Delivery</h4>
              <p className="text-gray-600">
                {checkout.shippingAddress.address}
              </p>
              <p className="text-gray-600">
                {checkout.shippingAddress.city},{" "}
                {checkout.shippingAddress.country}
              </p>
              <p className="text-gray-600">
                Phone: {checkout.shippingAddress.phone}
              </p>
            </div>
          </div>

          {/* Total */}
          {/* <div className="flex justify-between mt-6 font-bold text-lg border-t pt-4">
            <span>Total</span>
            <span>₹{checkout.totalPrice}</span>
          </div> */}

          {/* Success Message */}
          {/* <div className="mt-6 text-center">
            <p className="text-green-600 font-semibold">
              Thank you! Your order has been placed successfully.
            </p>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default OrderConfirmationPage;
