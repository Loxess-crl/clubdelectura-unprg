import { addComment, updateLikesDislikes } from "@/hooks/useComments";
import type { Comment, CommentWithUser } from "@/interfaces/comment.interface";
import { getRelativeTime } from "@/utils/functions";
import {
  ThumbsDown,
  ThumbsUp,
  MessageCircle,
  MoreHorizontal,
  Heart,
  Reply,
  Clock,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import LoginModal from "./LoginModal";
import { Avatar, AvatarFallback, AvatarImage } from "./shadcn/Avatar";
import { getItemsFromLocalStorage } from "@/hooks/localStorageService";
import type { User } from "@/interfaces/user.interface";
import { LocalStorageKeys } from "@/data/constants";
import "@/styles/comments.css";

export default function CommentCard({
  comment,
  bookId,
  parentsId = [],
}: {
  comment: CommentWithUser;
  bookId: string;
  parentsId?: string[];
}) {
  const user = getItemsFromLocalStorage<User>(LocalStorageKeys.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showActions, setShowActions] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const likes = Object.entries(comment.likes);
  const likesCount = likes.filter(([, value]) => value).length;
  const dislikes = Object.entries(comment.dislikes);
  const dislikesCount = dislikes.filter(([, value]) => value).length;
  const subComments = comment.comments ? Object.values(comment.comments) : [];

  useEffect(() => {
    if (user) {
      setIsLiked(likes.some(([key]) => key === user.id));
      setIsDisliked(dislikes.some(([key]) => key === user.id));
    }
  }, [user, likes, dislikes]);

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
        userId: user.id,
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
    if (!user) {
      setIsModalOpen(true);
      return;
    }
    updateLikesDislikes(bookId.toString(), comment.id, user.id, isLike, [
      ...parentsId,
    ]);
  };

  const isReply = parentsId.length > 0;

  return (
    <div
      className={`group relative ${isReply ? "ml-4 border-l-2 border-gray-100 pl-4" : ""}`}
    >
      {/* Main comment container */}
      <div className="relative bg-white rounded-2xl border border-gray-100 p-4 mb-4 transition-all duration-300 hover:shadow-lg hover:border-gray-200">
        {/* Hover background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-transparent to-purple-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

        <div className="relative flex items-start space-x-4">
          <div className="relative flex-shrink-0">
            <Avatar className="h-11 w-11 border-2 border-white shadow-sm">
              <AvatarImage
                src={comment.user.avatarUrl}
                alt={comment.user.displayName}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {comment.user.displayName[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Comment content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors">
                  {comment.user.displayName}
                </h4>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {getRelativeTime(comment.createdAt)}
                </span>
                {!isReply && (
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full font-medium">
                    Top comment
                  </span>
                )}
              </div>
            </div>

            {/* Comment text */}
            <div className="mb-3">
              <p className="text-gray-700 leading-relaxed text-sm">
                {comment.text}
              </p>
            </div>

            {/* Actions bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                {/* Like button */}
                <button
                  onClick={() => handleLike()}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all duration-200 ${
                    isLiked
                      ? "bg-blue-100 text-blue-600 shadow-sm"
                      : "text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  <ThumbsUp
                    className={`w-4 h-4 ${isLiked ? "fill-current " : ""}`}
                  />
                  <span className="text-sm font-medium">{likesCount}</span>
                </button>

                {/* Dislike button */}
                <button
                  onClick={() => handleLike(false)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all duration-200 ${
                    isDisliked
                      ? "bg-red-100 text-red-600 shadow-sm"
                      : "text-gray-500 hover:bg-red-50 hover:text-red-600"
                  }`}
                >
                  <ThumbsDown
                    className={`w-4 h-4 ${isDisliked ? "fill-current" : ""}`}
                  />
                  <span className="text-sm font-medium">{dislikesCount}</span>
                </button>

                {/* Reply button */}
                <button
                  onClick={() => setIsReplying(!isReplying)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all duration-200 ${
                    isReplying
                      ? "bg-green-100 text-green-600 shadow-sm"
                      : "text-gray-500 hover:bg-green-50 hover:text-green-600"
                  }`}
                >
                  <Reply className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {isReplying ? "Cancelar" : "Responder"}
                  </span>
                </button>
              </div>

              {/* Reply count */}
              {subComments.length > 0 && (
                <div className="flex items-center space-x-1 text-gray-500">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">
                    {subComments.length}{" "}
                    {subComments.length === 1 ? "respuesta" : "respuestas"}
                  </span>
                </div>
              )}
            </div>

            {/* Reply form */}
            {isReplying && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 animate-slideDown">
                <div className="flex space-x-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage
                      src={user?.avatarUrl}
                      alt={user?.displayName}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 text-white text-sm">
                      {user?.displayName?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Escribe tu respuesta..."
                      rows={3}
                    />
                    <div className="flex justify-end space-x-2 mt-3">
                      <button
                        onClick={() => setIsReplying(false)}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleReply}
                        disabled={!replyContent.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        Enviar respuesta
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sub-comments */}
      {subComments.length > 0 && (
        <div className="space-y-2">
          {subComments.map((reply, index) => (
            <CommentCard
              key={`${reply.id}-${index}`}
              comment={reply}
              bookId={bookId}
              parentsId={[...parentsId, comment.id.toString()]}
            />
          ))}
        </div>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        action="responder"
      />
    </div>
  );
}
