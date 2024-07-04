import { useEffect, useRef, useState } from "react";
import { Text, Title, Link } from "@dataesr/dsfr-plus";

interface MailData {
  _id: string;
  mailSent?: string;
  mailSentDate?: string;
  responseFrom?: string;
  name?: string;
  refetch?: () => void;
}

interface LatestMailsProps {
  data: { data: MailData[] };
  refetch?: () => void;
}
const LatestMails: React.FC<LatestMailsProps> = ({ data }) => {
  const scrollIndexRef = useRef(0);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [isMouseOver, setIsMouseOver] = useState(false);

  const filteredMails = data.data.filter((mail) => mail.mailSent);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const startScrolling = () => {
      if (!isMouseOver && filteredMails.length > 1) {
        interval = setInterval(() => {
          scrollIndexRef.current =
            (scrollIndexRef.current + 1) % filteredMails.length;
          setScrollIndex(scrollIndexRef.current);
        }, 8000);
      }
    };

    const stopScrolling = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    startScrolling();

    return () => {
      stopScrolling();
    };
  }, [filteredMails, isMouseOver]);

  const handleMouseEnter = () => {
    setIsMouseOver(true);
  };

  const handleMouseLeave = () => {
    setIsMouseOver(false);
  };

  if (filteredMails.length === 0) {
    return <Text>Aucun email trouvé.</Text>;
  }

  return (
    <div
      style={{
        padding: "15px",
        backgroundColor: "#dde5ff",
        whiteSpace: "nowrap",
        position: "relative",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Title as="h2" look="h6" style={{ marginBottom: "5px" }}>
        Derniers mails envoyés
      </Title>
      <div
        style={{
          display: "flex",
          transition: "transform 1s ease",
          transform: `translateX(-${scrollIndex * 100}%)`,
        }}
      >
        {filteredMails.map((mail, index) => (
          <div
            key={index}
            style={{
              minWidth: "100%",
              padding: "0 10px",
              boxSizing: "border-box",
            }}
          >
            <Text size="xs">
              <strong>{mail.responseFrom}</strong> le{" "}
              <i>{new Date(mail.mailSentDate || "").toLocaleDateString()}</i> à{" "}
              <strong>{mail.name}</strong>{" "}
              {mail.mailSent && (
                <>
                  {mail.mailSent.length > 100
                    ? mail.mailSent.substring(0, 150) + "..."
                    : mail.mailSent}{" "}
                  <Link
                    key={mail._id}
                    href={`/contact?query=${mail._id}`}
                    style={{
                      textDecoration: "underline",
                      marginRight: "10px",
                    }}
                  >
                    Voir
                  </Link>
                </>
              )}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestMails;
