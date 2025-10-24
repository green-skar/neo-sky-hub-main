import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize MSW in demo mode
async function initApp() {
  console.log('App initializing...');
  console.log('VITE_DEMO:', import.meta.env.VITE_DEMO);
  console.log('All env vars:', import.meta.env);
  
  // Force MSW initialization for now
  console.log('Force initializing MSW...');
  const { initMsw } = await import('./setup/msw');
  await initMsw();

  createRoot(document.getElementById("root")!).render(<App />);
}

initApp();
