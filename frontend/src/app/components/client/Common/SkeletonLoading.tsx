import React from "react";

export const CategorySkeleton = () => (
  <div className="flex flex-col items-center space-y-2">
    <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse"></div>
    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
  </div>
);

export const ProductSkeleton = () => (
  <div className="border border-gray-200  rounded-lg overflow-hidden">
    <div className="bg-gray-200 h-48 animate-pulse"></div>
    <div className="p-4 space-y-2">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
    </div>
  </div>
);
export const LoadingSkeleton = () => (
  <div className="w-full h-64 bg-gray-100 animate-pulse rounded-lg"></div>
);
export const ProfileSkeleton = () => {
  return (
    <section className="py-8 bg-gray-50 min-h-screen animate-pulse">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4">
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-sm">
          <div className="h-7 w-3/4 bg-gray-200 rounded mb-6"></div>
          
          <nav className="space-y-2">
            <div className="w-full h-10 bg-gray-100 rounded"></div>
            <div className="w-full h-10 bg-gray-100 rounded"></div>
            <div className="w-full h-10 bg-gray-100 rounded"></div>
          </nav>
        </div>

        <div className="md:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="h-7 w-1/3 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="h-4 w-1/4 bg-gray-200 rounded mb-2"></div>
                <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-4 w-1/4 bg-gray-200 rounded mb-2"></div>
                <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
              </div>
            </div>

            <div className="h-7 w-1/3 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="h-4 w-48 bg-gray-200 rounded"></div>
                      <div className="h-3 w-32 bg-gray-200 rounded"></div>
                      <div className="h-3 w-24 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-8 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden bg-white p-6 rounded-lg shadow-sm">
            <div className="h-7 w-1/4 bg-gray-200 rounded mb-4"></div>
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    {[...Array(5)].map((_, i) => (
                      <th key={i} className="py-3 px-4 text-left">
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(3)].map((_, i) => (
                    <tr key={i} className="border-b">
                      {[...Array(5)].map((_, j) => (
                        <td key={j} className="py-3 px-4">
                          <div className="h-4 w-20 bg-gray-200 rounded"></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="hidden bg-white p-6 rounded-lg shadow-sm">
            <div className="h-7 w-1/3 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-6">
              <div>
                <div className="h-4 w-1/4 bg-gray-200 rounded mb-1"></div>
                <div className="h-10 w-full bg-gray-100 rounded-lg"></div>
              </div>
              <div>
                <div className="h-4 w-1/4 bg-gray-200 rounded mb-1"></div>
                <div className="h-10 w-full bg-gray-100 rounded-lg"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="h-10 w-32 bg-blue-200 rounded"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
