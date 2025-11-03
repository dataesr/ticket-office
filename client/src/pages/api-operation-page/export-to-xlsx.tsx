import { useState, Key } from "react"
import { Badge, Button, ButtonGroup, Text, Title } from "@dataesr/dsfr-plus"
import ExcelJS from "exceljs"
import { AiOutlineDelete } from "react-icons/ai"
import { toast } from "react-toastify"
import { useDataList } from "./data-list-context"
import "./styles.scss"
import { postHeaders } from "../../config/api"
import { ContributionData, ExcelExportButtonProps } from "../../types"

const ExcelExportButton: React.FC<ExcelExportButtonProps> = ({ refetch }) => {
  const { dataList, setDataList } = useDataList()
  const [isMinimized, setIsMinimized] = useState(false)

  const markAsTreated = async (contributionIds: string[]) => {
    const basePath = window.location.pathname.includes("contributionpage")
      ? "contribute"
      : window.location.pathname.includes("apioperations")
      ? "contribute_productions"
      : "contacts"

    const urlBase = `/api/${basePath}`
    const body = { status: "treated" }

    try {
      const uniqueContributionIds = [...new Set(contributionIds)]
      const uniqueContributionPromises = uniqueContributionIds.map((id) =>
        fetch(`${urlBase}/${id}`, {
          method: "PATCH",
          headers: postHeaders,
          body: JSON.stringify(body),
        })
      )

      const responses = await Promise.all(uniqueContributionPromises)

      responses.forEach(async (response) => {
        if (!response.ok) {
          console.error("Erreur de réponse", response)
        } else {
          const responseData = await response.json()
        }
      })

      refetch()
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire", error)
    }
  }

  const handleExportClick = async () => {
    const dataToExport: ContributionData[] = dataList
      .filter((item) => item.export === true)
      .map((item) => ({
        person_id: item.person_id || "",
        publi_id: item.publi_id || "",
        contribution_id: item.contribution_id || "",
        fullName: item.fullName || "",
        first_name: item.first_name || "",
        last_name: item.last_name || "",
        export: false,
      }))

    if (dataToExport.length === 0) {
      toast.error("Aucune publication à exporter !")
      return
    }

    const uniqueContributionIds = [
      ...new Set(dataToExport.map((item) => item.contribution_id)),
    ]

    await markAsTreated(uniqueContributionIds)

    // Create workbook and worksheet with ExcelJS
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Sheet1")

    // Add headers
    if (dataToExport.length > 0) {
      const headers = Object.keys(dataToExport[0])
      worksheet.addRow(headers)

      // Add data rows
      dataToExport.forEach((item) => {
        const row = headers.map((header) => item[header])
        worksheet.addRow(row)
      })
    }

    // Generate buffer and download
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "export.xlsx"
    link.click()
    window.URL.revokeObjectURL(url)

    setDataList((prevState) =>
      prevState.map((item) => ({ ...item, export: false }))
    )
    toast("Panier vidé après exportation !", {
      style: {
        backgroundColor: "#c3fad5",
      },
    })
  }

  const handleCopyToClipboardClick = async () => {
    const dataToCopy = dataList
      .filter((item) => item.export === true)
      .map((item) => ({
        person_id: item.person_id || "",
        publi_id: item.publi_id || "",
        contribution_id: item.contribution_id || "",
        full_name: item.fullName || "",
        first_name: item.first_name || "",
        last_name: item.last_name || "",
      }))

    if (dataToCopy.length === 0) {
      toast.error("Aucune publication à copier !")
      return
    }

    const uniqueContributionIds = [
      ...new Set(dataToCopy.map((item) => item.contribution_id)),
    ]

    const formattedData = dataToCopy
      .map(
        (item) =>
          `${item.person_id}\t${item.publi_id}\t${item.full_name}\t${item.first_name}\t${item.last_name}`
      )
      .join("\n")

    try {
      await navigator.clipboard.writeText(formattedData)
      toast.success("Données copiées dans le presse-papiers !")
    } catch (err) {
      toast.error("Erreur lors de la copie des données !")
    }

    await markAsTreated(uniqueContributionIds)

    setDataList((prevState) =>
      prevState.map((item) => ({ ...item, export: false }))
    )
    toast("Panier vidé après la copie !", {
      style: {
        backgroundColor: "#c3fad5",
      },
    })
  }

  const handleRemoveClick = (publiId: any) => {
    setDataList((prevState) => {
      const newList = prevState.map((item) =>
        item.export === true && item.publi_id === publiId
          ? { ...item, export: false }
          : item
      )

      const removedItem = newList.find((item) => item.publi_id === publiId)
      if (removedItem) {
        toast(`Element retiré ! : ${removedItem.fullName}`, {
          style: {
            backgroundColor: "#d64d00",
            color: "#fff",
          },
        })
      }

      return newList
    })
  }

  const handleClearClick = () => {
    setDataList((prevState) =>
      prevState.map((item) => ({ ...item, export: false }))
    )
    toast("Panier vidé !", {
      style: {
        backgroundColor: "#c3fad5",
      },
    })
  }

  const uniqueExportCount = dataList
    .filter((item) => item.export === true)
    .reduce((unique, item) => {
      if (
        !unique.some(
          (uniqueItem: { publi_id: any }) =>
            uniqueItem.publi_id === item.publi_id
        )
      ) {
        unique.push(item)
      }
      return unique
    }, []).length

  return (
    <div className="basket">
      <div className="basket-content">
        <div className="basket-controls">
          <Title look="h6" className="basket-title">
            Liste des publications à exporter
          </Title>
        </div>
        <div className="basket-controls">
          <Badge size="sm" color="blue-ecume" className="badge-count">
            {`${uniqueExportCount} publication${
              uniqueExportCount > 1 ? "s" : ""
            }`}
          </Badge>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsMinimized(!isMinimized)}
            className="btn-minimize"
          >
            {isMinimized ? "Maximiser" : "Minimiser"}
          </Button>
        </div>

        {!isMinimized && (
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {Array.isArray(dataList) &&
              dataList
                .filter((item) => item.export === true)
                .reduce(
                  (unique, item) =>
                    unique.findIndex(
                      (obj: { publi_id: any }) => obj.publi_id === item.publi_id
                    ) > -1
                      ? unique
                      : [...unique, item],
                  []
                )
                .sort((a: { fullName: string }, b: { fullName: any }) =>
                  a.fullName.localeCompare(b.fullName)
                )
                .map(
                  (
                    item: { publi_id: any; fullName: any },
                    index: Key | null | undefined
                  ) => (
                    <li
                      key={index}
                      style={{
                        listStyleType: "none",
                        padding: 0,
                        borderBottom: "1px solid #000",
                      }}
                    >
                      <div className="basket-item">
                        <Text size="sm" bold>
                          {item.publi_id}
                        </Text>
                        <i>à lier à</i>
                        <Text size="sm" bold>
                          {item.fullName}
                          <button
                            onClick={() => handleRemoveClick(item.publi_id)}
                          >
                            <AiOutlineDelete color="red" />
                          </button>
                        </Text>
                      </div>
                    </li>
                  )
                )}
          </ul>
        )}

        <div className="fr-grid-row fr-grid-row--center fr-mt-3w">
          <ButtonGroup isInlineFrom="xs">
            <Button onClick={handleExportClick}>Exporter</Button>
            <Button
              color="green-emeraude"
              variant="primary"
              onClick={handleClearClick}
            >
              Vider le panier
            </Button>
          </ButtonGroup>
        </div>
        <div className="fr-grid-row fr-grid-row--center">
          <Button onClick={handleCopyToClipboardClick}>
            Copier et marquer comme traité
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ExcelExportButton
