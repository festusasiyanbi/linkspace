import {useState, useCallback} from 'react';

const useRefresh = (refetch: () => Promise<void>) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Error during refresh:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  return {refreshing, handleRefresh};
};

export default useRefresh;
