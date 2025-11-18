export function formatDate(dateString: string | number | Date | null): string {
  if (!dateString) return new Date().toISOString()
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString()
}

export function extractReferenceInfo(subject: string): {
  referenceId: string | null
  collectionName: string
} {
  if (!subject) return { referenceId: null, collectionName: "contacts" }

  const cleanSubject = subject.replace(/Re:\s*|\[?[*]?PUB[*]?\]?/gi, "").trim()

  const referencePatterns = [
    /référence[\s:]+([a-zA-Z0-9_-]+)-([a-fA-F0-9]{24})/i,
    /référence[\s:]+([a-fA-F0-9]{24})/i,
    /([a-fA-F0-9]{24})[\s:]+([a-zA-Z0-9_-]+)/i,
  ]

  for (const pattern of referencePatterns) {
    const match = cleanSubject.match(pattern)
    if (match) {
      if (match.length === 3) {
        const prefix = match[1]
        const id = match[2]
        return {
          referenceId: id,
          collectionName: determineCollectionName(prefix),
        }
      } else if (match.length === 2) {
        const id = pattern === referencePatterns[1] ? match[1] : match[1]
        const prefix = pattern === referencePatterns[2] ? match[2] : null

        if (prefix) {
          return {
            referenceId: id,
            collectionName: determineCollectionName(prefix),
          }
        }

        return {
          referenceId: id,
          collectionName: "needs_lookup",
        }
      }
    }
  }

  return { referenceId: null, collectionName: "contacts" }
}

export function determineCollectionName(collectionPrefix: string): string {
  if (!collectionPrefix) return "contacts"

  const collections: Record<string, string> = {
    contacts: "contacts",
    contribute: "contribute",
    contribute_productions: "contribute_productions",
    "remove-user": "remove-user",
    productions: "contribute_productions",
    "update-user-data": "update-user-data",
    bso_local_variations_publications: "bso_local_variations_publications",
  }

  const normalizedPrefix = collectionPrefix.toLowerCase().replace(/-/g, "")

  if (collections[collectionPrefix]) {
    return collections[collectionPrefix]
  }

  if (collections[normalizedPrefix]) {
    return collections[normalizedPrefix]
  }

  for (const key in collections) {
    if (key.startsWith(normalizedPrefix) || normalizedPrefix.startsWith(key)) {
      return collections[key]
    }
  }

  return "contacts"
}

export function generateContributionLink(
  referenceId: string,
  fromApplication: string,
  collectionName: string
) {
  const baseUrl = "https://ticket-office.dataesr.ovh"
  if (collectionName === "contacts") {
    switch (fromApplication) {
      case "scanr":
        return `${baseUrl}/scanr-contact?page=1&query=${referenceId}&searchInMessage=false&sort=DESC&status=choose`
      case "datasupr":
        return `${baseUrl}/datasupr-contact?page=1&query=${referenceId}&searchInMessage=false&sort=DESC&status=choose`
      case "bso":
        return `${baseUrl}/bso-contact?page=1&query=${referenceId}&searchInMessage=false&sort=DESC&status=choose`
    }
  }
  if (collectionName === "contribute") {
    return `${baseUrl}/scanr-contributionPage?page=1&query=${referenceId}&searchInMessage=false&sort=DESC&status=choose`
  }
  if (collectionName === "bso_local_variations_publications") {
    return `${baseUrl}/bso-local-variations-publications?page=1&query=${referenceId}&searchInMessage=false&sort=DESC&status=choose`
  }
  if (collectionName === "contribute_productions") {
    return `${baseUrl}/scanr-apioperations?page=1&query=${referenceId}&searchInMessage=false&sort=DESC&status=choose`
  }
  if (collectionName === "remove-user") {
    return `${baseUrl}/scanr-removeuser?page=1&query=${referenceId}&searchInMessage=false&sort=DESC&status=choose`
  }
  if (collectionName === "update-user-data") {
    return `${baseUrl}/scanr-namechange?page=1&query=${referenceId}&searchInMessage=false&sort=DESC&status=choose`
  }
  return ""
}
