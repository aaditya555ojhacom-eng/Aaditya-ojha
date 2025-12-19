import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";

function Post() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        console.log("Slug from URL:", slug);

        const res = await appwriteService.getPostBySlug(slug);
        console.log("Fetched post:", res);

        setPost(res);
      } catch (err) {
        console.error("Fetch post error:", err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchPost();
  }, [slug]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!post) return <h1 className="text-center mt-10">Post not found</h1>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

      {post.featuredImage && (
       <img
  src={appwriteService.getFileView(post.featuredImage)}
  alt={post.title}
  className="w-full mb-6 rounded-lg object-cover"
  onError={(e) => (e.currentTarget.src = "/no-image.png")}
/>

      )}

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}

export default Post;
