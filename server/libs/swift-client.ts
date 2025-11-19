import { Readable } from "stream"

// Interface for the configuration (matching your env variables)
interface OpenStackConfig {
  authUrl: string
  username: string
  password: string
  region: string
  projectId?: string
  projectName?: string
  userDomainName?: string // Usually "Default"
  projectDomainName?: string // Usually "Default"
}

// Interface for the internal token state
interface TokenState {
  value: string
  expiresAt: Date
  endpoint: string // The full URL to the Swift container (e.g., https://storage.../v1/AUTH_...)
}

export class OpenStackSwiftClient {
  private config: OpenStackConfig
  private token: TokenState | null = null

  constructor(config: OpenStackConfig) {
    this.config = config
  }

  /**
   * Authenticates with Keystone v3 to get a Token and the Storage Endpoint.
   */
  private async authenticate(): Promise<TokenState> {
    // Payload for Keystone v3 Password Auth with Scope
    const payload: any = {
      auth: {
        identity: {
          methods: ["password"],
          password: {
            user: {
              name: this.config.username,
              domain: { name: this.config.userDomainName || "Default" },
              password: this.config.password,
            },
          },
        },
        scope: {
          project: {
            domain: { name: this.config.projectDomainName || "Default" },
          },
        },
      },
    }

    // Add Project ID or Name to scope
    if (this.config.projectId) {
      payload.auth.scope.project.id = this.config.projectId
    } else if (this.config.projectName) {
      payload.auth.scope.project.name = this.config.projectName
    } else {
      throw new Error(
        "OpenStack: Missing projectId or projectName in configuration"
      )
    }

    console.log("OpenStack: Authenticating...")
    const response = await fetch(`${this.config.authUrl}/v3/auth/tokens`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`OpenStack Auth Failed (${response.status}): ${text}`)
    }

    // 1. Extract Token
    const tokenValue = response.headers.get("X-Subject-Token")
    if (!tokenValue)
      throw new Error("OpenStack: No X-Subject-Token header in response")

    // 2. Extract Catalog to find Swift Endpoint
    // Fix: Cast response.json() to any to avoid 'unknown' error
    const body: any = await response.json()
    const catalog = body.token.catalog
    const swiftService = catalog.find((s: any) => s.type === "object-store")

    if (!swiftService)
      throw new Error("OpenStack: No 'object-store' service found in catalog")

    // Find endpoint for specific region (interface public)
    const endpointObj = swiftService.endpoints.find(
      (e: any) =>
        e.interface === "public" &&
        (!this.config.region || e.region === this.config.region)
    )

    if (!endpointObj) {
      throw new Error(
        `OpenStack: No public endpoint found for region ${this.config.region}`
      )
    }

    const expiresAt = new Date(body.token.expires_at)

    this.token = {
      value: tokenValue,
      endpoint: endpointObj.url,
      expiresAt,
    }

    return this.token
  }

  /**
   * Ensures a valid token exists.
   */
  private async ensureAuth(): Promise<TokenState> {
    if (this.token && this.token.expiresAt > new Date()) {
      return this.token
    }
    return this.authenticate()
  }

  /**
   * Generic fetch wrapper to handle Auto-Reauthentication on 401.
   */
  private async request(
    method: string,
    path: string,
    // Fix: Use specific types instead of BodyInit to avoid global type issues
    body?: string | Buffer | ReadableStream | null,
    headers: Record<string, string> = {}
  ): Promise<Response> {
    let auth = await this.ensureAuth()
    const url = `${auth.endpoint}/${path}`

    // Bun's fetch accepts these types natively.
    // We cast body to 'any' here only to satisfy the fetch signature if strict types mismatch
    let response = await fetch(url, {
      method,
      body: body as any,
      headers: {
        "X-Auth-Token": auth.value,
        ...headers,
      },
    })

    // Retry once if 401 Unauthorized (Token might have been revoked or expired narrowly)
    if (response.status === 401) {
      console.log("OpenStack: Token expired, re-authenticating...")
      auth = await this.authenticate()
      response = await fetch(`${auth.endpoint}/${path}`, {
        method,
        body: body as any,
        headers: {
          "X-Auth-Token": auth.value,
          ...headers,
        },
      })
    }

    if (!response.ok) {
      throw new Error(
        `OpenStack Error ${response.status} on ${method} ${path}: ${response.statusText}`
      )
    }

    return response
  }

  /**
   * Upload a file (Buffer, string, or Stream)
   */
  async upload(
    container: string,
    remoteName: string,
    data: Buffer | string | ReadableStream | Readable,
    contentType?: string
  ) {
    // If it's a Node stream, Bun's fetch handles it, or we can convert it.
    // Bun fetch accepts Readable/ReadableStream directly.

    const headers: Record<string, string> = {}
    if (contentType) headers["Content-Type"] = contentType

    // Sanitize path (remove leading slash if present)
    const cleanPath = `${container}/${remoteName.replace(/^\/+/, "")}`

    const response = await this.request("PUT", cleanPath, data as any, headers)
    const responseHeaders = response.headers

    return {
      name: remoteName,
      etag: responseHeaders.get("etag"),
      lastModified: responseHeaders.get("last-modified"),
      container: container,
    }
  }

  /**
   * Download a file and return content as string (matching your old API)
   */
  async download(container: string, remoteName: string): Promise<string> {
    const cleanPath = `${container}/${remoteName.replace(/^\/+/, "")}`
    const response = await this.request("GET", cleanPath)
    return response.text()
  }

  /**
   * Download a file and return a ReadableStream (Better for large files)
   */
  async downloadStream(
    container: string,
    remoteName: string
  ): Promise<ReadableStream> {
    const cleanPath = `${container}/${remoteName.replace(/^\/+/, "")}`
    const response = await this.request("GET", cleanPath)
    if (!response.body) throw new Error("Empty response body")
    return response.body
  }
}

// --- Initialization ---

const config: OpenStackConfig = {
  username: process.env.OVH_USERNAME || "",
  password: process.env.OVH_PASSWORD || "",
  authUrl: process.env.OVH_AUTH_URL || "",
  region: process.env.OVH_REGION || "",
  projectId: process.env.OVH_TENANT_ID, // Prefer ID for v3
  projectName: process.env.OVH_TENANT_NAME,
  userDomainName: "Default",
  projectDomainName: "Default",
}

export const client = new OpenStackSwiftClient(config)

// --- Export Default Helper (Matches your existing interface) ---

export default {
  /**
   * Uploads data to Swift.
   * @param buffer - Buffer, String, or Stream
   * @param container - Container Name
   * @param remote - Destination Filename
   * @param options - Optional headers/metadata
   */
  put: async (
    buffer: any,
    container: string,
    remote: string,
    options: any = {}
  ) => {
    // Map options if needed, e.g., contentType
    const contentType = options.contentType || options.headers?.["content-type"]
    return client.upload(container, remote, buffer, contentType)
  },

  /**
   * Downloads data from Swift as a string.
   * @param container - Container Name
   * @param remote - Filename
   */
  get: async (container: string, remote: string) => {
    return client.download(container, remote)
  },
}
