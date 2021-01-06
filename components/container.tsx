import type { ReactNode } from "react";

export interface ContainerProps {
  children: ReactNode;
}

export default function Container({ children }: ContainerProps) {
  return <div className="container mx-auto px-5">{children}</div>;
}
