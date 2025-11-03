import pkgcloud, { ProviderOptions } from "pkgcloud"
import { Duplex } from "stream"

const credentials = {
  provider: "openstack",
  username: process.env.OVH_USERNAME,
  password: process.env.OVH_PASSWORD,
  authUrl: process.env.OVH_AUTH_URL,
  region: process.env.OVH_REGION,
  tenantId: process.env.OVH_TENANT_ID,
  tenantName: process.env.OVH_TENANT_NAME,
  version: "v3",
  keystoneAuthVersion: "v3",
  domainName: "Default",
  projectDomainName: "Default",
  strictSSL: false,
}

export const client = pkgcloud.storage.createClient(
  credentials as ProviderOptions
)

export default {
  put: (buffer: any, container: string, remote: string, options: any) =>
    new Promise<any>((resolve, reject) => {
      const stream = new Duplex()
      stream.push(buffer)
      stream.push(null)
      const writeStream = client.upload({ container, remote, ...options })
      stream.pipe(writeStream)
      writeStream.on("error", (err: any) => reject(err))
      writeStream.on("success", (file: any) => resolve(file))
    }),

  get: (container: string, remote: string) =>
    new Promise<any>((resolve, reject) => {
      const fileData: Array<string> = []
      const stream = client.download({ container, remote })

      stream.on("data", (chunk: any) => {
        fileData.push(chunk.toString())
      })

      stream.on("end", () => {
        resolve(fileData.join(""))
      })

      stream.on("error", (err: any) => {
        reject(err)
      })
    }),
}
