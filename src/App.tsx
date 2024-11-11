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

function BackgroundProcessing() {

  useEffect(() => {

    scheduleDailyTask();

    (async () => {
      await updateScheduledDates();
      await createTrackLogs();
    })();
  }, [])

  const mainPagePath = '/';

  window.addEventListener('popstate', () => {
    if (window.location.pathname != mainPagePath) {
      history.pushState(null, null, mainPagePath);
    }
  });

  history.pushState(null, null, window.location.pathname);

  return <>
    <Outlet />
  </>
}


function scheduleDailyTask() {

  let hasRunToday = false;

  setInterval(async () => {
    const now = new Date();
    const isMidnight = now.getHours() === 0;

    console.log("fomr here", isMidnight, hasRunToday)
    if (isMidnight && !hasRunToday) {
      console.log("fomr here also")
      await updateScheduledDates();
      await createTrackLogs();
      hasRunToday = true;
    }

    if (now.getHours() === 1 && hasRunToday) {
      hasRunToday = false;
    }
  }, 60000);
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
