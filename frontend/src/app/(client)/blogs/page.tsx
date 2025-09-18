import Blogs from "@/app/components/client/Blogs";
import { getAllBlogs } from "@/utils/blogApi";

const BlogsPage = async () => {
  const blogs = await getAllBlogs();
  // lọc blog đã publish
  const publishedBlogs = blogs.filter((b: any) => b.isPublished);
  return (
    <main>
      <Blogs allBlogs={publishedBlogs} />
    </main>
  );
};

export default BlogsPage;
