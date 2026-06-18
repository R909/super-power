"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./sidebar";

const NO_SIDEBAR_ROUTES = ["/", "/login"];

export default function ConditionalSidebar() {
  const pathname = usePathname();
  if (NO_SIDEBAR_ROUTES.includes(pathname)) return null;
  return <Sidebar />;
}