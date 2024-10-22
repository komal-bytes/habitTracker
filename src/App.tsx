import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import DefaultLayout from "@/layouts/default";
import Home from "./pages/Home";
import Daily from "./pages/Daily";
import Habits from "./pages/Habits";
import Settings from "./pages/Settings";
import { ThemeProvider } from 'next-themes';
import { useEffect, useState } from "react";
import { createTrackLogs, updateScheduledDates } from "./utils/habitFunctions";
import Progress from "./pages/Progress";

function Layout() {

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        }
      });
    }
  }, []);

  useEffect(() => {
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        // Get all existing service worker registrations
        const registrations = await navigator.serviceWorker.getRegistrations();
        const isServiceWorkerRegistered = registrations.some(reg => reg.active?.scriptURL.includes('/service-worker.js'));

        // Register the service worker only if it is not already registered
        if (!isServiceWorkerRegistered) {
          navigator.serviceWorker.register('/service-worker.js')
            .then(reg => {
              console.log('Service Worker Registered!', reg);
            })
            .catch(error => {
              console.error('Service Worker registration failed:', error);
            });
        } else {
          console.log('Service Worker is already registered.');
        }
      }
    };

    registerServiceWorker();
  }, []);

  useEffect(() => {
    (async () => {
      await updateScheduledDates();
      await createTrackLogs();
    })();
  }, [])


  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("userInfo")))

  return <ThemeProvider attribute="class" defaultTheme="light">
    <DefaultLayout userInfo={userInfo}>
      <Outlet context={{ userInfo, setUserInfo }} />
    </DefaultLayout>
  </ThemeProvider>

}

function App() {

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home />
        }
      />
      <Route path="" element={<Layout />}>
        <Route
          path="/daily"
          element={
            <Daily />
          }
        />
        <Route
          path="/habits"
          element={
            <Habits />
          }
        />
        <Route
          path="/logs"
          element={
            <Progress />
          }
        />
        <Route
          path="/settings"
          element={
            <Settings />
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
