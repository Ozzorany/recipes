import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, IconButton, Paper, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";

function UploadImages({
  onSelectedImage,
  currentImage,
}: {
  onSelectedImage: (image: any) => void;
  currentImage: string | null;
}) {
  const [selectedImage, setSelectedImage] = useState<any>();
  const [showImage, setShowImage] = useState<boolean>(false);
  const [imageToDisplay, setImageToDisplay] = useState<string>();
  const [isDragging, setIsDragging] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (!!currentImage) {
      setShowImage(true);
      setImageToDisplay(currentImage);
    }
  }, [currentImage]);

  useEffect(() => {
    if (!!selectedImage) {
      setImageToDisplay(URL.createObjectURL(selectedImage));
      setShowImage(true);
    }
  }, [selectedImage]);

  const handleImageUpload = (event: any) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      onSelectedImage(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      onSelectedImage(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setShowImage(false);
    onSelectedImage(null);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        px: 3,
      }}
    >
      {showImage ? (
        <Paper
          elevation={3}
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: 400,
            height: "auto",
            overflow: "hidden",
            borderRadius: "12px",
            mt: 3,
          }}
        >
          <Box
            component="img"
            src={imageToDisplay}
            alt="Recipe preview"
            sx={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
            }}
          />
          <IconButton
            onClick={handleRemoveImage}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              },
            }}
          >
            <DeleteIcon color="error" />
          </IconButton>
        </Paper>
      ) : (
        <Paper
          elevation={3}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={{
            width: "100%",
            maxWidth: 400,
            height: 200,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            border: `2px dashed ${
              isDragging ? theme.palette.primary.main : theme.palette.divider
            }`,
            borderRadius: 2,
            backgroundColor: isDragging
              ? "rgba(25, 118, 210, 0.04)"
              : "transparent",
            transition: "all 0.3s ease",
            cursor: "pointer",
            "&:hover": {
              borderColor: theme.palette.primary.main,
              backgroundColor: "rgba(25, 118, 210, 0.04)",
            },
          }}
          onClick={() => document.getElementById("image-upload")?.click()}
        >
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
          <CloudUploadIcon
            sx={{ fontSize: 48, color: theme.palette.primary.main }}
          />
          <Typography variant="body1" color="text.secondary" align="center">
            יש לכם תמונה של המתכון? בחרו אותה!
          </Typography>
        </Paper>
      )}
    </Box>
  );
}

export default UploadImages;
