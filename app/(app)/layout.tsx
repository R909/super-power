import { Suspense } from "react";
import Sidebar from "@/app/components/sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Suspense fallback={null}>
        <Sidebar />
      </Suspense>
      {children}
    </div>
  );
}
