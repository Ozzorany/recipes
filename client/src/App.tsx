import { CacheProvider } from "@emotion/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import PrivateRoute from "./PrivateRoute/PrivateRoute";
import HealthCheckWrapper from "./components/HealthCheckWrapper/HealthCheckWrapper";
import NavigationBar from "./components/NavigationBar";
import { ThemeProviderWrapper } from "./context/Theme.context";
import AllRecepis from "./pages/AllRecipes/AllRecipes";
import CreateRecipe from "./pages/CreateRecipe";
import GroupsManagement from "./pages/GroupsManagement/GroupsManagement";
import JoinGroup from "./pages/GroupsManagement/JoinGroup/JoinGroup";
import Login from "./pages/Login/Login";
import MyRecepis from "./pages/MyRecipes";
import RecipePage from "./pages/RecipePage/RecipePage";
import { cacheRtl } from "./settings";
import { auth } from "./utils/firebase.utils";
import UserGroceryLists from "./pages/UserGroceryLists/UserGroceryLists";
import GroceryListPage from "./pages/GroceryListPage/GroceryListPage";
import JoinGroceryList from "./pages/GroceryLists/JoinGroceryList/JoinGroceryList";

function App() {
  const [authentication, setAuthState] = useState({
    authenticated: false,
    initializing: true,
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthState({
          authenticated: true,
          initializing: false,
        });
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
      <ThemeProviderWrapper>
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
                    <PrivateRoute
                      isAuthenticated={authentication.authenticated}
                    >
                      <GroupsManagement />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/groups-management/join"
                  element={
                    <PrivateRoute
                      isAuthenticated={authentication.authenticated}
                    >
                      <JoinGroup />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/all-recipes"
                  element={
                    <PrivateRoute
                      isAuthenticated={authentication.authenticated}
                    >
                      <AllRecepis />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/recipe/:id"
                  element={
                    <PrivateRoute
                      isAuthenticated={authentication.authenticated}
                    >
                      <RecipePage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/my-recipes"
                  element={
                    <PrivateRoute
                      isAuthenticated={authentication.authenticated}
                    >
                      <MyRecepis />
                    </PrivateRoute>
                  }
                />
                <Route
                  key="create-recipe"
                  path="/create-recipe"
                  element={
                    <PrivateRoute
                      isAuthenticated={authentication.authenticated}
                    >
                      <CreateRecipe />
                    </PrivateRoute>
                  }
                />
                <Route
                  key="edit-recipe"
                  path="/edit-recipe"
                  element={
                    <PrivateRoute
                      isAuthenticated={authentication.authenticated}
                    >
                      <CreateRecipe />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/grocery-lists"
                  element={
                    <PrivateRoute
                      isAuthenticated={authentication.authenticated}
                    >
                      <UserGroceryLists />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/grocery-list/:id"
                  element={
                    <PrivateRoute
                      isAuthenticated={authentication.authenticated}
                    >
                      <GroceryListPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/grocery-lists/join"
                  element={<JoinGroceryList />}
                />
              </Routes>
            </div>
          </HealthCheckWrapper>
        </QueryClientProvider>
      </ThemeProviderWrapper>
    </CacheProvider>
  );
}

export default App;
