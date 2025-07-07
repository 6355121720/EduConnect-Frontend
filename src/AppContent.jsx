// AppContent.jsx
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { autoLogin } from "./api/authApi";
import { login } from "./store/slices/authSlice";
import AppRouter from "./routes/routes";

const AppContent = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await autoLogin();
        if (res.data.user) {
          dispatch(login(res.data.user));
        }
        console.log("Auto Login ", res)
      } catch (e) {
        console.error("Auto login failed:", e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [dispatch]);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return <AppRouter />;
};

export default AppContent;


