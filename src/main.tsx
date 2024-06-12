import React, { ReactNode } from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { BrowserRouter, Link } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import Router from "./router";
import { DSFRConfig } from "@dataesr/dsfr-plus";
import { DataListProvider } from "./pages/api-operation-page/link-publications/data-list-context";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: Infinity,
    },
  },
});

type RouterLinkProps = {
  href: string;
  replace?: boolean;
  target?: string;
  children?: ReactNode;
};

const RouterLink = ({ href, replace, target, ...props }: RouterLinkProps) => {
  if (target === "_blank") return <a href={href} target={target} {...props} />;
  return <Link to={href} replace={replace} {...props} />;
};

ReactDOM.render(
  <React.StrictMode>
    <DataListProvider>
      <BrowserRouter>
        <DSFRConfig routerComponent={RouterLink}>
          <ToastContainer
            toastStyle={{
              backgroundColor: "#dffee6",
              color: "#0078f3",
              fontSize: "20px",
            }}
          />
          <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools />
            <Router />
          </QueryClientProvider>
        </DSFRConfig>
      </BrowserRouter>
    </DataListProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
