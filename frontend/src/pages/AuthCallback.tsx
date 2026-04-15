import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setToken } from "../api/auth";

export function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setToken(token);
      navigate("/", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF4ED]">
      <p className="text-[#6B5E57]">Signing you in…</p>
    </div>
  );
}
