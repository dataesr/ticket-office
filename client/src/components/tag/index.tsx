type TagProps = {
  children: React.ReactNode;
  size?: "sm" | "md";
  className?: string;
};

type DismissibleTagProps = TagProps & {
  onClick: () => void;
};

export function DismissibleTag({
  children,
  size = "sm",
  className,
  onClick,
}: DismissibleTagProps) {
  const classes = ["fr-tag", "fr-tag--dismiss"];
  if (size === "sm") classes.push("fr-tag--sm");
  if (className) classes.push(className);

  return (
    <button
      type="button"
      className={classes.join(" ")}
      aria-label={`Retirer le tag ${typeof children === "string" ? children : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
