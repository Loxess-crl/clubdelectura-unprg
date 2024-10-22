import { database } from "@/firebase/cient";
import type { Comment } from "@/interfaces/comment.interface";
import firebase from "firebase/compat/app";
import { get, onValue, push, ref, update } from "firebase/database";
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
  commentId: string
) => {
  let commentRefString = `books/${bookId}/comments`;

  parentCommentIds.forEach((commentId) => {
    commentRefString += `/${commentId}/comments`;
  });

  commentRefString += `/${commentId}`;

  console.log("commentRefString", commentRefString);

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

export const updateLikesDislikes = (
  bookId: string,
  commentId: string,
  userId: string,
  isLike: boolean,
  parentsId: string[] = []
) => {
  const commentRef = getCommentRef(bookId, parentsId, commentId);

  get(commentRef).then((snapshot) => {
    const commentData = snapshot.val();

    if (commentData) {
      const updatedLikes = { ...commentData.likes };
      const updatedDislikes = { ...commentData.dislikes };

      if (isLike) {
        if (updatedDislikes[userId]) {
          delete updatedDislikes[userId];
        }
        if (updatedLikes[userId]) {
          delete updatedLikes[userId];
        } else {
          updatedLikes[userId] = true;
        }
      } else {
        if (updatedLikes[userId]) {
          delete updatedLikes[userId];
        }
        if (updatedDislikes[userId]) {
          delete updatedDislikes[userId];
        } else {
          updatedDislikes[userId] = true;
        }
      }

      update(commentRef, {
        likes: Object.values(updatedLikes).length > 0 ? updatedLikes : 0,
        dislikes:
          Object.values(updatedDislikes).length > 0 ? updatedDislikes : 0,
      })
        .then(() => {
          console.log("Likes/Dislikes actualizados correctamente");
        })
        .catch((error) => {
          console.error("Error al actualizar likes/dislikes:", error);
        });
    }
  });
};
