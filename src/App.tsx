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
import OneSignal from 'react-onesignal';
const appId = import.meta.env.VITE_APP_ID;

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

  const initOneSignal = async () => {
    await OneSignal.init({
      appId: appId,
      allowLocalhostAsSecureOrigin: true, // for local development
    });

    const isEnabled = await OneSignal.isPushNotificationsEnabled();
    if (!isEnabled) {
      OneSignal.showSlidedownPrompt(); // Prompts the user to allow notifications
    }

    // Use a timeout or callback to ensure the user has had time to respond
    setTimeout(() => {
      OneSignal.getUserId().then((userId) => {
        console.log('OneSignal User ID:', userId);
        if (userId) {
          localStorage.setItem('onesignal-userId', userId);
        } else {
          console.error('Failed to retrieve OneSignal User ID');
        }
      });
    }, 5000); // 5 seconds should be enough time for the user to respond
  };

  useEffect(() => {
    initOneSignal();
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
