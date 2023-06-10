/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_BOTPRESS_TOKEN: string;
	readonly VITE_BOTPRESS_BOT_ID: string;
	readonly VITE_BOTPRESS_WORKSPACE_ID: string;
	readonly VITE_BOTPRESS_BOT_ID_AS_USER: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
