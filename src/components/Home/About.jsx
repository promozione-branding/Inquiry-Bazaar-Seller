"use client";
import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="w-full py-10 bg-gray-50">
      <div className="md:px-15 mx-auto px-4 grid md:grid-cols-2 gap-5 items-center">
        <div className="w-full flex justify-center bg-transparent">
          <Image
            src="/map.png"
            alt="Inquiry Bazaar"
            width={500}
            height={400}
            className="object-cover h-120"
          />
        </div>

        <div>
          <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
            India’s Smartest B2B Growth Platform
          </h2>

          <h3 className="text-2xl text-blue-600 font-semibold mb-6">
            Marketplace + Performance Marketing
          </h3>

          <p className="text-gray-800 mb-2 leading-relaxed text-lg">
            InquiryBazaar.com is not just another B2B platform — it’s a system built after deep market research and real industry understanding.
          </p>
          <p className="text-gray-800 mb-2 leading-relaxed text-lg">
            Humne is concept ko ground-level problems samajh kar design kiya hai, jahan suppliers ko sirf listing milti hai, lekin real inquiries nahi milti.
          </p>

          <p className="text-gray-800 mb-2 leading-relaxed text-lg">
            InquiryBazaar bridges this gap by combining marketplace + digital marketing, so your products are not just listed — they are actively promoted.
          </p>

          <p className="text-gray-800 mb-2 leading-relaxed text-lg">
            Jab koi buyer Google ya kisi platform par specific product search karta hai, we make sure aapki visibility top level par ho, so that you receive relevant and high-intent inquiries.
          </p>

          <p className="text-gray-800 leading-relaxed text-lg">
            Yahan random ya time-wasting leads nahi aati, sirf genuine buyers ki inquiries aati hain. Isse aapka time bhi bachta hai aur manpower ka unnecessary load bhi kam hota hai.
          </p>

        </div>
      </div>
    </section>
  );
}