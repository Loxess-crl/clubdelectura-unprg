import React, { useState } from "react";
import CommentCard from "./ui/Comment";
import { addComment, useComments } from "@/hooks/useComments";
import { isUserLoggedIn } from "@/hooks/useAuth";

import { Button } from "./ui/shadcn/Button";
import LoginModal from "./ui/LoginModal";

export default function CommentSection({ bookId }: { bookId: number }) {
  const comments = useComments(bookId);

  const [newComment, setNewComment] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const isLoggedIn = isUserLoggedIn();

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(bookId.toString(), {
        id: "",
        text: newComment,
        likes: {},
        dislikes: {},
        createdAt: new Date().getTime(),
        userName: localStorage.getItem("userName") ?? "User",
        userAvatar: localStorage.getItem("userAvatar") ?? "",
        comments: [],
      });
    }
    setNewComment("");
  };

  return (
    <div className="mx-auto p-12">
      <h2 className="text-2xl font-bold mb-4">Comentarios</h2>
      {isLoggedIn ? (
        <div className="mb-6 animate-slideDown">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-3 border rounded-md transition-shadow duration-200 focus:ring-2 focus:ring-blue-300"
            placeholder="Escribe tu comentario..."
          />
          <button
            onClick={handleAddComment}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            Añadir comentario
          </button>
        </div>
      ) : (
        <div className="py-8">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition-colors duration-200"
          >
            Inicia sesión para comentar
          </Button>
          <LoginModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
            }}
          />
        </div>
      )}
      <div>
        {comments ? (
          comments.length > 0 ? (
            comments.map((comment, index) => (
              <CommentCard key={index} comment={comment} bookId={bookId} />
            ))
          ) : (
            <p>No hay comentarios todavía</p>
          )
        ) : (
          <p>Cargando comentarios...</p>
        )}
      </div>
    </div>
  );
}
