import { fetchReticulumAuthenticated } from "./phoenix-utils";
import { qsGet } from "./qs_truthy";

const CYZY_USER_PARAMS_SERVER_URL = 'https://cyzy-user-params.cyzyspace.io';
const CYZY_CHAT_LOGGER_URL = 'https://logger-dev.cyzyspace.io'


export async function cyzyPostUserParams() {
  const url = CYZY_USER_PARAMS_SERVER_URL;
  if (!url) {
    return null;
  }
  const profile = window.APP.store.state.profile; 
  const params = {
    "name": profile?.displayName,
    "avatarName": profile?.avatarName,
  }
  console.log("params", params);
  try {
    let res = await fetch(`${url}/users`, {
      body: JSON.stringify(params),
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(r => r.json());
    return res.token;
  } catch (error) {
    console.error("failed to fetch", error);
    return null;
  }
}

export async function cyzyPostLog(type: string, message: string) {
  const url = CYZY_CHAT_LOGGER_URL;
  if (!url) {
    return null;
  }
  const profile = window.APP.store.state.profile;
  const roomId = window.APP.hub.hub_id;

  // @ts-ignore
  let hubsUserId = window.APP.hubChannel.store.state.credentials.email || localStorage.getItem("hubsUserId");
  if (!hubsUserId) {
    hubsUserId = `guest-${Math.random().toString(36).substring(2)}`;
    localStorage.setItem("hubsUserId", hubsUserId);
  }

  const params = {
    roomId: roomId,
    data: {
      category: type,
      message: message,
      author: profile?.displayName,
      originUrl: `${location.origin}/${roomId}`
    },
    hubsUserId: hubsUserId
  }
  try {
    let res = await fetch(`${url}/api`, {
      body: JSON.stringify(params),
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function cyzyFetchUserParamsWithToken() {
  const url = CYZY_USER_PARAMS_SERVER_URL;
  if (!url) {
    return null;
  }
  const cyzyUserToken = qsGet("cyzyUserToken");
  if (!cyzyUserToken) {
    return null;
  }
  try {
    const result = await fetch(`${url}/users?token=${cyzyUserToken}`);
    const data = await result.json();
    return data;
  } catch (error) {
    console.error("failed to fetch", error);
    return null;
  }
}

export async function listFeaturedAvatars() {
  const featuredAvatarEndpoint = "/api/v1/media/search?filter=featured&source=avatar_listings";
  let avatars: any = [];
  let cursor = 1;
  while (cursor) {
    const result = await fetchReticulumAuthenticated(`${featuredAvatarEndpoint}&cursor=${cursor}`);
    avatars = avatars.concat(result.entries || []);
    cursor = result.meta?.next_cursor;
  }
  return avatars;
}

export async function avatarNameToId(name: string) {
  if (!name) {
    return null;
  }
  const avatars = await listFeaturedAvatars();
  const avatar = avatars.find((avatar: any) => avatar.name === name);
  return avatar?.id || null;
}

export function getHubsUserId() {
  // @ts-ignore
  let hubsUserId = window.APP.hubChannel?._permissions.account_id || localStorage.getItem("hubsUserId");
  if (!hubsUserId) {
    hubsUserId = Math.random().toString(36).substring(2);
    localStorage.setItem("hubsUserId", hubsUserId);
    console.log("hubsUserId:", hubsUserId);
  }
  return hubsUserId;
}