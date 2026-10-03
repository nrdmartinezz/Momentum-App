import { apiGet, getToken } from "./apiClient";

let cachedToken = null;
let cachedData = null;
let pendingToken = null;
let pendingPromise = null;

function unwrapTasks(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.tasks)) return data.tasks;
  return [];
}

async function fetchSession() {
  try {
    const data = await apiGet("/bootstrap");
    return {
      tasks: unwrapTasks(data),
      theme: data?.theme ?? null,
      settings: data?.settings ?? null,
    };
  } catch (error) {
    if (error?.status !== 404) throw error;
  }

  const [tasksResult, themeResult, settingsResult] = await Promise.allSettled([
    apiGet("/tasks"),
    apiGet("/themes"),
    apiGet("/users/get_user_settings"),
  ]);

  return {
    tasks: tasksResult.status === "fulfilled" ? unwrapTasks(tasksResult.value) : [],
    theme: themeResult.status === "fulfilled" ? themeResult.value : null,
    settings: settingsResult.status === "fulfilled" ? settingsResult.value : null,
  };
}

export function clearSessionData() {
  cachedToken = null;
  cachedData = null;
  pendingToken = null;
  pendingPromise = null;
}

export function loadSessionData() {
  const token = getToken();
  if (!token) return Promise.resolve(null);
  if (cachedToken === token && cachedData) return Promise.resolve(cachedData);
  if (pendingToken === token && pendingPromise) return pendingPromise;

  pendingToken = token;
  pendingPromise = fetchSession()
    .then((data) => {
      cachedToken = token;
      cachedData = data;
      return data;
    })
    .finally(() => {
      if (pendingToken === token) {
        pendingToken = null;
        pendingPromise = null;
      }
    });

  return pendingPromise;
}
