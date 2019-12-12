const SAVED_SESSIONS = "savedSessions";

const getStorageSessions = () => {
  let storageSessions = window.localStorage.getItem(SAVED_SESSIONS);
  return storageSessions ? JSON.parse(storageSessions) : {};
}