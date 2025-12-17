import { IoLogoInstagram } from "react-icons/io5";
import { RiTwitterXLine } from "react-icons/ri";
import { TbBrandMeta } from "react-icons/tb";
import { Link } from "react-router-dom";
import { FiPhoneCall } from "react-icons/fi";
import React, { useState } from "react";
import axios from "axios";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Email is required");
      setTimeout(() => setMessage(""), 2000); // hide after 2 sec
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:9000/api/subscribe", {
        email,
      });
      setMessage(response.data.message);
      setEmail("");
      setTimeout(() => setMessage(""), 2000); // hide after 2 sec
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Something went wrong. Try again later."
      );
      setTimeout(() => setMessage(""), 2000); // hide after 2 sec
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="border-t border-gray-200 py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0">
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Newslatter</h3>
          <p className="text-gray-500 mb-4">
            Be the first to hear about new products, exclusive events, and
            online offer.
          </p>
          <p className="font-bold text-sm  text-gray-600 mb-6 ">
            Sign up and get 10% off your first order.
          </p>
          {/* newslatter form */}
          <form className="flex" onSubmit={handleSubscribe}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email..."
              className="p-3 w-full text-sm border-t border-l border-b border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
            />
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 text-sm rounded-r-md hover:bg-gray-800 transition-all"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Subscribe"}
            </button>
          </form>
          {message && <p className="text-gray-500 text-sm mt-2">{message}</p>}
        </div>
        {/* shop links */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Shop</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                Men's Top were
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                women's Top were
              </Link>
            </li>{" "}
            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                Men's Bottom were
              </Link>
            </li>{" "}
            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                women's Bottom were
              </Link>
            </li>
          </ul>
        </div>
        {/* Support Links */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Support</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                About Us
              </Link>
            </li>{" "}
            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                FAQ's
              </Link>
            </li>{" "}
            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                features
              </Link>
            </li>
          </ul>
        </div>
        {/* followus section */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Follow us</h3>
          <div className="flex items-center space-x-4 mb-6">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className=" hover:text-gray-500 "
            >
              <TbBrandMeta className="h-5 w-5" />
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className=" hover:text-gray-500 "
            >
              <IoLogoInstagram className="h-5 w-5" />
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className=" hover:text-gray-500 "
            >
              <RiTwitterXLine className="h-4 w-4" />
            </a>
          </div>
          <p className="text-gray-500">Call us</p>
          <p>
            <FiPhoneCall className="inline-block mr-2 " /> +1 (234) 567-890
          </p>
        </div>
      </div>
      {/* footer bottom */}
      <div className="container mx-auto mt-12 px-4 lg:px-0 border-t  border-gray-200 pt-6">
        <p className="text-gray-500 text-sm tracking-tighter text-center">
          © 2025,CompileTab. All Right Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
