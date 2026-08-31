type BadgeProps = {
  children: React.ReactNode;
  color?: string;
  icon?: string;
  size?: "sm" | "md";
  className?: string;
};

export default function Badge({
  children,
  color,
  icon,
  size = "sm",
  className,
}: BadgeProps) {
  const classes = ["fr-badge"];
  if (size === "sm") classes.push("fr-badge--sm");
  if (color) classes.push(`fr-badge--${color}`);
  if (icon) classes.push(`fr-icon-${icon}`, "fr-badge--icon-left");
  if (className) classes.push(className);

  return <p className={classes.join(" ")}>{children}</p>;
}
