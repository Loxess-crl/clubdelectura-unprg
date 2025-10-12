import { database } from "@/firebase/client";
import type { Comment, CommentWithUser } from "@/interfaces/comment.interface";
import { get, onValue, ref, update } from "firebase/database";
import { useEffect, useState } from "react";

const BASE_PATH = "comments";
const USERS_PATH = "users";

export const useComments = (slug: string) => {
  const [comments, setComments] = useState<Comment[]>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const commentsRef = ref(database, `${BASE_PATH}/${slug}`);

    onValue(commentsRef, (snapshot) => {
      const commentsData = snapshot.val();
      if (commentsData) {
        setComments(Object.values(commentsData));
      }

      setLoading(false);
    });
  }, [slug]);

  return { comments, loading };
};

export const useCommentsWithUser = (slug: string) => {
  const [comments, setComments] = useState<CommentWithUser[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const commentsRef = ref(database, `${BASE_PATH}/${slug}`);

    const unsubscribe = onValue(commentsRef, async (snapshot) => {
      const commentsData = snapshot.val();

      if (!commentsData) {
        setComments([]);
        setLoading(false);
        return;
      }

      const commentsArray: Comment[] = Object.values(commentsData);

      const userIds = [...new Set(commentsArray.map((c) => c.userId))];

      const userSnapshots = await Promise.all(
        userIds.map((id) => get(ref(database, `${USERS_PATH}/${id}`)))
      );

      const userMap = Object.fromEntries(
        userSnapshots.map((snap, i) => [userIds[i], snap.val()])
      );

      const enrichedComments: CommentWithUser[] = commentsArray.map(
        (comment) => ({
          ...comment,
          user: userMap[comment.userId] ?? { name: "Anónimo", avatar: "" },
        })
      );

      setComments(enrichedComments);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [slug]);

  return { comments, loading };
};

const getCommentRef = (
  slug: string,
  parentCommentIds: string[],
  commentId: string
) => {
  let commentRefString = `${BASE_PATH}/${slug}`;

  parentCommentIds.forEach((commentId) => {
    commentRefString += `/${commentId}/comments`;
  });

  commentRefString += `/${commentId}`;

  return ref(database, commentRefString);
};

export const addComment = (
  slug: string,
  newComment: Comment,
  parentCommentIds: string[] = []
) => {
  const commentId = generateCommentId();

  const newCommentRef = getCommentRef(slug, parentCommentIds, commentId);

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
  slug: string,
  commentId: string,
  userId: string,
  isLike: boolean,
  parentsId: string[] = []
) => {
  const commentRef = getCommentRef(slug, parentsId, commentId);

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
