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

function BackgroundProcessing() {

  useEffect(() => {
    (async () => {
      await updateScheduledDates();
      await createTrackLogs();
    })();
  }, [])

  return <>
    <Outlet />
  </>
}

function Layout() {

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
      <Route path="" element={<BackgroundProcessing />}>
        <Route
          path="/"
          element={
            <Home />
          }
        />
      </Route>
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
