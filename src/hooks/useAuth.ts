import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();
const auth = getAuth();

export const handleLogin = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      // Guardar nombre y avatar en localStorage
      localStorage.setItem("userName", user.displayName || "");
      localStorage.setItem("userAvatar", user.photoURL || "");
      // Puedes guardar el UID o email si necesitas más autenticación
      localStorage.setItem("userId", user.uid);
    })
    .catch((error) => {
      console.error("Error en el login: ", error);
    });
};

export const isUserLoggedIn = () => {
  return (
    localStorage.getItem("userName") !== null &&
    localStorage.getItem("userAvatar") !== null
  );
};
