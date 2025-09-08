// components/Footer.js
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaPinterest,
} from "react-icons/fa";
import SubFooter from "./SubFooter";

export default function Footer() {
  return (
    <footer className="bg-[#F0F0F0] text-black">
      {/* Newsletter Section */}
      <div className="bg-black text-white rounded-xl max-w-6xl mx-12   px-6 py-10 mt-16">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8">
          {/* Left Text */}
          <h2 className="text-xl sm:text-2xl  md:text-4xl font-extrabold text-center lg:text-left">
            STAY UPTO DATE ABOUT <br className="hidden md:block" /> OUR LATEST
            OFFERS
          </h2>

          {/* Right Inputs */}
          <div className="w-full max-w-lg flex flex-col  items-center gap-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 bg-white px-4 py-3 rounded-full text-black focus:outline-none text-sm sm:w-sm"
            />
            <button className="bg-white text-black px-6 py-3 rounded-full font-semibold text-sm hover:bg-gray-200 transition w-full sm:w-sm">
              Subscribe to Newsletter
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Section */}
      <div className="max-w-7xl mx-auto px-16 py-16 grid grid-cols-1 md:grid-cols-5 gap-12 text-sm">
        {/* Left Block - Brand */}
        <div className="md:col-span-1 space-y-4">
          <h3 className="font-bold text-xl">SHOP.CO</h3>
          <p className="text-gray-600">
            We have clothes that suits your style and which you're proud to
            wear. From women to men.
          </p>
          <div className="flex gap-4 pt-2 text-gray-600">
            <FaTwitter className="hover:text-black cursor-pointer" />
            <FaFacebookF className="hover:text-black cursor-pointer" />
            <FaInstagram className="hover:text-black cursor-pointer" />
            <FaPinterest className="hover:text-black cursor-pointer" />
          </div>
        </div>

        {/* Columns */}
        <div>
          <h4 className="font-bold mb-4 uppercase text-xs">Company</h4>
          <ul className="space-y-2 text-gray-600">
            <li>
              <a href="#">About</a>
            </li>
            <li>
              <a href="#">Features</a>
            </li>
            <li>
              <a href="#">Works</a>
            </li>
            <li>
              <a href="#">Career</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 uppercase text-xs">Help</h4>
          <ul className="space-y-2 text-gray-600">
            <li>
              <a href="#">Customer Support</a>
            </li>
            <li>
              <a href="#">Delivery Details</a>
            </li>
            <li>
              <a href="#">Terms & Conditions</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 uppercase text-xs">FAQ</h4>
          <ul className="space-y-2 text-gray-600">
            <li>
              <a href="#">Account</a>
            </li>
            <li>
              <a href="#">Manage Deliveries</a>
            </li>
            <li>
              <a href="#">Orders</a>
            </li>
            <li>
              <a href="#">Payments</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 uppercase text-xs">Resources</h4>
          <ul className="space-y-2 text-gray-600">
            <li>
              <a href="#">Free eBooks</a>
            </li>
            <li>
              <a href="#">Development Tutorial</a>
            </li>
            <li>
              <a href="#">How to - Blog</a>
            </li>
            <li>
              <a href="#">Youtube Playlist</a>
            </li>
          </ul>
        </div>
      </div>
      <SubFooter />
    </footer>
  );
}
