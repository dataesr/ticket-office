import Papa from "papaparse"

export default function readCSV(csv: string) {
  const count = {
    doi: 0,
    hal_coll_code: 0,
    hal_id: 0,
    hal_struct_id: 0,
    nnt_etab: 0,
    nnt_id: 0,
  }

  Papa.parse(window.atob(csv), {
    header: true,
    skipEmptyLines: "greedy",
    transform: (value) => value.trim(),
    transformHeader: (header) => header.trim().toLowerCase(),
    complete: ({ data }) => {
      count.doi = data.filter((item) => item?.doi)?.length
      count.hal_coll_code = data.filter((item) => item?.hal_coll_code)?.length
      count.hal_id = data.filter((item) => item?.hal_id)?.length
      count.hal_struct_id = data.filter((item) => item?.hal_struct_id)?.length
      count.nnt_etab = data.filter((item) => item?.nnt_etab)?.length
      count.nnt_id = data.filter((item) => item?.nnt_id)?.length
    },
    error: () => {
      console.error("Erreur lors du chargement du fichier.")
      return undefined
    },
  })

  return count
}
