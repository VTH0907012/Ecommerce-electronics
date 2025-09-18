import BlogDetails from "@/app/components/client/BlogDetails";
import { getBlogById } from "@/utils/blogApi";

type BlogDetailPageProps = {
  params: { id: string };
};

const BlogDetailPage = async ({ params }: BlogDetailPageProps) => {
  const blog = await getBlogById(params.id);

  return (
    <main>
      <BlogDetails blog={blog} />
    </main>
  );
};

export default BlogDetailPage;
