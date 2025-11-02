import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../app/store";
import { clearUser } from "../features/authSlice";
import GoogleLogin from "./GoogleLogin";

export default function UserMenu() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearUser());
  };

  if (!user) return <GoogleLogin />; 

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Profile picture */}
      {user.photoURL && (
        <img
          src={user.photoURL}
          alt={user.displayName || "User"}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
        />
      )}

      <span className="truncate max-w-[100px] sm:max-w-[150px] text-white text-sm sm:text-base">
        {user.displayName || user.email}
      </span>

      <button
        onClick={handleLogout}
        className="px-2 py-1 sm:px-3 sm:py-1.5 bg-red-500 rounded text-xs sm:text-sm text-white hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
}
