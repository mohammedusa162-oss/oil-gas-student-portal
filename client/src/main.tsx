import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// تسجيل خدمة العملان ليعمل التطبيق دون إنترنت بعد أول زيارة.
// يُستثنى التطبيق الأصلي (Android/Capacitor) لأن الأصول مُحزمة محلياً أصلاً ولا حاجة لنسخة مخزّنة.
const base = import.meta.env.BASE_URL || "/";
const isNative = Boolean(
  (window as Window & { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor?.isNativePlatform?.(),
);

if ("serviceWorker" in navigator && !isNative) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${base}sw.js`, { scope: base }).catch(() => {
      /* التسجيل اختياري: التطبيق يعمل وبدونه، فقط يفقد العمل دون إنترنت */
    });
  });
}
