/// <reference types="vite/client" />
interface ImportMeta {
  env: {
    [key: string]: string;
    VITE_SCANR_API_AUTHORIZATION?: string;
  };
}
