import { ReactNode } from "react";

export type RouterLinkProps = {
  href: string;
  replace?: boolean;
  target?: string;
  children?: ReactNode;
};
