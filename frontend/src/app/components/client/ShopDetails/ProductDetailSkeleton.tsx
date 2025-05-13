const ProductDetailSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
      <div className="w-full md:w-1/2">
        <div className="aspect-square w-full rounded-xl bg-gray-200 animate-pulse mb-4"></div>
        <div className="grid grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-md bg-gray-200 animate-pulse"
            ></div>
          ))}
        </div>
      </div>

      <div className="w-full md:w-1/2 space-y-6">
        <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
        <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-32 w-full bg-gray-200 animate-pulse rounded"></div>
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 flex-1 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
    </div>
  );
}
export default ProductDetailSkeleton;
