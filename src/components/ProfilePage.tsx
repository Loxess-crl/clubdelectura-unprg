import { useState } from "react";
import { Loader2, X } from "lucide-react";
import type { User as IUser } from "@/interfaces/user.interface";
import {
  getItemsFromLocalStorage,
  setLocalStorageItem,
} from "@/hooks/localStorageService";
import { LocalStorageKeys } from "@/data/constants";
import { Avatar, AvatarFallback } from "./ui/shadcn/avatar";
import { updateUser } from "@/hooks/useUser";
import { useToast } from "@/hooks/useToast";

const presetAvatars = [
  "https://firebasestorage.googleapis.com/v0/b/club-de-lectura-unprg.appspot.com/o/presets%2Fclub.png?alt=media&token=f023ccf8-1c70-40ba-b722-7f7bea3c5952",
  "https://firebasestorage.googleapis.com/v0/b/club-de-lectura-unprg.appspot.com/o/presets%2Fclub2.png?alt=media&token=0dedd68a-19cc-450e-800b-89c60b096157",
  "https://firebasestorage.googleapis.com/v0/b/club-de-lectura-unprg.appspot.com/o/presets%2Fclub3.png?alt=media&token=e31786fa-6418-42a3-bfd6-3dd60d2b7149",
  "https://firebasestorage.googleapis.com/v0/b/club-de-lectura-unprg.appspot.com/o/presets%2Fclub4.png?alt=media&token=f003c674-aa98-458f-a3cc-f7b8593a23f6",
  "https://firebasestorage.googleapis.com/v0/b/club-de-lectura-unprg.appspot.com/o/presets%2Fclub5.png?alt=media&token=482ac279-9779-4d8c-b604-a67682b65073",
  "https://firebasestorage.googleapis.com/v0/b/club-de-lectura-unprg.appspot.com/o/presets%2Fclub6.png?alt=media&token=f15a7dbb-a134-49d6-99ee-76cb698312c7",
  "https://firebasestorage.googleapis.com/v0/b/club-de-lectura-unprg.appspot.com/o/presets%2Fclub7.png?alt=media&token=a2f93503-5b2c-480e-9529-a49ee64b0bec",
  "https://firebasestorage.googleapis.com/v0/b/club-de-lectura-unprg.appspot.com/o/presets%2Fclub8.png?alt=media&token=5867ebc5-f772-43ef-aefc-02912b13d3a4",
];

const ProfilePage = () => {
  const user = getItemsFromLocalStorage<IUser>(LocalStorageKeys.user);
  if (!user)
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-surfaceTheme">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Mi Perfil
              </h1>
              <p className="text-lg text-gray-700">
                Inicia sesión para ver tu perfil.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  const [username, setUsername] = useState(user.displayName);
  const initialMode =
    !user.avatarUrl || user.avatarUrl === ""
      ? "none"
      : user.avatarUrl?.includes("presets")
        ? "preset"
        : "google";
  const [photoMode, setPhotoMode] = useState(initialMode);
  const selectPreset = user.avatarUrl?.includes("presets")
    ? presetAvatars.findIndex((avatar) => avatar === user.avatarUrl)
    : 0;
  const [selectedPreset, setSelectedPreset] = useState(selectPreset);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleUser = () => {
    if (loading) return;
    if (!username) {
      toast({
        title: "Nombre de usuario vacío",
        description: "Ingresa un nombre de usuario para continuar.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    const avatarUrl =
      photoMode === "preset"
        ? presetAvatars[selectedPreset]
        : photoMode === "none"
          ? ""
          : user.googlePhotoUrl;

    const updatedUser = { ...user, displayName: username, avatarUrl };
    updateUser(user.id, updatedUser)
      .then(() => {
        toast({
          title: "Perfil actualizado",
          description: "Tu perfil ha sido actualizado correctamente.",
        });
        setLocalStorageItem(LocalStorageKeys.user, updatedUser);
        // window.location.reload();
      })
      .catch((error) => {
        console.error("Error al actualizar el perfil: ", error);
        toast({
          title: "Error al actualizar",
          description: "Ocurrió un error al actualizar tu perfil.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderPhotoSection = () => {
    switch (photoMode) {
      case "google":
        return (
          <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100">
            <img
              src={user.googlePhotoUrl}
              alt="Google Profile"
              className="w-full h-full object-cover"
            />
          </div>
        );
      case "preset":
        return (
          <div className="flex flex-col items-center gap-5">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100">
              <img
                src={presetAvatars[selectedPreset]}
                alt="Preset Avatar"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {presetAvatars.map((avatar, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPreset(index)}
                  className={`relative w-16 h-16 rounded-full overflow-hidden transition-all ${
                    selectedPreset === index ? "ring-4 ring-primaryTheme" : ""
                  }`}
                >
                  <img
                    src={avatar}
                    alt={`Preset ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        );
      case "none":
        return (
          <div className="size-32 rounded-full bg-gray-100 flex items-center justify-center">
            <Avatar>
              <AvatarFallback className="text-gray-400 text-3xl">
                {user.displayName.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-bgTheme">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Mi Perfil</h1>

            <div className="space-y-12">
              <div className="flex flex-col items-center space-y-6">
                {renderPhotoSection()}

                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={() => setPhotoMode("google")}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      photoMode === "google"
                        ? "bg-primaryTheme text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-accentTheme hover:text-white"
                    }`}
                  >
                    Usar foto de Google
                  </button>
                  <button
                    onClick={() => setPhotoMode("preset")}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      photoMode === "preset"
                        ? "bg-primaryTheme text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-accentTheme hover:text-white"
                    }`}
                  >
                    Elegir avatar
                  </button>
                  <button
                    onClick={() => setPhotoMode("none")}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      photoMode === "none"
                        ? "bg-primaryTheme text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-accentTheme hover:text-white"
                    }`}
                  >
                    No mostrar foto
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Nombre de usuario
                </label>
                <div className="relative rounded-lg">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Tu nombre de usuario"
                  />
                  {username && (
                    <button
                      onClick={() => setUsername("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleUser}
                  disabled={loading}
                  className="px-8 py-3 bg-accentTheme text-white flex justify-center rounded-lg hover:bg-primaryTheme transition-colors shadow-lg hover:shadow-xl"
                >
                  {loading && <Loader2 className="w-6 h-6 animate-spin" />}
                  {loading ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
