import {useState, useEffect, useCallback} from 'react';
import {User} from '../types/Auth';
import {db} from '../firebase/Firebase';
import {useAuth} from '../context/AuthProvider';

const useFetchUserById = (userId: string) => {
  const [userData, setUserData] = useState<User | null>(null);
  const {currentUser} = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const userDoc = await db.collection('users').doc(userId).get();
      if (userDoc.exists) {
        setUserData(userDoc.data() as User);
      } else {
        console.log('No such user!');
        setUserData(null);
      }
    } catch (err) {
      setError(err as any);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId, currentUser, fetchUser]);

  return {userData, loading, error, refetch: fetchUser};
};

export default useFetchUserById;
