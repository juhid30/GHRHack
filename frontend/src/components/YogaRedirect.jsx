import { useEffect } from "react";

const YogaRedirect = () => {
  useEffect(() => {
    window.location.href = "http://localhost:5174/start";
  }, []);

  return null; // No UI to render
};
export default YogaRedirect;
