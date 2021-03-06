import { ReactNode } from "react";

export interface PostTitleProps {
  children: ReactNode;
}

export default function PostTitle({ children }: PostTitleProps) {
  return (
    <h1 className="text-6xl font-bold tracking-tighter leading-tight md:leading-none mb-12 text-center">
      {children}
    </h1>
  );
}
