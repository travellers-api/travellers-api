import classNames from "classnames";

export type LabelTextProps = {
  className?: string;
  children?: React.ReactNode;
};

export const LabelText: React.FC<LabelTextProps> = ({
  className,
  children,
}) => {
  return (
    <p className={classNames("border px-4 text-xs", className)}>{children}</p>
  );
};
