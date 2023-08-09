import { qsGet } from "./qs_truthy";

const CYZY_USER_PARAMS_SERVER_URL = '';

export async function cyzyFetchUserParamsWithToken() {
  const url = CYZY_USER_PARAMS_SERVER_URL;
  if (!url) {
    return null;
  }
  const token = qsGet("cyzyUserToken");
  if (!token) {
    return null;
  }
  try {
    const result = await fetch(`${url}?token=${token}`);
    const data = await result.json();
    return data;
  } catch (error) {
    console.error("failed to fetch", error);
    return null;
  }
}