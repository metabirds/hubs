import { qsGet } from "./qs_truthy";

const CYZY_PARAMS_SERVER_URL = '';

export async function cyzyFetchParamsWithToken() {
  const url = CYZY_PARAMS_SERVER_URL;
  if (!url) {
    return null;
  }
  const cyzyToken = qsGet("cyzyToken");
  if (!cyzyToken) {
    return null;
  }
  try {
    const result = await fetch(`${url}?token=${cyzyToken}`);
    const data = await result.json();
    return data;
  } catch (error) {
    console.error("failed to fetch", error);
    return null;
  }
}
