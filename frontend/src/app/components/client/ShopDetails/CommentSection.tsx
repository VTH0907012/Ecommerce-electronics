"use client";
import { useEffect, useState } from "react";
import { Comment } from "@/type/Comment";
import {
  getCommentById,
  createComment,
  deleteComment,
} from "@/utils/commentApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux";
import Rating from "@/app/components/client/Rating";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import toast from "react-hot-toast";
import ConfirmDeleteModal from "../../Confirm";

interface CommentSectionProps {
  productId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ productId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const user = useSelector((state: RootState) => state.user.user);

  const fetchComments = async () => {
    try {
      const res = await getCommentById(productId);
      setComments(res);
    } catch (error) {
      console.error("Lỗi khi tải bình luận:", error);
    }
  };

  const handleSubmit = async () => {
    if (!user) return toast.error("Bạn cần đăng nhập để bình luận");
    if (!content.trim())
      return toast.error("Nội dung bình luận không được để trống");
    if (rating === 0) return toast.error("Vui lòng chọn số sao đánh giá");

    setIsSubmitting(true);
    try {
      const newComment = {
        content,
        rating,
      };

      await createComment(productId, newComment);
      setContent("");
      setRating(0);
      await fetchComments();
    } catch (error) {
      console.error("Lỗi khi gửi bình luận:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [commentdelete, setCommentDelete] = useState<string | null>(null);

  const confirmDelete = (idcomment: string) => {
    setCommentDelete(idcomment);
    setShowDeleteModal(true);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleDelete = async () => {
    // if (confirm("Bạn có chắc muốn xoá bình luận này?")) {
    //   try {
    //     await deleteComment(id);
    //     await fetchComments();
    //   } catch (error) {
    //     console.error("Lỗi khi xóa bình luận:", error);
    //   }
    // }
    if (!commentdelete) return;
    try {
      await deleteComment(commentdelete);
      toast.success("Xoá bình luận thành công");
      await fetchComments();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setShowDeleteModal(false);
    }
    setCommentDelete(null);
  };

  useEffect(() => {
    fetchComments();
  }, [productId]);

  const averageRating =
    comments.length > 0
      ? comments.reduce((sum, comment) => sum + (comment.rating || 0), 0) /
        comments.length
      : 0;

  const getAvatar = (name?: string) => {
    const letter = name?.charAt(0).toUpperCase() || "U";
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-pink-100 text-pink-800",
      "bg-orange-100 text-orange-800",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    return (
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${randomColor}`}
      >
        {letter}
      </div>
    );
  };

  return (
    <div className="mt-12 mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Đánh giá sản phẩm
      </h2>

      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 lg:w-3/4">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Tất cả đánh giá ({comments.length})
          </h3>

          {comments.length > 0 ? (
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-4">
              {" "}
              {comments.map((cmt) => (
                <div
                  key={cmt._id}
                  className="border-b border-gray-100 pb-4 last:border-0 last:pb-0 transition hover:bg-gray-50 -mx-2 px-2 py-1 rounded"
                >
                  <div className="flex items-start gap-4">
                    {getAvatar(cmt.user?.name)}

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {cmt.user?.name || "Người dùng"}
                          </h4>
                          <div className="flex items-center mt-1">
                            <Rating rating={cmt.rating || 0} />
                            <span className="ml-2 text-sm text-gray-500">
                              {formatDistanceToNow(new Date(cmt.createdAt), {
                                addSuffix: true,
                                locale: vi,
                              })}
                            </span>
                          </div>
                        </div>

                        {user &&
                          (user._id === cmt.user._id || user.isAdmin) && (
                            <button
                              onClick={() => confirmDelete(cmt._id)}
                              className="text-red-500 hover:text-red-700 transition cursor-pointer"
                              title="Xóa bình luận"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          )}
                      </div>

                      <p className="mt-2 text-gray-700 whitespace-pre-line">
                        {cmt.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <h4 className="mt-3 text-lg font-medium text-gray-700">
                Chưa có đánh giá nào
              </h4>
              <p className="mt-1 text-gray-500">
                Hãy là người đầu tiên đánh giá sản phẩm này
              </p>
            </div>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 lg:w-1/4">
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-gray-900 mb-1">
              {averageRating.toFixed(1)}
            </div>
            <Rating rating={averageRating} />
            <div className="text-gray-500 mt-2">{comments.length} đánh giá</div>
          </div>

          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = comments.filter((c) => c.rating === star).length;
              const percentage = (count / comments.length) * 100;

              return (
                <div key={star} className="flex items-center">
                  <span className="w-10 text-sm font-medium">{star} sao</span>
                  <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-yellow-400 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="w-10 text-sm text-gray-500">({count})</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          {user ? "Viết đánh giá của bạn" : "Đăng nhập để đánh giá"}
        </h3>

        {user ? (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đánh giá của bạn *
              </label>
              <div className="flex items-center ">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`text-2xl cursor-pointer ${
                      star <= (hoverRating || rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    ★
                  </button>
                ))}
                <span className="ml-3 text-sm text-gray-500 ">
                  {rating > 0 ? `${rating} sao` : "Vui lòng chọn"}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Nhập bình luận của bạn..."
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-6 py-2 rounded-md text-white font-medium  ${
                isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              } transition cursor-pointer`}
            >
              {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 mb-4">
              Vui lòng đăng nhập để chia sẻ đánh giá của bạn về sản phẩm
            </p>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
              Đăng nhập ngay
            </button>
          </div>
        )}
      </div>
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        content="Bạn có chắc chắn muốn xoá bình luận này?"
      />
    </div>
  );
};

export default CommentSection;
