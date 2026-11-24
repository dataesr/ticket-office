type PageBannerProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
};

export default function PageBanner({
  title,
  description,
  children,
}: PageBannerProps) {
  return (
    <section className="fr-background-alt--blue-france">
      <div className="fr-container fr-py-8w">
        <h1 className="fr-mb-1w">{title}</h1>
        <p className={`fr-text--sm ${children ? "fr-mb-3w" : "fr-mb-0"}`}>
          {description}
        </p>
        {children}
      </div>
    </section>
  );
}
