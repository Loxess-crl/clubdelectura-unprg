import React, { useState } from "react";
import CommentCard from "./ui/Comment";
import { addComment, useCommentsWithUser } from "@/hooks/useComments";
import { Button } from "./ui/shadcn/button";
import LoginModal from "./ui/LoginModal";
import { getItemsFromLocalStorage } from "@/hooks/localStorageService";
import { LocalStorageKeys } from "@/data/constants";
import type { User } from "@/interfaces/user.interface";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/shadcn/avatar";
import {
  MessageCircle,
  Send,
  Users,
  Filter,
  MessageSquare,
} from "lucide-react";

export default function CommentSection({ bookId }: { bookId: string }) {
  const { comments, loading } = useCommentsWithUser(bookId);
  const [newComment, setNewComment] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent");
  const [showFilters, setShowFilters] = useState(false);

  const user = getItemsFromLocalStorage<User>(LocalStorageKeys.user);

  const handleAddComment = () => {
    if (!user) {
      setIsModalOpen(true);
      return;
    }
    if (newComment.trim()) {
      addComment(bookId.toString(), {
        id: "",
        text: newComment,
        likes: {},
        dislikes: {},
        createdAt: new Date().getTime(),
        userId: user.id,
        comments: [],
      });
      setNewComment("");
    }
  };

  const sortedComments = React.useMemo(() => {
    if (!comments) return [];

    const sorted = [...comments].sort((a, b) => {
      if (sortBy === "recent") {
        return b.createdAt - a.createdAt;
      } else {
        // Sort by popularity (likes count)
        const aLikes = Object.values(a.likes || {}).filter(Boolean).length;
        const bLikes = Object.values(b.likes || {}).filter(Boolean).length;
        return bLikes - aLikes;
      }
    });

    return sorted;
  }, [comments, sortBy]);

  const totalComments = comments?.length || 0;
  const totalReplies =
    comments?.reduce((acc, comment) => {
      return (
        acc + (comment.comments ? Object.keys(comment.comments).length : 0)
      );
    }, 0) || 0;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleAddComment();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6 flex-wrap space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Comentarios</h2>
            </div>
            <div className="flex items-center flex-wrap space-x-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                {totalComments} comentario{totalComments !== 1 ? "s" : ""}
              </span>
              {totalReplies > 0 && (
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {totalReplies} respuesta{totalReplies !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>

          {/* Sort and Filter Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filtros
            </button>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "recent" | "popular")
              }
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="recent">Más recientes</option>
              <option value="popular">Más populares</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
      </div>

      {/* Comment Input Section */}
      <div className="mb-8">
        {user ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-start space-x-4">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={user.avatarUrl} alt={user.displayName} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {user.displayName?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="mb-2">
                  <p className="text-sm font-medium text-gray-900">
                    {user.displayName}
                  </p>
                </div>

                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="w-full p-4 border border-gray-300 rounded-xl resize-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px] placeholder-gray-400"
                  placeholder="Comparte tu opinión sobre este libro..."
                />

                <div className="flex items-center justify-between mt-4">
                  <p className="text-xs text-gray-500">
                    Presiona Cmd/Ctrl + Enter para enviar
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {newComment.length}/1000
                    </span>
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                    >
                      <Send className="w-4 h-4" />
                      Comentar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-8 text-center">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <MessageCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Únete a la conversación
              </h3>
              <p className="text-gray-600 mb-6">
                Inicia sesión para compartir tu opinión y conectar con otros
                lectores
              </p>
            </div>

            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Iniciar sesión para comentar
            </Button>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/6 mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : sortedComments.length > 0 ? (
          <div className="space-y-4">
            {sortedComments.map((comment, index) => (
              <CommentCard
                key={`${comment.id}-${index}`}
                comment={comment}
                bookId={bookId}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay comentarios todavía
            </h3>
            <p className="text-gray-500">
              Sé el primero en compartir tu opinión sobre este libro
            </p>
          </div>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        action="comentar"
      />
    </div>
  );
}
