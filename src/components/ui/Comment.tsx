import { addComment, updateLikesDislikes } from "@/hooks/useComments";
import type { Comment } from "@/interfaces/comment.interface";
import { getRelativeTime } from "@/utils/functions";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function CommentCard({
  comment,
  bookId,
  parentsId = [],
}: {
  comment: Comment;
  bookId: number;
  parentsId?: string[];
}) {
  const userId = localStorage.getItem("userId") ?? "";

  const likes = Object.entries(comment.likes);
  const likesCount = likes.filter(([, value]) => value).length;
  const dislikes = Object.entries(comment.dislikes);
  const dislikesCount = dislikes.filter(([, value]) => value).length;

  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const subComments = comment.comments ? Object.values(comment.comments) : [];

  const handleReply = () => {
    if (replyContent.trim()) {
      const newSubcomment = {
        id: "",
        text: replyContent,
        likes: {},
        dislikes: {},
        createdAt: new Date().getTime(),
        userName: localStorage.getItem("userName") ?? "User",
        userAvatar: localStorage.getItem("userAvatar") ?? "",
      };

      addComment(bookId.toString(), newSubcomment, [
        ...parentsId,
        comment.id.toString(),
      ]);
      setReplyContent("");
      setIsReplying(false);
    }
  };

  const handleLike = (isLike = true) => {
    updateLikesDislikes(bookId.toString(), comment.id, userId, isLike, [
      ...parentsId,
    ]);
  };

  return (
    <div className="mb-4 animate-fadeInComment">
      <div className="flex items-start space-x-3">
        <img
          src={comment.userAvatar}
          alt={comment.userName}
          className="w-10 h-10 rounded-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="font-semibold">{comment.userName}</h4>
            <span className="text-sm text-gray-500 flex items-center">
              {getRelativeTime(comment.createdAt)}
            </span>
          </div>
          <p className="mt-1 text-gray-600">{comment.text}</p>
          <div className="mt-2 flex items-center space-x-4">
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="text-sm text-blue-500 hover:text-blue-600 transition-colors duration-200"
            >
              {isReplying ? "Cancelar" : "Responder"}
            </button>
            <button
              onClick={() => handleLike()}
              className={`flex items-center text-sm transition-colors duration-200 ${
                likes.find(([key]) => key === userId)
                  ? "text-blue-500"
                  : "text-gray-500 hover:text-blue-500"
              }`}
            >
              <ThumbsUp className="w-4 h-4 mr-1" />
              <span className="transition-transform duration-200 hover:scale-110">
                {likesCount}
              </span>
            </button>
            <button
              onClick={() => handleLike(false)}
              className={`flex items-center text-sm transition-colors duration-200 ${
                dislikes.find(([key]) => key === userId)
                  ? "text-red-500"
                  : "text-gray-500 hover:text-red-500"
              }`}
            >
              <ThumbsDown className="w-4 h-4 mr-1" />
              <span className="transition-transform duration-200 hover:scale-110">
                {dislikesCount}
              </span>
            </button>
          </div>
          {isReplying && (
            <div className="mt-2 animate-slideDown">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full p-2 border rounded-md transition-shadow duration-200 focus:ring-2 focus:ring-blue-300"
                placeholder="Escribe tu respuesta..."
              />
              <button
                onClick={handleReply}
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
              >
                Enviar respuesta
              </button>
            </div>
          )}
        </div>
      </div>
      {subComments && (
        <div className="ml-12 mt-4">
          {subComments.map((reply, index) => (
            <CommentCard
              key={index}
              comment={reply}
              bookId={bookId}
              parentsId={[...parentsId, comment.id.toString()]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
