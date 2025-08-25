// import type { Metadata } from "next";
// import "./globals.css";
// import { Inter } from 'next/font/google'
// const inter = Inter({ subsets: ['latin'] })
// export const metadata: Metadata = {
//   title: 'My E-Commerce Site',
//   description: 'Trang bán hàng chuyên nghiệp',
// };
// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en" className={inter.className}>
//       <body>
//         {children}</body>
//     </html>
//   );
// }
import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "A$hop",
  description: "Trang bán hàng chuyên nghiệp",
  icons: {
    icon: "/logo/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-background">
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
        >
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
