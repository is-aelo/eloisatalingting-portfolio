import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ToastProvider } from "@/components/ui/Toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="flex min-h-dvh">
        <AdminSidebar />
        <main className="flex-1 bg-background p-8">{children}</main>
      </div>
    </ToastProvider>
  );
}
