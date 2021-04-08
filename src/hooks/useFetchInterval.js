import { useState, useEffect, useRef } from 'react';

export default function useFetchInterval(
  initialFetchFunction,
  milliseconds = 30000
) {
  const [fetchFunction, setFetchFunction] = useState(initialFetchFunction);
  const interval = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  async function executeFetchFunction() {
    setIsError(false);
    try {
      await fetchFunction();
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setIsError(true);
    }
  }

  useEffect(() => {
    executeFetchFunction();
    clearInterval(interval.current);
    interval.current = setInterval(() => {
      executeFetchFunction();
    }, milliseconds);
  }, [fetchFunction]);

  useEffect(() => {
    return () => {
      clearInterval(interval.current);
      interval.current = null;
    };
  }, []);

  return {
    setFetchFunction,
    intervalIsActive: !!interval,
    isLoading,
    isError,
  };
}
