import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();
const auth = getAuth();

export const handleLogin = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      localStorage.setItem("userName", user.displayName || "");
      localStorage.setItem("userAvatar", user.photoURL || "");
      localStorage.setItem("userId", user.uid);
    })
    .catch((error) => {
      console.error("Error en el login: ", error);
    });
};
