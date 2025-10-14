import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { getItemsFromLocalStorage } from "@/hooks/localStorageService";
import type { User as IUser } from "@/interfaces/user.interface";
import { LocalStorageKeys } from "@/data/constants";
import LoginModal from "./ui/LoginModal";
import { rateBook } from "@/services/book.service";

const PawRatingDisplay = ({
  rating = 0,
  totalRatings = 0,
  pawImageUrl = "/assets/img/club2.png",
}) => {
  const fullPaws = Math.floor(rating);
  const hasHalfPaw = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((index) => {
          let pawClass = "filter grayscale opacity-40";

          if (index <= fullPaws) {
            pawClass = "filter-none brightness-100";
          } else if (index === fullPaws + 1 && hasHalfPaw) {
            pawClass = "filter-none brightness-100 opacity-60";
          }

          return (
            <img
              key={index}
              src={pawImageUrl}
              alt={`Rating ${index}`}
              className={`w-10 h-10 transition-all duration-200 ${pawClass}`}
            />
          );
        })}
      </div>

      <div className="text-sm text-gray-600">
        <span className="font-semibold text-gray-900">{rating.toFixed(1)}</span>
        {totalRatings > 0 && (
          <span className="ml-1">
            ({totalRatings}{" "}
            {totalRatings === 1 ? "calificación" : "calificaciones"})
          </span>
        )}
      </div>
    </div>
  );
};

interface PawRatingInteractiveProps {
  currentRating?: number;
  onRate?: (rating: number) => void;
  disabled?: boolean;
  pawImageUrl?: string;
}

// Componente interactivo para calificar
const PawRatingInteractive = ({
  currentRating = 0,
  onRate,
  disabled = false,
  pawImageUrl = "/assets/img/club2.png",
}: PawRatingInteractiveProps) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(currentRating);

  const handlePawClick = (rating: number) => {
    if (disabled) return;
    setSelectedRating(rating);
  };

  const handleVote = () => {
    if (selectedRating > 0 && onRate) {
      onRate(selectedRating);
    }
  };

  const getDisplayRating = () => {
    if (hoveredRating > 0) return hoveredRating;
    return selectedRating;
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((rating) => {
          const isActive = rating <= getDisplayRating();

          return (
            <button
              key={rating}
              type="button"
              onClick={() => handlePawClick(rating)}
              onMouseEnter={() => !disabled && setHoveredRating(rating)}
              onMouseLeave={() => !disabled && setHoveredRating(0)}
              disabled={disabled}
              className={`
                relative transition-all duration-200 transform hover:scale-110
                ${disabled ? "cursor-default" : "cursor-pointer"}
                ${isActive ? "drop-shadow-md" : ""}
              `}
            >
              <img
                src={pawImageUrl}
                alt={`${rating} paw${rating > 1 ? "s" : ""}`}
                className={`
                  w-10 h-10 transition-all duration-200
                  ${
                    isActive
                      ? "filter-none brightness-100"
                      : "filter grayscale opacity-40"
                  }
                `}
              />
            </button>
          );
        })}
      </div>

      <button
        onClick={handleVote}
        disabled={selectedRating === 0 || disabled}
        className={`
          px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
          ${
            selectedRating === 0 || disabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 shadow-md hover:shadow-lg"
          }
        `}
      >
        Votar
      </button>
    </div>
  );
};

interface BookRatingProps {
  bookSlug: string;
  initialRating?: number;
  initialTotalRatings?: number;
  userRating?: number;
  pawImageUrl?: string;
  ratings?: {
    [userId: string]: number;
  };
}
// Componente principal que maneja todo el sistema de rating
const BookRating = ({
  bookSlug,
  initialRating = 0,
  initialTotalRatings = 0,
  userRating = 0,
  pawImageUrl = "/assets/img/club2.png",
  ratings,
}: BookRatingProps) => {
  const [user, setUser] = useState<IUser>();
  const [currentRating, setCurrentRating] = useState(initialRating);
  const [totalRatings, setTotalRatings] = useState(initialTotalRatings);
  const [currentUserRating, setCurrentUserRating] = useState(userRating);
  const [hasVoted, setHasVoted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const userData = getItemsFromLocalStorage<IUser>(LocalStorageKeys.user);
    setUser(userData);
    const userRating = ratings ? ratings[userData?.id || ""] || 0 : 0;
    setHasVoted(userRating > 0);
    setCurrentUserRating(userRating);
  }, [ratings]);
  useEffect(() => {
    setCurrentRating(initialRating);
    setTotalRatings(initialTotalRatings);
  }, [initialRating, initialTotalRatings]);

  const handleRate = async (rating: number) => {
    if (!user) {
      setIsModalOpen(true);
      return;
    }
    await rateBook(bookSlug, user.id, rating);

    setCurrentUserRating(rating);
    setHasVoted(true);

    const isNewRating = currentUserRating === 0;
    const newTotal = isNewRating ? totalRatings + 1 : totalRatings;
    const oldContribution = isNewRating ? 0 : currentUserRating;
    const newAverage =
      (currentRating * totalRatings - oldContribution + rating) / newTotal;

    setCurrentRating(newAverage);
    setTotalRatings(newTotal);
  };

  const handleLoginPrompt = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Rating del Libro
        </h2>
        <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/50">
          <PawRatingDisplay
            rating={currentRating}
            totalRatings={totalRatings}
            pawImageUrl={pawImageUrl}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Tu Calificación</h3>

        {user ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 flex-shrink-0">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                    {user.displayName?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="mb-2">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {user.displayName}
                  </p>
                  {hasVoted && (
                    <p className="text-xs text-green-600">
                      Ya has calificado este libro con {currentUserRating}{" "}
                      patita
                      {currentUserRating > 1 ? "s" : ""}
                    </p>
                  )}
                </div>

                <PawRatingInteractive
                  currentRating={currentUserRating}
                  onRate={handleRate}
                  disabled={false}
                  pawImageUrl={pawImageUrl}
                />

                {hasVoted && (
                  <p className="text-xs text-gray-500 mt-2">
                    Puedes cambiar tu calificación en cualquier momento
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-8 text-center">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                <Star className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Califica este libro
              </h3>
              <p className="text-gray-600 mb-6">
                Inicia sesión para compartir tu opinión y ayudar a otros
                lectores
              </p>
            </div>

            <button
              onClick={handleLoginPrompt}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Iniciar sesión para calificar
            </button>
          </div>
        )}
      </div>
      <LoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        action="votar"
      />
    </div>
  );
};

export default BookRating;
