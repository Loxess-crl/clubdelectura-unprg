import type { LocalStorageKeys } from "@/data/constants";

export const setLocalStorageItem = (key: LocalStorageKeys, value: any) => {
  const keyString = JSON.stringify(key);
  const valueString = JSON.stringify(value);

  const keyEncoded = btoa(keyString);
  const valueEncoded = btoa(valueString);

  localStorage.setItem(keyEncoded, valueEncoded);
};

export const getItemsFromLocalStorage = <T>(
  key: LocalStorageKeys
): T | undefined => {
  const keyString = JSON.stringify(key);
  const keyEncoded = btoa(keyString);

  const value = localStorage.getItem(keyEncoded);

  if (value) {
    const valueDecoded = atob(value);
    return JSON.parse(valueDecoded);
  }
};

export const clearTotalLocalStorage = () => {
  localStorage.clear();
};
