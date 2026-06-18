import { Suspense } from "react";
import ScrollReveal from "@/app/components/ScrollReveal";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <ScrollReveal />
      </Suspense>
      {children}
    </>
  );
}
