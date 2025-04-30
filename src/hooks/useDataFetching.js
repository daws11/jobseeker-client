import { useState, useEffect } from 'react';

export const useDataFetching = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchFunction();
        
        // Handle different response structures
        let processedData = null;
        if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
          processedData = response.data.data.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          processedData = response.data.data;
        } else if (Array.isArray(response.data)) {
          processedData = response.data;
        } else {
          processedData = [];
        }
        
        setData(processedData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, isLoading, error, setData };
}; 