import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Link } from "react-router-dom"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import Router from "./router"
import { DSFRConfig } from "@dataesr/dsfr-plus"
import { DataListProvider } from "./src/pages/api-operation-page/data-list-context"
import { RouterLinkProps } from "./types"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: Infinity,
    },
  },
})

const RouterLink = ({ href, replace, target, ...props }: RouterLinkProps) => {
  if (target === "_blank") return <a href={href} target={target} {...props} />
  return <Link to={href} replace={replace} {...props} />
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DataListProvider>
      <BrowserRouter>
        <DSFRConfig routerComponent={RouterLink}>
          <ToastContainer
            position="bottom-right"
            toastStyle={{
              backgroundColor: "#dffee6",
              color: "#0078f3",
              fontSize: "20px",
            }}
          />
          <QueryClientProvider client={queryClient}>
            <Router />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </DSFRConfig>
      </BrowserRouter>
    </DataListProvider>
  </React.StrictMode>
)
