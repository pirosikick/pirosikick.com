import Footer from "./footer";
import Meta from "./meta";

import type { ReactNode } from "react";

export interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Meta />
      <div className="min-h-screen">
        <main>{children}</main>
      </div>
      <Footer />
    </>
  );
}
