import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import NavigationBar from "./components/NavigationBar";
import AllRecepis from "./pages/AllRecipes";
import CreateRecipe from "./pages/CreateRecipe";
import MyRecepis from "./pages/MyRecipes";
import { cacheRtl, theme } from "./settings";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RecipePage from "./pages/RecipePage/RecipePage";
import Login from "./pages/Login/Login";
import { auth } from "./utils/firebase.utils";
import PrivateRoute from "./PrivateRoute/PrivateRoute";
import { User } from "firebase/auth";
import { httpGetUserLevel, httpVlidateUser } from "./hooks/requests";
import GroupsManagement from "./pages/GroupsManagement/GroupsManagement";
import JoinGroup from "./pages/GroupsManagement/JoinGroup/JoinGroup";
import HealthCheckWrapper from "./components/HealthCheckWrapper/HealthCheckWrapper";

function App() {
  const [authentication, setAuthState] = useState({
    authenticated: false,
    initializing: true,
  });

  async function validateUser(user: User) {
    const token = await user.getIdToken();
    httpVlidateUser(token);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthState({
          authenticated: true,
          initializing: false,
        });
        // validateUser(user);
      } else {
        setAuthState({
          authenticated: false,
          initializing: false,
        });
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  if (authentication.initializing) {
    return <div>Loading</div>;
  }

  const queryClient = new QueryClient();

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <HealthCheckWrapper>
          <div className="App">
            <NavigationBar></NavigationBar>
            <Routes>
              <Route
                path="/"
                element={
                  <Navigate
                    to={
                      authentication.authenticated ? "/all-recipes" : "/login"
                    }
                  />
                }
              />
              <Route path="/login" element={<Login />} />
              <Route
                path="/groups-management"
                element={
                  <PrivateRoute isAuthenticated={authentication.authenticated}>
                    <GroupsManagement />
                  </PrivateRoute>
                }
              />
              <Route
                path="/groups-management/join"
                element={
                  <PrivateRoute isAuthenticated={authentication.authenticated}>
                    <JoinGroup />
                  </PrivateRoute>
                }
              />

              <Route
                path="/all-recipes"
                element={
                  <PrivateRoute isAuthenticated={authentication.authenticated}>
                    <AllRecepis />
                  </PrivateRoute>
                }
              />
              <Route
                path="/recipe/:id"
                element={
                  <PrivateRoute isAuthenticated={authentication.authenticated}>
                    <RecipePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/my-recipes"
                element={
                  <PrivateRoute isAuthenticated={authentication.authenticated}>
                    <MyRecepis />
                  </PrivateRoute>
                }
              />
              <Route
                key="create-recipe"
                path="/create-recipe"
                element={
                  <PrivateRoute isAuthenticated={authentication.authenticated}>
                    <CreateRecipe />
                  </PrivateRoute>
                }
              />
              <Route
                key="edit-recipe"
                path="/edit-recipe"
                element={
                  <PrivateRoute isAuthenticated={authentication.authenticated}>
                    <CreateRecipe />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
          </HealthCheckWrapper>
        </QueryClientProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;
