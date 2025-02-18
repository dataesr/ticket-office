import { Variation } from "../types"

function stringToArrayBuffer(string: string) {
  const buffer = new ArrayBuffer(string.length)
  const view = new Uint8Array(buffer)
  for (let i = 0; i < string.length; i++) view[i] = string.charCodeAt(i) & 0xff
  return buffer
}

export default function DownloadFile(variation: Variation) {
  const blob = new Blob([stringToArrayBuffer(window.atob(variation.csv))], { type: "text/csv;charset=utf-8" })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", `${variation.structure?.id || variation.structure.name}.csv`)
  document.body.appendChild(link)
  link.click()
  link.remove()
}
