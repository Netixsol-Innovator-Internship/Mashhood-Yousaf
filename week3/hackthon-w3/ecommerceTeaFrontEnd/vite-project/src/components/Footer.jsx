import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* COLLECTIONS */}
        <div>
          <h3 className="text-lg font-semibold mb-4">COLLECTIONS</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-amber-700 transition">
                Black teas
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-700 transition">
                Green teas
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-700 transition">
                White teas
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-700 transition">
                Herbal teas
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-700 transition">
                Matcha
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-700 transition">
                Chai
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-700 transition">
                Oolong
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-700 transition">
                Rooibos
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-700 transition">
                Teaware
              </a>
            </li>
          </ul>
        </div>

        {/* LEARN */}
        <div>
          <h3 className="text-lg font-semibold mb-4">LEARN</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-amber-700 transition">
                About us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-700 transition">
                About our teas
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-700 transition">
                Tea academy
              </a>
            </li>
          </ul>
        </div>

        {/* CUSTOMER SERVICE */}
        <div>
          <h3 className="text-lg font-semibold mb-4">CUSTOMER SERVICE</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-amber-700 transition">
                Ordering and payment
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-700 transition">
                Delivery
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-700 transition">
                Privacy and policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-700 transition">
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        {/* CONTACT US */}
        <div>
          <h3 className="text-lg font-semibold mb-4">CONTACT US</h3>
          <ul className="space-y-4 text-sm">
            {/* Address */}
            <li className="flex items-start gap-3">
              <img
                src="/images/location_on.png"
                alt="Location Icon"
                className="w-5 h-5 mt-1"
              />
              <span>
                3 Falahi, Falahi St, Pasdaran Ave, Shiraz, Fars Province
                <br />
                Iran
              </span>
            </li>

            {/* Email */}
            <li className="flex items-center gap-3">
              <img
                src="/images/mail.png"
                alt="Email Icon"
                className="w-5 h-5"
              />
              <a
                href="mailto:amoopur@gmail.com"
                className="hover:text-amber-700 transition"
              >
                amoopur@gmail.com
              </a>
            </li>

            {/* Phone */}
            <li className="flex items-center gap-3">
              <img
                src="/images/call.png"
                alt="Phone Icon"
                className="w-5 h-5"
              />
              <a
                href="tel:+989173038406"
                className="hover:text-amber-700 transition"
              >
                +98 9173038406
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
