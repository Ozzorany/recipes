import { RestaurantMenu } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase.utils";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LevelProgressDialog from "./LevelProgressDialog/LevelProgressDialog";
import { useUserLevel } from "../queries/useUserLevel";
import Level from "./Level/Level";

const NavigationBar = () => {
  const navigate = useNavigate();
  const [isLevelDialogOpen, setIsLevelDialogOpen] = React.useState(false);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const user = auth.currentUser;
  const photoURL = user?.photoURL || "/static/images/avatar/2.jpg";
  const { data, isLoading: isUserLevelLoading } = useUserLevel();
  const { level } = data || {};

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const navigateToAllRecepis = () => {
    navigate("/all-recipes", { replace: true });
    handleCloseNavMenu();
  };

  const navigateToMyRecepis = () => {
    navigate("/my-recipes", { replace: true });
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

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const signOut = () => {
    auth.signOut();
    handleCloseUserMenu();
  };

  const handleOpenLevelDialog = () => {
    setIsLevelDialogOpen(true);
  };

  return (
    <>
      <LevelProgressDialog
        open={isLevelDialogOpen}
        setOpen={setIsLevelDialogOpen}
      />
      <AppBar position="static">
        <Container maxWidth={false}>
          <Toolbar disableGutters>
            <RestaurantMenu
              sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
            />
            <Typography
              variant="h6"
              noWrap
              component="a"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
                cursor: "pointer",
              }}
              onClick={navigateToAllRecepis}
            >
              BAROZ
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
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
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                <MenuItem onClick={navigateToAllRecepis}>
                  <Typography textAlign="center">כל המתכונים</Typography>
                </MenuItem>
                {/* <MenuItem onClick={navigateToMyRecepis}>
                <Typography textAlign="center">המתכונים שלי</Typography>
              </MenuItem> */}
                <MenuItem onClick={navigateToCreateRecipe}>
                  <Typography textAlign="center">יצירת מתכון</Typography>
                </MenuItem>
              </Menu>
            </Box>
            <RestaurantMenu
              sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
            />
            <Typography
              variant="h5"
              noWrap
              component="a"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
                cursor: "pointer",
              }}
              onClick={navigateToAllRecepis}
            >
              BAROZ
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              <Button
                onClick={navigateToAllRecepis}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                כל המתכונים
              </Button>
              {/* <Button
              onClick={navigateToMyRecepis}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              המתכונים שלי
            </Button> */}
              <Button
                onClick={navigateToCreateRecipe}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                יצירת מתכון
              </Button>
            </Box>

            <Box sx={{ flexGrow: 0 }} display="flex">
              {!isUserLevelLoading && (
                <Box display="flex" alignItems="center">
                  <Level level={level} />
                  <IconButton onClick={handleOpenLevelDialog}>
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}

              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0, marginLeft: 2 }}
              >
                <Avatar
                  alt="Remy Sharp"
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
                <MenuItem
                  key={"groups-management"}
                  onClick={navigateToGroupsManagement}
                >
                  <Typography textAlign="center">ניהול קבוצות</Typography>
                </MenuItem>
                <MenuItem key={"logout"} onClick={signOut}>
                  <Typography textAlign="center">התנתקות</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};
export default NavigationBar;
