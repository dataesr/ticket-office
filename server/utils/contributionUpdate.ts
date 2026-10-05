type ContributionThread = {
  responses?: { read?: boolean; [key: string]: any }[];
  [key: string]: any;
};

export function normalizeContributionUpdate<
  T extends {
    status?: string;
    treated_at?: Date;
    team?: string[];
    threads?: ContributionThread[];
    [key: string]: any;
  },
>(data: T): T {
  if (data.status && ["ongoing", "treated"].includes(data.status)) {
    data.treated_at = new Date();
  }

  if (data.team && Array.isArray(data.team)) {
    const userWhoModified = data.team[0];
    if (!data.team.includes(userWhoModified)) {
      data.team.push(userWhoModified);
    }
  }

  if (data.threads) {
    data.threads = data.threads.map((thread) => {
      thread.responses = thread.responses?.map((response) => {
        if (response.read === false) {
          response.read = true;
        }
        return response;
      });
      return thread;
    });
  }

  return data;
}
