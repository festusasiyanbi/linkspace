import {useState, useEffect, useCallback} from 'react';
import {db} from '../firebase/Firebase';
import useFetchUserById from './useFetchUserById';
import {arrayRemove, arrayUnion} from '@react-native-firebase/firestore';
import {User} from '../types/Auth';

type useFollowUserProp = {
  userId: string;
  userToFollowId: string;
};

const useFollowUser = ({userId, userToFollowId}: useFollowUserProp) => {
  const [isFollower, setIsFollower] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const {userData: currentUserData, refetch: refetchCurrentUserData} =
    useFetchUserById(userId);
  const {refetch: refetchFollowUserData} = useFetchUserById(userToFollowId);

  const followUserAction = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userDocRef = db.collection('users').doc(userId);
      const userFollowDocRef = db.collection('users').doc(userToFollowId);

      const userDocSnapshot = await userDocRef.get();
      const userFollowDocSnapshot = await userFollowDocRef.get();

      if (!userDocSnapshot.exists) {
        setError('No user found');
        setLoading(false);
        return;
      }

      if (!userFollowDocSnapshot.exists) {
        setError('User to follow not found.');
        setLoading(false);
        return;
      }

      const currentUser = userDocSnapshot.data() as User;

      await userFollowDocRef.update({
        followers: arrayUnion(currentUser.userId),
      });
      await userDocRef.update({following: arrayUnion(userToFollowId)});

      setIsFollower(true);
      refetchCurrentUserData();
      refetchFollowUserData();
    } catch (err) {
      console.error(err);
      setError('An error occurred while trying to follow the user.');
    } finally {
      setLoading(false);
    }
  }, [userId, userToFollowId, refetchCurrentUserData, refetchFollowUserData]);

  const unfollowUserAction = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userDocRef = db.collection('users').doc(userId);
      const userFollowDocRef = db.collection('users').doc(userToFollowId);

      const userDocSnapshot = await userDocRef.get();
      const userFollowDocSnapshot = await userFollowDocRef.get();

      if (!userDocSnapshot.exists) {
        setError('No user found');
        setLoading(false);
        return;
      }

      if (!userFollowDocSnapshot.exists) {
        setError('User to unfollow not found.');
        setLoading(false);
        return;
      }

      const currentUser = userDocSnapshot.data() as User;

      await userFollowDocRef.update({
        followers: arrayRemove(currentUser.userId),
      });
      await userDocRef.update({following: arrayRemove(userToFollowId)});

      setIsFollower(false);
      refetchCurrentUserData();
      refetchFollowUserData();
    } catch (err) {
      console.error(err);
      setError('An error occurred while trying to unfollow the user.');
    } finally {
      setLoading(false);
    }
  }, [userId, userToFollowId, refetchCurrentUserData, refetchFollowUserData]);

  useEffect(() => {
    if (currentUserData?.following?.includes(userToFollowId)) {
      setIsFollower(true);
    } else {
      setIsFollower(false);
    }
  }, [currentUserData, userToFollowId]);

  return {
    isFollower,
    followUser: followUserAction,
    unfollowUser: unfollowUserAction,
    loading,
    error,
  };
};

export default useFollowUser;
