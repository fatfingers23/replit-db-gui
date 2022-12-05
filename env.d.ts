/// <reference types="vite/client" />
interface ImportMetaEnv{
  readonly VITE_BASE_NODE_URL: string,
  readonly VITE_LOCAL_ONLY: boolean
}


interface ImportMeta {
  readonly env: ImportMetaEnv
}
