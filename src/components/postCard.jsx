import React from "react";
import { Link } from "react-router-dom";
import appwriteService from "../appwrite/config";

function PostCard({ post }) {
  if (!post) return null;

  const { $id, title, featuredImage } = post;

  // Directly get safe image URL
  const imageUrl = appwriteService.getFileView(featuredImage);

  return (
    <Link to={`/post/${post.slug}`}>

      <div className="bg-white rounded-xl p-4 shadow hover:shadow-lg transition">
        <img
          src={imageUrl}
          alt={title || "Post Image"}
          className="w-full h-48 object-cover rounded-lg mb-3"
          loading="lazy"
          onError={(e) => (e.currentTarget.src = "/no-image.png")}     //post image 
        />
        <h2 className="text-xl font-semibold text-gray-800">
          {title || "Untitled Post"}
        </h2>
      </div>
    </Link>
  );
}

export default PostCard;
