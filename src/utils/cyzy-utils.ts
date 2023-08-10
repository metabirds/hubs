import { fetchReticulumAuthenticated } from "./phoenix-utils";
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
