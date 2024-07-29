import {useCallback, useEffect, useState} from 'react';
import {db} from '../firebase/Firebase';
import {User} from '../types/Auth';

const useFetchAllUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const usersSnapshot = await db.collection('users').get();
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as User),
      }));
      setUsers(usersData);
    } catch (err: any) {
      console.error('Error fetching all users:', error);
      setError(err.message || 'An error occurred while fetching users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {users, loading, error, refetch: fetchUsers};
};

export default useFetchAllUsers;
