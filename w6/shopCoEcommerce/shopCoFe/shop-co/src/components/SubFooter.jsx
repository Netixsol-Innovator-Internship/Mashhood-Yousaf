// components/SubFooter.js
import Image from "next/image";

export default function SubFooter() {
  return (
    <div className="max-w-6xl mx-auto bg-[#F0F0F0] border-t border-gray-300 mt-4">
      <div className=" mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Left Text */}
        <p className="text-sm text-gray-600 text-center sm:text-left">
          Shop.co © 2000–2023, All Rights Reserved
        </p>

        {/* Payment Icons */}
        <div className="flex gap-3 items-center justify-center flex-wrap">
          <Image src="/visa.png" alt="Visa" width={50} height={24} />
          <Image
            src="/masterCard.png"
            alt="Mastercard"
            width={50}
            height={24}
          />
          <Image
            src="/paypal.png"
            alt="PayPal"
            width={50}
            height={24}
          />
          <Image
            src="/applePay.png"
            alt="Apple Pay"
            width={50}
            height={24}
          />
          <Image
            src="/gPay.png"
            alt="Google Pay"
            width={50}
            height={24}
          />
        </div>
      </div>
    </div>
  );
}
