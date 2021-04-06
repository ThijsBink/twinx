import { useState, useEffect } from 'react';

function getSavedValue(key, initialValue) {
  try {
    const savedValue = JSON.parse(localStorage.getItem(key));
    if (savedValue) return savedValue;
    if (initialValue instanceof Function) return initialValue();
  } catch (err) {
    console.log(err);
  }

  return initialValue;
}

/**
 * Hook for state saved on local storage
 *
 * @param {*} key
 * @param {*} initialValue
 * @returns
 */
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => getSavedValue(key, initialValue));

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}
