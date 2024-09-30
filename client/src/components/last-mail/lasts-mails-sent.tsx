import { useEffect, useRef, useState } from "react";
import { Text, Title, Link } from "@dataesr/dsfr-plus";
import { LatestMailsProps } from "../../types";
import { getContactUrl } from "./utils";

const LatestMails: React.FC<LatestMailsProps> = ({ data }) => {
  const scrollIndexRef = useRef(0);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [isMouseOver, setIsMouseOver] = useState(false);

  const mailData = data.data || [];

  if (!Array.isArray(mailData) || mailData.length === 0) {
    return <Text>Aucun email trouvé.</Text>;
  }

  const filteredMails = mailData
    .filter((mail) => mail?.threads?.[0]?.responses?.[0]?.responseMessage)
    .sort((a, b) => {
      const dateA = new Date(
        a?.threads?.[0]?.responses?.[0]?.timestamp || ""
      ).getTime();
      const dateB = new Date(
        b?.threads?.[0]?.responses?.[0]?.timestamp || ""
      ).getTime();
      return dateB - dateA;
    });
  useEffect(() => {
    let interval = null;

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
        overflow: "hidden",
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
              <strong>
                {mail.threads?.[0].responses?.[0]?.team?.join(", ") || "Équipe"}
              </strong>{" "}
              le{" "}
              <i>
                {new Date(
                  mail.threads?.[0]?.responses?.[0]?.timestamp || ""
                ).toLocaleDateString()}
              </i>{" "}
              à <strong>{mail.name}</strong>{" "}
              {mail.threads?.[0]?.responses?.[0]?.responseMessage && (
                <>
                  {(mail.threads[0].responses[0].responseMessage as string)
                    .length > 100
                    ? mail.threads[0].responses[0].responseMessage.substring(
                        0,
                        150
                      ) + "..."
                    : mail.threads[0].responses[0].responseMessage}{" "}
                  <Link
                    key={mail.id}
                    href={getContactUrl(mail.fromApplication, mail.id)}
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
