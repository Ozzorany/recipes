import { RestaurantMenu } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase.utils";
import LevelProgressDialog from "./LevelProgressDialog/LevelProgressDialog";
import { ThemeName, themes } from "../settings";
import { ThemeContext } from "../context/Theme.context";

const NavigationBar = () => {
  const navigate = useNavigate();
  const themeContext = React.useContext(ThemeContext);

  if (!themeContext) {
    throw new Error("NavigationBar must be used within ThemeProviderWrapper");
  }

  const { themeName, setTheme } = themeContext;

  const [isLevelDialogOpen, setIsLevelDialogOpen] = React.useState(false);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const user = auth.currentUser;
  const photoURL = user?.photoURL || "/static/images/avatar/2.jpg";

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const navigateToAllRecepis = () => {
    navigate("/all-recipes", { replace: true });
    handleCloseNavMenu();
  };

  const navigateToCreateRecipe = () => {
    navigate("/create-recipe", { replace: true });
    handleCloseNavMenu();
  };

  const navigateToGroupsManagement = () => {
    handleCloseUserMenu();
    navigate("/groups-management", { replace: true });
  };

  const navigateToGroceryLists = () => {
    navigate("/grocery-lists", { replace: true });
    handleCloseNavMenu();
  };

  const signOut = () => {
    auth.signOut();
    handleCloseUserMenu();
  };

  const handleThemeChange = (event: any) => {
    setTheme(event.target.value as ThemeName);
  };

  return (
    <>
      <LevelProgressDialog
        open={isLevelDialogOpen}
        setOpen={setIsLevelDialogOpen}
      />
      <AppBar position="static">
        <Container
          maxWidth={false}
          sx={{
            display: user ? undefined : "flex",
            justifyContent: user ? undefined : "center",
          }}
        >
          <Toolbar disableGutters sx={{ width: "100%", position: "relative" }}>
            {/* Logo for md and up */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                mr: 2,
              }}
            >
              <RestaurantMenu sx={{ mr: 1 }} />
              <Typography
                variant="h6"
                noWrap
                component="a"
                onClick={navigateToAllRecepis}
                sx={{
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                BAROZ
              </Typography>
            </Box>

            {/* Logo for small screens (centered) */}
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                alignItems: "center",
              }}
              onClick={navigateToAllRecepis}
            >
              <RestaurantMenu sx={{ mr: 1 }} />
              <Typography
                variant="h6"
                noWrap
                component="a"
                sx={{
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                BAROZ
              </Typography>
            </Box>

            {user && (
              <>
                {/* Left side nav for small screens */}
                <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                  <IconButton
                    size="large"
                    aria-label="menu"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                  >
                    <MenuIcon />
                  </IconButton>

                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{ display: { xs: "block", md: "none" } }}
                  >
                    <MenuItem onClick={navigateToAllRecepis}>
                      <Typography textAlign="center">כל המתכונים</Typography>
                    </MenuItem>
                    <MenuItem onClick={navigateToCreateRecipe}>
                      <Typography textAlign="center">יצירת מתכון</Typography>
                    </MenuItem>
                    <MenuItem onClick={navigateToGroceryLists}>
                      <Typography textAlign="center">רשימת קניות</Typography>
                    </MenuItem>
                  </Menu>
                </Box>

                {/* Full menu for md and up */}
                <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                  <Button
                    onClick={navigateToAllRecepis}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    כל המתכונים
                  </Button>
                  <Button
                    onClick={navigateToCreateRecipe}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    יצירת מתכון
                  </Button>
                  <Button
                    onClick={navigateToGroceryLists}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    רשימת קניות
                  </Button>
                </Box>

                {/* User Avatar and Menu */}
                <Box sx={{ flexGrow: 0 }} display="flex">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 2 }}>
                    <Avatar
                      alt="User"
                      src={photoURL}
                      imgProps={{ referrerPolicy: "no-referrer" }}
                    />
                  </IconButton>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem>
                      <FormControl fullWidth>
                        <InputLabel>בחרו ערכת נושא</InputLabel>
                        <Select value={themeName} onChange={handleThemeChange}>
                          {Object.keys(themes).map((themeKey) => (
                            <MenuItem key={themeKey} value={themeKey}>
                              {themeKey}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </MenuItem>
                    <MenuItem onClick={navigateToGroupsManagement}>
                      <Typography textAlign="center">ניהול קבוצות</Typography>
                    </MenuItem>
                    <MenuItem onClick={signOut}>
                      <Typography textAlign="center">התנתקות</Typography>
                    </MenuItem>
                  </Menu>
                </Box>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default NavigationBar;
