export default function AuctionText({ title, description, breadcrumbText }) {
  return (
    <section className="bg-blue-100 pt-10 text-center text-blue-900">
      <div className="max-w-3xl mx-auto px-4">
        {/* Title */}
        <h1 className="text-6xl font-bold mb-2">{title}</h1>

        {/* Underline */}
        <div className="w-12 h-1 bg-blue-900 mx-auto mb-4 rounded" />

        {/* Description */}
        <p className="text-sm sm:text-base text-gray-700 mb-8">{description}</p>

        {/* Breadcrumb */}
        <div className="inline-flex items-center gap-2 bg-blue-200 text-blue-900 text-xs font-medium px-3 py-1 rounded">
          <span>Home</span>
          <span className="text-gray-600">›</span>
          <span>{breadcrumbText}</span>
        </div>
      </div>
    </section>
  );
}
