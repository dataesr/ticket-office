const VARIATION_CONTAINERS = {
  publications: "bso-local",
  datasets: "bso3-local",
}

export const getContainer = (api: string) => VARIATION_CONTAINERS[api]
