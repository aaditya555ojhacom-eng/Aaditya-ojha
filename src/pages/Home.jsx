import React, { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import appwriteService from "../appwrite/config";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await appwriteService.getPosts();
        if (response && response.documents) {
          // Filter out invalid posts
          const validPosts = response.documents.filter(post => post && post.$id && post.title);
          setPosts(validPosts);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Loading posts...</p>;
  if (posts.length === 0) return <p>No posts available.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {posts.map(post => (
        <PostCard key={post.$id} post={post} />
      ))}
    </div>
  );
}

export default Home;
