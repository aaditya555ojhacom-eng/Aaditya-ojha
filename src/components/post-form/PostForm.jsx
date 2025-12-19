import React, { useCallback, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Input, Select, RTE } from "../index";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PostForm({ post }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(
    post?.featuredImage ? appwriteService.getFilePreview(post.featuredImage) : null
  );

  // Auto-generate slug
  const slugTransform = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");

  ;

  // Watch title & image for changes
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
      if (name === "image" && value.image?.[0]) {
        setImagePreview(URL.createObjectURL(value.image[0]));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  const submit = async (data) => {
    if (loading) return;
    setLoading(true);

    try {
      // Handle file upload
      let fileId = post?.featuredImage || "";

      if (data.image?.[0]) {
        const file = await appwriteService.uploadFile(data.image[0]);
        if (!file) throw new Error("File upload failed");
        if (post?.featuredImage) {
          await appwriteService.deleteFile(post.featuredImage); 
        }
        fileId = file.$id;
      }

      // Ensure all required attributes exist
      const slug = slugTransform(data.title).replace(/^-+|-+$/g, ""); 

const payload = {
  title: data.title,
   slug: slugTransform(data.title),
  content: data.content,
  featuredImage: fileId || "",
  status: data.status,
  userid: userData?.$id || "unknown",
  Attributes: "default", 
};


      let dbPost;
      if (post) {
        dbPost = await appwriteService.updatePost(post.$id, payload);
      } else {
        dbPost = await appwriteService.createPost(payload);
      }

      if (dbPost) navigate(`/post/${dbPost.slug}`);
    } catch (error) {
      console.error("Post submit error:", error);
      alert("Error submitting post. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title"
          placeholder="Enter title"
          className="mb-2"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && <p className="text-red-500 mb-2">{errors.title.message}</p>}

        <Input
          label="Slug"
          placeholder="Slug"
          className="mb-2"
          {...register("slug", { required: "Slug is required" })}
          onInput={(e) => setValue("slug", slugTransform(e.currentTarget.value))}
        />
        {errors.slug && <p className="text-red-500 mb-2">{errors.slug.message}</p>}

        <Controller
          name="content"
          control={control}
          rules={{ required: "Content is required" }}
          render={({ field }) => <RTE label="Content" control={control} defaultValue={field.value} onChange={field.onChange} />}
        />
        {errors.content && <p className="text-red-500 mb-2">{errors.content.message}</p>}
      </div>

      <div className="w-1/3 px-2">
        <Input
          label="Featured Image"
          type="file"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image")}
        />
        {errors.image && <p className="text-red-500 mb-2">{errors.image.message}</p>}

        {imagePreview && (
          <div className="w-full my-6 border rounded-lg overflow-hidden bg-gray-100">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full max-h-[400px] object-contain"
              onError={(e) => (e.currentTarget.src = "/no-image.png")} 
            />
          </div>
        )}

        <Controller
          name="status"
          control={control}
          rules={{ required: "Status is required" }}
          render={({ field }) => <Select label="Status" options={["active", "inactive"]} {...field} />}
        />
        {errors.status && <p className="text-red-500 mb-2">{errors.status.message}</p>}

        <Button
          type="submit"
          disabled={loading}
          className={`w-full ${loading ? "opacity-50" : "bg-blue-500"}`}
        >
          {loading ? (post ? "Updating..." : "Submitting...") : post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default PostForm;
