import { useState } from "react";
import { useDispatch } from "react-redux";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { setUser } from "../features/authSlice";

export default function GoogleLogin() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      if (firebaseUser) {
        dispatch(
          setUser({
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
          })
        );
      }
    } catch (error) {
      console.error("Google login failed:", error);
      alert("Failed to sign in with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={login}
      disabled={loading}
      className={`px-4 py-2 rounded text-white transition ${
        loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
      }`}
    >
      {loading ? "Signing in..." : "Sign in with Google"}
    </button>
  );
}
