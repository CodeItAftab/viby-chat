import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
// import { getToken } from "firebase/messaging";
// import { messaging } from "./lib/firebase";
const AuthLayout = lazy(() => import("./auth/AuthLayout"));
const MainLayout = lazy(() => import("./dashboard/MainLayout"));
const Login = lazy(() => import("./auth/pages/Login"));
const Register = lazy(() => import("./auth/pages/Register"));
const Otp = lazy(() => import("./auth/pages/Otp"));
const UpdateAvatar = lazy(() => import("./auth/pages/UpdateAvatar"));
const Chats = lazy(() => import("./dashboard/pages/Chats"));
const Friends = lazy(() => import("./dashboard/pages/Friends"));
const Requests = lazy(() => import("./dashboard/pages/Requests"));
const Search = lazy(() => import("./dashboard/pages/Search"));
const FirstProfileUpdate = lazy(() => import("./Profile/FirstProfileUpdate"));

// import loading from "./lotties/loading_plane.lottie";
import {
  BufferingScreen,
  MainLoadingScreen,
} from "./components/custom/loading";
import { Toaster } from "react-hot-toast";

const router = createBrowserRouter(
  [
    {
      path: "auth",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <AuthLayout />
        </Suspense>
      ),
      children: [
        {
          path: "login",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <Login />
            </Suspense>
          ),
        },
        {
          path: "register",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <Register />
            </Suspense>
          ),
        },
        {
          path: "verify-otp",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <Otp />
            </Suspense>
          ),
        },
        {
          path: "update-avatar",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <UpdateAvatar />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "/",
      element: (
        <Suspense fallback={<MainLoadingScreen />}>
          <MainLayout />
        </Suspense>
      ),
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<BufferingScreen />}>
              <Chats />
            </Suspense>
          ),
        },
        {
          path: "friends",
          element: (
            <Suspense
              fallback={
                <div className="h-full w-full flex items-center justify-center">
                  Loading...
                </div>
              }
            >
              <Friends />
            </Suspense>
          ),
        },
        {
          path: "requests",
          element: (
            <Suspense
              fallback={
                <div className="h-full w-full flex items-center justify-center">
                  Loading...
                </div>
              }
            >
              <Requests />
            </Suspense>
          ),
        },
        {
          path: "search",
          element: (
            <Suspense
              fallback={
                <div className="h-full w-full flex items-center justify-center">
                  Loading...
                </div>
              }
            >
              <Search />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "/first-login",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <FirstProfileUpdate />
        </Suspense>
      ),
    },
  ],
  {
    future: {
      v7_partialHydration: true,
      v7_normalizeFormMethod: true,
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_skipActionErrorRevalidation: true,
      v7_startTransitionPersist: true,
    },
  }
);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
      <Toaster />
    </div>
  );
}

export default App;
