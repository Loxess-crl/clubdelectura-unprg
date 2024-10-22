import { addComment } from "@/hooks/useComments";
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
  const likesCount = Object.values(comment.likes).filter(Boolean).length;
  const dislikesCount = Object.values(comment.dislikes).filter(Boolean).length;

  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [localLikes, setLocalLikes] = useState(likesCount);
  const [localDislikes, setLocalDislikes] = useState(dislikesCount);
  const [subComments, setSubComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (comment.comments) {
      setSubComments(Object.values(comment.comments));
    }
  }, [comment.comments]);

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
      setSubComments((prevComments) => [...prevComments, newSubcomment]);

      addComment(bookId.toString(), newSubcomment, [
        ...parentsId,
        comment.id.toString(),
      ]);
      setReplyContent("");
      setIsReplying(false);
    }
  };

  const handleLike = () => {
    setLocalLikes((prevLikes) => prevLikes + 1);
  };

  const handleDislike = () => {
    setLocalDislikes((prevDislikes) => prevDislikes + 1);
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
              onClick={handleLike}
              className="flex items-center text-sm text-gray-500 hover:text-blue-500 transition-colors duration-200"
            >
              <ThumbsUp className="w-4 h-4 mr-1" />
              <span className="transition-transform duration-200 hover:scale-110">
                {localLikes}
              </span>
            </button>
            <button
              onClick={handleDislike}
              className="flex items-center text-sm text-gray-500 hover:text-red-500 transition-colors duration-200"
            >
              <ThumbsDown className="w-4 h-4 mr-1" />
              <span className="transition-transform duration-200 hover:scale-110">
                {localDislikes}
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
