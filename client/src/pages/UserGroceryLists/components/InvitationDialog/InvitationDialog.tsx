import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import { useGenerateGroceryInvitationLink } from "../../../../queries/mutations/useGenerateGroceryInvitationLink";

interface InvitationDialogProps {
  open: boolean;
  onClose: () => void;
  listId: string;
  listName: string;
}

const InvitationDialog: React.FC<InvitationDialogProps> = ({
  open,
  onClose,
  listId,
  listName,
}) => {
  const generateInvitationMutation = useGenerateGroceryInvitationLink();
  const [invitationLink, setInvitationLink] = React.useState<string>("");
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      generateInvitationMutation.mutate(listId, {
        onSuccess: (response) => {
          if (response?.data?.data) {
            setInvitationLink(response.data.data);
          }
        },
      });
    }
  }, [open, listId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(invitationLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: "center" }}>
        הזמנה - {listName}
        <Typography
          variant="subtitle2"
          sx={{ mt: 1, color: "text.secondary", fontWeight: 400 }}
        >
          שלחו את הקישור לחברים שברצונכם לצרף לרשימה
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mt: 2,
            p: 2,
            bgcolor: "grey.100",
            borderRadius: 1,
            position: "relative",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              flex: 1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: "text.secondary",
              pr: 4,
              scrollbarWidth: "thin",
              "&::-webkit-scrollbar": {
                height: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "grey.400",
                borderRadius: "2px",
              },
            }}
          >
            {generateInvitationMutation.isPending
              ? "טוען קישור..."
              : invitationLink || "לא ניתן ליצור קישור"}
          </Typography>
          <Tooltip title={copied ? "הועתק!" : "העתק קישור"}>
            <IconButton
              onClick={handleCopyLink}
              disabled={!invitationLink || generateInvitationMutation.isPending}
              sx={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "background.paper",
                "&:hover": {
                  bgcolor: "grey.200",
                },
                color: copied ? "success.main" : "inherit",
                transition: "color 0.2s ease-in-out",
              }}
            >
              {copied ? (
                <CheckIcon fontSize="small" />
              ) : (
                <ContentCopyIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>סגור</Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvitationDialog;
