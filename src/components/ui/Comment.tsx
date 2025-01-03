import { addComment, updateLikesDislikes } from "@/hooks/useComments";
import type { Comment } from "@/interfaces/comment.interface";
import { getRelativeTime } from "@/utils/functions";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import LoginModal from "./LoginModal";
import { Avatar, AvatarFallback, AvatarImage } from "./shadcn/Avatar";
import { getItemsFromLocalStorage } from "@/hooks/localStorageService";
import type { User } from "@/interfaces/user.interface";
import { LocalStorageKeys } from "@/data/constants";

export default function CommentCard({
  comment,
  bookId,
  parentsId = [],
}: {
  comment: Comment;
  bookId: string;
  parentsId?: string[];
}) {
  const user = getItemsFromLocalStorage<User>(LocalStorageKeys.user);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const likes = Object.entries(comment.likes);
  const likesCount = likes.filter(([, value]) => value).length;
  const dislikes = Object.entries(comment.dislikes);
  const dislikesCount = dislikes.filter(([, value]) => value).length;

  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const subComments = comment.comments ? Object.values(comment.comments) : [];

  const handleReply = () => {
    if (!user) {
      setIsModalOpen(true);
      return;
    }
    if (replyContent.trim()) {
      const newSubcomment = {
        id: "",
        text: replyContent,
        likes: {},
        dislikes: {},
        createdAt: new Date().getTime(),
        userName: user.displayName,
        userAvatar: user.avatarUrl ?? "",
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
    if (!user) return;
    updateLikesDislikes(bookId.toString(), comment.id, user.id, isLike, [
      ...parentsId,
    ]);
  };

  return (
    <div className="mb-4 animate-fadeInComment">
      <div className="flex items-start space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={comment.userAvatar} alt={comment.userName} />
          <AvatarFallback>{comment.userName[0]}</AvatarFallback>
        </Avatar>
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
                likes.find(([key]) => key === user?.id)
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
                dislikes.find(([key]) => key === user?.id)
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
      <LoginModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        action="responder"
      />
    </div>
  );
}
