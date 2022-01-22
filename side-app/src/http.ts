import { http as tauriHttp } from "@tauri-apps/api";

const isTauri = window.hasOwnProperty("__TAURI__");
const fetch = isTauri ? tauriHttp.fetch : window.fetch;
const json: any = isTauri ? tauriHttp.Body.json : JSON.stringify;

export { fetch, json };
