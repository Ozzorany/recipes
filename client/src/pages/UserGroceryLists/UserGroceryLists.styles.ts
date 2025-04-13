import { styled } from "@mui/system";
import { Box, Typography, Card, IconButton } from "@mui/material";
import { Chip } from "@mui/material";

export const PageWrapper = styled(Box)(({ theme }) => ({
  padding: "32px 8px", // ⬅️ reduced horizontal padding for mobile
  backgroundColor: theme.palette.background.default,
  minHeight: "100vh",
  width: "100%",
  overflowX: "hidden", // ✅ hide scroll
  boxSizing: "border-box", // ✅ ensure padding doesn't overflow
}));

export const GridContainer = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", // ⬅️ more compact
  gap: "16px", // ⬅️ slightly smaller gap
  width: "100%",
  maxWidth: "1200px",
  margin: "0 auto",
  padding: 0,
  boxSizing: "border-box",
}));

export const StyledCard = styled(Card)(({ theme }) => ({
  padding: "20px",
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
  backgroundColor: theme.palette.background.paper,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  transition: "all 0.3s ease",
  position: "relative",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
  },
}));

export const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "1.2rem",
  color: theme.palette.text.primary,
}));

export const Stats = styled("div")(({ theme }) => ({
  marginTop: "12px",
  display: "flex",
  gap: "16px",
  fontSize: "0.9rem",
  color: theme.palette.text.secondary,
}));

export const CardFooter = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  marginTop: "16px",
});

export const MenuButton = styled(IconButton)({
  position: "absolute",
  top: 8,
  right: 8,
});

export const MemberChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "0.75rem",
  paddingInline: theme.spacing(1),
  borderRadius: "999px",
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
  color: "#fff",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  "& .MuiChip-icon": {
    color: "#ffffff",
    marginInlineStart: "6px",
    marginInlineEnd: 0,
  },
}));

export const OwnershipChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  height: "32px",
  fontSize: "0.75rem",
  borderRadius: "999px",
  paddingInline: theme.spacing(1),
  backgroundColor:
    theme.palette.mode === "light"
      ? theme.palette.primary[50]
      : theme.palette.primary[900],
  color: theme.palette.primary.main,
  border: `1px solid ${theme.palette.primary.main}`,
  "& .MuiChip-label": {
    paddingInline: theme.spacing(1),
  },
}));

export const SharedChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  height: "32px",
  fontSize: "0.75rem",
  borderRadius: "999px",
  paddingInline: theme.spacing(1),
  backgroundColor: theme.palette.grey[100],
  color: theme.palette.text.secondary,
  "& .MuiChip-label": {
    paddingInline: theme.spacing(1),
  },
}));
