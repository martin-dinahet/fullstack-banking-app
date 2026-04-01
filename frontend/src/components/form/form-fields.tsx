import type { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const FormFields: FC<Props> = ({ children }) => (
  <div className="flex flex-col gap-4">{children}</div>
);
