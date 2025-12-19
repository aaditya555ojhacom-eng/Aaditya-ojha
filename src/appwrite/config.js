import conf from "../conf/conf.js";
import { Client, ID, Databases, Storage, Query } from "appwrite";

class AppwriteService {
  client = new Client();
  databases;
  storage;

  constructor() {
    this.client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.storage = new Storage(this.client);
  }

  // ---------- POSTS ----------
 async createPost({
  title,
  slug,
  content,
  featuredImage,
  status,
  userid,
}) {
  return await this.databases.createDocument(
    conf.appwriteDatabaseId,
    conf.appwriteCollectionId,
    ID.unique(),
    {
      title,
      slug,
      content,
      featuredImage,
      status,
      userid,
      Attributes: "default", //  REQUIRED BY COLLECTION
    }
  );
}



  async updatePost(postId, { title, slug, content, featuredImage, status, userid, Attributes }) {
    return await this.databases.updateDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      postId,
      { title, slug, content, featuredImage, status, userid, Attributes }
    );
  }

 async getPosts() {
  return await this.databases.listDocuments(
    conf.appwriteDatabaseId,
    conf.appwriteCollectionId,
    [Query.equal("status", "active")]
  );
}


  async getPostBySlug(slug) {
    if (!slug) return null;
    const response = await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      [Query.equal("slug", slug)]
    );
    return response.documents[0] || null;
  }


  // ---------- FILES ----------
async uploadFile(file) {
  if (!file) return null;

  
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Only JPG, PNG, GIF, WEBP images are allowed");
  }

  //  FILE UPLOAD
  return await this.storage.createFile(
    conf.appwriteBucketId,
    ID.unique(),
    file
  );
}


  getFilePreview(fileId) {
    if (!fileId) return "/no-image.png";
    try {
      return this.storage.getFilePreview(conf.appwriteBucketId, fileId);
    } catch (err) {
      console.error("Error getting file preview:", err);
      return "/no-image.png";
    }
  }

  getFileView(fileId) {
    if (!fileId) return "/no-image.png";
    try {
      return this.storage.getFileView(conf.appwriteBucketId, fileId);
    } catch (err) {
      console.error("Error getting file view:", err);
      return "/no-image.png";
    }
  }
}

const appwriteService = new AppwriteService();
export default appwriteService;
export const client = appwriteService.client;
export const storage = appwriteService.storage;
