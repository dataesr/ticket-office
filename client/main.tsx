import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

import Router from "./router";
import { DSFRConfig } from "@dataesr/dsfr-plus";
import { DataListProvider } from "./src/pages/scanr/productions/data-list-context/provider";
import RouterLink from "./src/components/router-link";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: Infinity,
    },
  },
});

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
);
