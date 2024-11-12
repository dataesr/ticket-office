import { Col, Text } from "@dataesr/dsfr-plus";
import EmailSender from "../../../api/send-mail";
import type { Contribution } from "../../../types";
import { useLocation } from "react-router-dom";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
import "./styles.scss";
// import { useState, useEffect } from "react";

const StaffActions = ({
  data,
  refetch,
}: // url,
{
  data: Contribution;
  refetch: () => void;
  url: string;
}) => {
  const location = useLocation();

  // let baseUrl = "contacts";
  // if (location?.pathname?.includes("scanr-contributionpage")) {
  //   baseUrl = "contribute";
  // } else if (location?.pathname?.includes("removeuser")) {
  //   baseUrl = "remove-user";
  // } else if (location?.pathname?.includes("namechange")) {
  //   baseUrl = "update-user-data";
  // } else if (location?.pathname?.includes("apioperations")) {
  //   baseUrl = "production";
  // }

  const contributorClassName = location.pathname.includes("contributionpage")
    ? "staffSide"
    : "staffSideContact";

  // const queryClient = useQueryClient();

  // const [isAllRead, setIsAllRead] = useState(() => {
  //   return (
  //     data?.threads?.every((thread) =>
  //       thread.responses?.every((response) => response.read)
  //     ) || false
  //   );
  // });

  // const mutation = useMutation(
  //   async (isRead: boolean) => {
  //     return fetch(`api/${baseUrl}/${data.id}`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         threads: data.threads.map((thread) => ({
  //           ...thread,
  //           responses: thread.responses.map((response) => ({
  //             ...response,
  //             read: isRead,
  //           })),
  //         })),
  //       }),
  //     });
  //   },
  //   {
  //     onMutate: async (isRead: boolean) => {
  //       await queryClient.cancelQueries([url]);

  //       const previousData = queryClient.getQueryData<{ data: Contribution[] }>(
  //         [url]
  //       ) || { data: [] };

  //       if (Array.isArray(previousData.data)) {
  //         const updatedThreads = previousData.data.map((thread) => ({
  //           ...thread,
  //           responses: Array.isArray(thread.responses)
  //             ? thread.responses.map((response) => ({
  //                 ...response,
  //                 read: isRead,
  //               }))
  //             : [],
  //         }));

  //         queryClient.setQueryData([url], {
  //           ...previousData,
  //           data: updatedThreads,
  //         });
  //       } else {
  //         console.error("previousData.data n'est pas un tableau", previousData);
  //       }

  //       return { previousData };
  //     },

  //     onSuccess: () => {
  //       queryClient.invalidateQueries([url]);
  //       const updatedData = queryClient.getQueryData<{ data: Contribution[] }>([
  //         url,
  //       ]);

  //       if (updatedData?.data) {
  //         const allRead = updatedData.data.every((thread) =>
  //           thread.responses.every((response) => response.read)
  //         );
  //         setIsAllRead(allRead);
  //       }
  //     },
  //   }
  // );

  // const handleToggleChange = () => {
  //   const newState = !isAllRead;
  //   setIsAllRead(newState);
  //   mutation.mutate(newState);
  // };

  // useEffect(() => {
  //   const allRead =
  //     data?.threads?.every((thread) =>
  //       thread.responses?.every((response) => response.read)
  //     ) || false;
  //   setIsAllRead(allRead);
  // }, [data]);

  const cleanResponseMessage = (message: string) => {
    return message
      ?.replace(/De:.*$/s, "")
      ?.replace(/Objet :.*$/s, "")
      ?.replace(/Envoyé :.*$/s, "")
      ?.replace(/Le lun.*$/s, "")
      ?.replace(/Le mar.*$/s, "")
      ?.replace(/Le mer.*$/s, "")
      ?.replace(/Le jeu.*$/s, "")
      ?.replace(/Le ven.*$/s, "")
      ?.replace(/Le sam.*$/s, "")
      ?.replace(/Le dim.*$/s, "")

      ?.replace(/--[a-fA-F0-9_-]+--/g, "")

      .replace(/Content-Type:.*$/gs, "")
      .replace(/Content-Disposition:.*$/gs, "")
      .replace(/Content-Transfer-Encoding:.*$/gs, "")

      .replace(/base64[^ ]+/gs, "[Image ou fichier ignoré]")

      ?.replace(/<br\s*\/?>/g, "\n")

      ?.trim();
  };

  return (
    <>
      {data?.threads?.length > 0 && (
        <Col className={contributorClassName}>
          {/* {data.threads.length > 2 && (
            <Toggle
              label="Marquer toutes les réponses comme lues"
              checked={isAllRead}
              onChange={handleToggleChange}
            />
          )} */}

          {data.threads.map((thread, threadIndex) =>
            thread.responses.map((response, index) => {
              const responseDate = new Date(
                response.timestamp
              ).toLocaleDateString();
              const responseTime = new Date(
                response.timestamp
              ).toLocaleTimeString();

              const isStaffResponse = !response.team.includes("user");
              const className = isStaffResponse ? "staffSide" : "user-side";

              return (
                response.responseMessage && (
                  <div key={`${threadIndex}-${index}`} className={className}>
                    <Text size="sm">
                      {cleanResponseMessage(
                        response.responseMessage
                      )?.replaceAll("<br/>", "\n")}
                      <br />
                      <small>
                        Répondu le {responseDate} à {responseTime} par{" "}
                        {response.team.includes("user")
                          ? data.name || response.team
                          : response.team}
                      </small>
                    </Text>
                  </div>
                )
              );
            })
          )}
        </Col>
      )}

      <EmailSender contribution={data} refetch={refetch} />
    </>
  );
};

export default StaffActions;
