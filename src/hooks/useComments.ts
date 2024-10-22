import { database } from "@/firebase/cient";
import type { Comment } from "@/interfaces/comment.interface";
import firebase from "firebase/compat/app";
import { onValue, push, ref, update } from "firebase/database";
import { useEffect, useState } from "react";

export const useComments = (bookId: number) => {
  const [comments, setComments] = useState<Comment[]>();

  useEffect(() => {
    const commentsRef = ref(database, `books/${bookId}/comments`);

    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const data = snapshot.val() as Record<string, Comment> | null;
      const comments = data ? Object.values(data) : [];
      setComments(comments);
    });

    return () => unsubscribe();
  }, [bookId]);

  return comments;
};

const getCommentRef = (
  bookId: string,
  parentCommentIds: string[],
  newCommentId: string
) => {
  let commentRefString = `books/${bookId}/comments`;

  parentCommentIds.forEach((commentId) => {
    commentRefString += `/${commentId}/comments`;
  });

  commentRefString += `/${newCommentId}`;

  return ref(database, commentRefString);
};

export const addComment = (
  bookId: string,
  newComment: Comment,
  parentCommentIds: string[] = []
) => {
  const commentId = generateCommentId();

  const newCommentRef = getCommentRef(bookId, parentCommentIds, commentId);

  const commentData = {
    ...newComment,
    id: commentId,
    likes: 0,
    dislikes: 0,
    comments: {},
  };

  update(newCommentRef, commentData)
    .then(() => {
      console.log("Comentario agregado con éxito");
    })
    .catch((error) => {
      console.error("Error al agregar comentario:", error);
    });
};

function generateCommentId(): string {
  return `comment_${new Date().getTime()}_${Math.floor(Math.random() * 1000)}`;
}
