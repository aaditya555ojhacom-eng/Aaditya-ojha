import React from "react";
import { Container, PostForm } from "../components";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function AddPost() {
  const userData = useSelector((state) => state.auth.userData);

  if (!userData) return <Navigate to="/login" replace />;

  return (
    <div className="py-8">
      <Container>
        <PostForm />
      </Container>
    </div>
  );
}

export default AddPost;
