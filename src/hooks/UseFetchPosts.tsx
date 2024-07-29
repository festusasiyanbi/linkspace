import {useState, useEffect, useCallback} from 'react';
import {db} from '../firebase/Firebase';
import {Post} from '../types/Post';

type fetchPostProp = {
  userId: string | undefined;
  followingIds: string[] | undefined;
};
const useFetchPosts = ({userId, followingIds}: fetchPostProp) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const fetchFeedPosts = useCallback(async () => {
    if (!userId) {
      setPosts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let fetchedPosts: Post[] = [];

      const userIdsToFetch = [...(followingIds as string[]), userId as string];

      const query = db
        .collection('posts')
        .where('userId', 'in', userIdsToFetch);

      const querySnapshot = await query.get();
      fetchedPosts = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        postId: doc.id,
      })) as Post[];

      if (fetchedPosts.length === 0) {
        console.log('Post posts to fetch');
        return;
      }
      setPosts(fetchedPosts);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [userId, followingIds]);

  useEffect(() => {
    fetchFeedPosts();
  }, [userId, followingIds, fetchFeedPosts]);

  return {posts, loading, error, refetch: fetchFeedPosts};
};

export default useFetchPosts;
