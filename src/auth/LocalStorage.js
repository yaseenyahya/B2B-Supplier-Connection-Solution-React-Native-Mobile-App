import SyncStorage from "sync-storage"

export const setLoginUserId = async (userId) => {
  await SyncStorage.set('USERID', userId);
}
export const getLoginUserId =  () => {
  try {
    const value = SyncStorage.get('USERID');
    if (value !== null) {
      return value;
    }
    return null;
  } catch (error) {
    return null;
  }
}
export const removeLoginUserId = async () => {
  await SyncStorage.remove('USERID');
}
export const isLoggedIn = () => {
  return getLoginUserId() ? true : false;
}
