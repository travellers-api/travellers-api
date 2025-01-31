import classNames from "classnames";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export function LabelText({ className, children }: Props) {
  return (
    <p className={classNames("border px-4 text-xs", className)}>{children}</p>
  );
}
