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

  // Keep track of the current page
  const mainPagePath = '/'; // Replace with your main page path

  // Intercept the back button
  window.addEventListener('popstate', () => {
    if (window.location.pathname === mainPagePath) {
      // If on the main page, try to close the app
      if (confirm("Do you want to exit the app?")) {
        window.close(); // This may work in some Android PWAs, or use TWA for guaranteed exit
      } else {
        // If window.close() does not work, keep user on main page
        history.pushState(null, null, mainPagePath);
      }
    } else {
      // If on a different page, navigate back to the main page
      history.pushState(null, null, mainPagePath);
    }
  });

  // Initialize with the main page state
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
