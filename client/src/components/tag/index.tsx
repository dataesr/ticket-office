type TagProps = {
  children: React.ReactNode;
  size?: "sm" | "md";
  className?: string;
};

export function Tag({ children, size = "md", className }: TagProps) {
  const classes = ["fr-tag"];
  if (size === "sm") classes.push("fr-tag--sm");
  if (className) classes.push(className);
  return <p className={classes.join(" ")}>{children}</p>;
}

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

type SelectableTagProps = TagProps & {
  selected: boolean;
  onClick: () => void;
};

export function SelectableTag({
  children,
  size = "sm",
  className,
  selected,
  onClick,
}: SelectableTagProps) {
  const classes = ["fr-tag"];
  if (size === "sm") classes.push("fr-tag--sm");
  if (className) classes.push(className);

  return (
    <button
      type="button"
      className={classes.join(" ")}
      aria-pressed={selected}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
