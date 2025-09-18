import BlogDetails from "@/app/components/client/BlogDetails";
import { getBlogById } from "@/utils/blogApi";

const BlogDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const blog = await getBlogById(id);

  return (
    <main>
      <BlogDetails blog={blog} />
    </main>
  );
};

export default BlogDetailPage;
