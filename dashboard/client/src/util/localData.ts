export const getLocalStorage = <T>(key: string) => {
  const data = window.localStorage.getItem(key);
  try {
    const result: T = JSON.parse(data || "")
    return result;
  } catch {
    return data;
  }
};

export const setLocalStorage = (key: string, value: any) => {
  return window.localStorage.setItem(key, JSON.stringify(value));
};
