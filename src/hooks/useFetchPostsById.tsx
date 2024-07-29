import {useState, useEffect, useCallback} from 'react';
import {db} from '../firebase/Firebase';
import {Post} from '../types/Post';

const useFetchPostsById = (userId: string) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    if (!userId) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const postsSnapshot = await db
        .collection('posts')
        .where('userId', '==', userId)
        .get();

      const fetchedPosts = postsSnapshot.docs.map(doc => ({
        ...(doc.data() as Post),
        postId: doc.id,
      }));

      setPosts(fetchedPosts);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching posts');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {posts, loading, error, refetch: fetchPosts};
};

export default useFetchPostsById;
