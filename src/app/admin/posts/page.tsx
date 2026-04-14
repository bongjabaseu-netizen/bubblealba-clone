import { getAdminPosts } from "@/lib/actions/admin";
import { PostsClient } from "./PostsClient";

export default async function AdminPostsPage() {
  const posts = await getAdminPosts();
  return <PostsClient posts={posts} />;
}
