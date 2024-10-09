<<<<<<< HEAD
<<<<<<< HEAD
import { Col, Text, Toggle } from "@dataesr/dsfr-plus";
import EmailSender from "../../api/send-mail";
import type { Contribution } from "../../types";
import { useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import "./styles.scss";
import { useState, useEffect } from "react";
const StaffActions = ({
  data,
  refetch,
  url,
}: {
  data: Contribution;
  refetch: () => void;
  url: string;
}) => {
  const location = useLocation();

  let baseUrl = "contacts";
  if (location?.pathname?.includes("scanr-contributionpage")) {
    baseUrl = "contribute";
  } else if (location?.pathname?.includes("removeuser")) {
    baseUrl = "remove-user";
  } else if (location?.pathname?.includes("namechange")) {
    baseUrl = "update-user-data";
  } else if (location?.pathname?.includes("apioperations")) {
    baseUrl = "production";
  }

=======
import { Col, Text } from "@dataesr/dsfr-plus";
=======
import { Col, Text, Toggle } from "@dataesr/dsfr-plus";
>>>>>>> ca679c1 (feat(imap-server): add imap server)
import EmailSender from "../../api/send-mail";
import type { Contribution } from "../../types";
import { useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import "./styles.scss";
import { useState, useEffect } from "react";
const StaffActions = ({
  data,
  refetch,
  url,
}: {
  data: Contribution;
  refetch: () => void;
  url: string;
}) => {
  const location = useLocation();
<<<<<<< HEAD
>>>>>>> 7e6255f (fix(naming): clean code)
=======

  let baseUrl = "contacts";
  if (location?.pathname?.includes("scanr-contributionpage")) {
    baseUrl = "contribute";
  } else if (location?.pathname?.includes("removeuser")) {
    baseUrl = "remove-user";
  } else if (location?.pathname?.includes("namechange")) {
    baseUrl = "update-user-data";
  } else if (location?.pathname?.includes("apioperations")) {
    baseUrl = "production";
  }

>>>>>>> ca679c1 (feat(imap-server): add imap server)
  const contributorClassName = location.pathname.includes("contributionpage")
    ? "staffSide"
    : "staffSideContact";

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> ca679c1 (feat(imap-server): add imap server)
  const displayedDates = new Set<string>();
  const queryClient = useQueryClient();

  const [isAllRead, setIsAllRead] = useState(() => {
    return (
      data?.threads.every((thread) =>
        thread.responses.every((response) => response.read)
      ) || false
    );
  });
  const mutation = useMutation(
    async (isRead: boolean) => {
      return fetch(`api/${baseUrl}/${data.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          threads: data.threads.map((thread) => ({
            ...thread,
            responses: thread.responses.map((response) => ({
              ...response,
              read: isRead,
            })),
          })),
        }),
      });
    },
    {
      onMutate: async (isRead: boolean) => {
        await queryClient.cancelQueries([url]);

        const previousData = queryClient.getQueryData<{ data: Contribution[] }>(
          [url]
        ) || { data: [] };

        if (Array.isArray(previousData.data)) {
          const updatedThreads = previousData.data.map((thread) => ({
            ...thread,
            responses: Array.isArray(thread.responses)
              ? thread.responses.map((response) => ({
                  ...response,
                  read: isRead,
                }))
              : [],
          }));

          queryClient.setQueryData([url], {
            ...previousData,
            data: updatedThreads,
          });
        } else {
          console.error("previousData.data n'est pas un tableau", previousData);
        }

        return { previousData };
      },

      onSuccess: () => {
        queryClient.invalidateQueries([url]);
        const updatedData = queryClient.getQueryData<{ data: Contribution[] }>([
          url,
        ]);

        if (updatedData?.data) {
          const allRead = updatedData.data.every((thread) =>
            thread.responses.every((response) => response.read)
          );
          setIsAllRead(allRead);
        }
      },
    }
  );

  const handleToggleChange = () => {
    const newState = !isAllRead;
    setIsAllRead(newState);
    mutation.mutate(newState);
  };

  useEffect(() => {
    const allRead =
      data?.threads.every((thread) =>
        thread.responses.every((response) => response.read)
      ) || false;
    setIsAllRead(allRead);
  }, [data]);

<<<<<<< HEAD
=======
>>>>>>> 7e6255f (fix(naming): clean code)
=======
>>>>>>> ca679c1 (feat(imap-server): add imap server)
  return (
    <>
      {data?.threads?.length > 0 && (
        <Col className={contributorClassName}>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
          {/* Afficher le toggle uniquement s'il y a plus de 2 objets dans threads */}
>>>>>>> dcbf3d6 (fix(mail): secure imap server, no request if no mail)
=======
>>>>>>> 5f63e6c (fix(staffactions): small fixes)
          {data.threads.length > 2 && (
            <Toggle
              label="Marquer toutes les réponses comme lues"
              checked={isAllRead}
              onChange={handleToggleChange}
            />
          )}
<<<<<<< HEAD

          {data.threads.map((thread, threadIndex) => {
            const teamResponses = thread.responses.filter(
              (response) => !response.team.includes("user")
            );

            return teamResponses.length > 0
              ? teamResponses.map((response, index) => {
                  const responseDate = new Date(
                    response.timestamp
                  ).toLocaleDateString();
                  const responseTime = new Date(
                    response.timestamp
                  ).toLocaleTimeString();

                  if (displayedDates.has(responseDate + responseTime)) {
                    return null;
                  }

                  displayedDates.add(responseDate + responseTime);

                  const responder = response.team.join(", ");

                  return (
                    <div key={`${threadIndex}-${index}`}>
                      <Text size="sm" className="staffSide">
                        {responder && (
                          <>
                            Réponse apportée par {responder} le {responseDate} à{" "}
                            {responseTime} :
                            <br />
                            {response.responseMessage}
                          </>
                        )}
                      </Text>
                    </div>
                  );
                })
              : null;
          })}
=======
          {data.threads.map((thread) =>
            thread.responses.map((response, index) => (
              <Text size="sm" key={index}>
                Réponse apportée par {response.team.join(", ")} le{" "}
                {new Date(response.timestamp).toLocaleDateString()}
                {" à "}
                {new Date(response.timestamp).toLocaleTimeString()} :<br />
                {response.responseMessage}
              </Text>
            ))
=======
          <Toggle
            label="Marquer toutes les réponses comme lues"
            checked={isAllRead}
            onChange={handleToggleChange}
          />
=======
>>>>>>> dcbf3d6 (fix(mail): secure imap server, no request if no mail)

          {data.threads.map((thread, threadIndex) => {
            const teamResponses = thread.responses.filter(
              (response) => !response.team.includes("user")
            );

            return teamResponses.length > 0
              ? teamResponses.map((response, index) => {
                  const responseDate = new Date(
                    response.timestamp
                  ).toLocaleDateString();
                  const responseTime = new Date(
                    response.timestamp
                  ).toLocaleTimeString();

                  if (displayedDates.has(responseDate + responseTime)) {
                    return null;
                  }

                  displayedDates.add(responseDate + responseTime);

<<<<<<< HEAD
              return (
                <div
                  key={`${threadIndex}-${index}`}
                  className="response-container"
                >
                  <Text
                    size="sm"
                    className={
                      response.team.includes("user") ? "user-side" : "staffSide"
                    }
                  >
                    {responder && (
                      <>
                        Réponse apportée par {responder} le {responseDate} à{" "}
                        {responseTime} :
                        <br />
                        {response.responseMessage}
                      </>
                    )}
                  </Text>
                </div>
              );
            })
>>>>>>> ca679c1 (feat(imap-server): add imap server)
          )}
>>>>>>> 7e6255f (fix(naming): clean code)
=======
                  const responder = response.team.join(", ");

                  return (
                    <div key={`${threadIndex}-${index}`}>
                      <Text size="sm" className="staffSide">
                        {responder && (
                          <>
                            Réponse apportée par {responder} le {responseDate} à{" "}
                            {responseTime} :
                            <br />
                            {response.responseMessage}
                          </>
                        )}
                      </Text>
                    </div>
                  );
                })
              : null;
          })}
>>>>>>> 5f63e6c (fix(staffactions): small fixes)
        </Col>
      )}

      <EmailSender contribution={data} refetch={refetch} />
    </>
  );
};

export default StaffActions;
