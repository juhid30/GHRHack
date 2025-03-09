import { useEffect } from "react";

const YogaRedirect = () => {
  useEffect(() => {
    window.location.href = "http://localhost:3000/start";
  }, []);

  return null; // No UI to render
};
export default YogaRedirect;
