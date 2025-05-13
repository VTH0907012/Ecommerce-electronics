import AdminLayout from "../components/admin/Layout/AdminLayout";
import { ReduxProvider } from "../providers/ReduxProvider";
import { Toaster } from "react-hot-toast";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <AdminLayout>{children}</AdminLayout>
      <Toaster />
    </ReduxProvider>
  );
}
