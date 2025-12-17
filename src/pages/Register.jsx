import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import registerphoto from "../assets/register.webp";
import { registerUser } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();
  const { user, guestId, loading } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => {
    return state.cart;
  });

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser({ name, email, password }));
  };

  useEffect(() => {
    if (!user) return;

    // If guest cart exists → merge
    if (cart?.products?.length > 0 && guestId) {
      dispatch(
        meargeCart({
          guestId,
          userId: user._id,
        })
      ).then(() => {
        navigate(isCheckoutRedirect ? "/checkout" : "/");
      });
    } else {
      // No guest cart → just redirect
      navigate(isCheckoutRedirect ? "/checkout" : "/");
    }
  }, [user, cart, guestId, dispatch, navigate, isCheckoutRedirect]);

  return (
    <div className="flex">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm"
        >
          <div className="flex justify-center mb-6">
            <h2 className="text-xl font-medium">Shopping</h2>
          </div>
          <h2 className="text-xl font-bold text-center mb-6">Hey there! 👋</h2>
          <p className="text-center mb-6">
            Enter your username and password to Login
          </p>
          <div className="mb-4">
            <lable className="block text-sm font-semibold mb-2">Name</lable>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your Name.."
            />
          </div>

          <div className="mb-4">
            <lable className="block text-sm font-semibold mb-2">Email</lable>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your Email.."
            />
          </div>
          <div className="mb-4">
            <lable className="block text-sm font-semibold mb-2">Password</lable>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your Password.."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            {loading ? "loading.." : "Sign Up"}
          </button>
          <p className="mt-6 text-center text-sm">
            Do have an account?{" "}
            <Link
              to={`/login?redirect=${encodeURIComponent(redirect)}`}
              className="text-blue-500"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-full flex flex-col justify-center items-center">
          <img
            src={registerphoto}
            alt="login"
            className="h-[750px] w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
