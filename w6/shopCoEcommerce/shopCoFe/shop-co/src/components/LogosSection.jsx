import Image from "next/image";

export default function LogosSection() {
  return (
    <section className="bg-black py-10">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-14">
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-6">
          {/* Brand Logos */}
          {[
            { src: "/ck.png", alt: "Calvin Klein" },
            { src: "/gucci.png", alt: "Gucci" },
            { src: "/zara.png", alt: "Zara" },
            { src: "/prada.svg", alt: "Prada" },
            { src: "/vs.svg", alt: "Victoria’s Secret" },
          ].map((logo, idx) => (
            <div key={idx} className="w-24 sm:w-28 md:w-32 lg:w-36 xl:w-40">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={160}
                height={50}
                className="w-full h-auto object-contain grayscale hover:grayscale-0 transition"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
