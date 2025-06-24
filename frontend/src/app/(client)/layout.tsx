import Navbar from "../components/client/Nav/Navbar";
import Footer from "../components/client/Footer/Footer";
import { Toaster } from "react-hot-toast";
import { ReduxProvider } from "../providers/ReduxProvider";
import CartSidebar from "../components/client/Cart/CartSidebar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <Navbar />
      <Toaster />
      {children}
      <CartSidebar />
      <Footer />
    </ReduxProvider>
  );
}

// "use client";
// import { useEffect, useState } from "react";
// import Navbar from "../components/client/Nav/Navbar";
// import Footer from "../components/client/Footer/Footer";
// import { Toaster } from "react-hot-toast";
// import { ReduxProvider } from "../providers/ReduxProvider";
// import CartSidebar from "../components/client/Cart/CartSidebar";
// import LoadingScreen from "../components/client/Common/LoadingScreen";

// export default function Layout({ children }: { children: React.ReactNode }) {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => setLoading(false), 1000); // Delay để transition đẹp hơn
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <div>
//       <div
//         className={`fixed inset-0 z-50 transition-opacity duration-500 ${
//           loading ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
//         }`}
//       >
//         <LoadingScreen />
//       </div>

//       <div
//         className={`transition-opacity duration-500 ${
//           loading ? "opacity-0" : "opacity-100"
//         }`}
//       >
//      <ReduxProvider>
//        <Navbar />
//        <Toaster />
//        {children}
//        <CartSidebar />
//        <Footer />
//      </ReduxProvider>
//       </div>
//     </div>
//   );
// }
