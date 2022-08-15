import Button from "@mui/material/Button";
import { useEffect, useState } from "react";

function UploadImages({ onSelectedImage, currentImage }: { onSelectedImage: (image: any) => void , currentImage: string | null}) {
    const [selectedImage, setSelectedImage] = useState<any>();
    const [showImage, setShowImage] = useState<boolean>(false);
    const [imageToDisplay, setImageToDisplay] = useState<string>();

    useEffect(() => {
        if(!!currentImage) {
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
        setSelectedImage(event.target.files[0]);        
        onSelectedImage(event.target.files[0]);
    }

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setShowImage(false);
    }

    return (
        <div>
            {showImage && (
                <div>
                    <img alt="not fount" width={"250px"} src={imageToDisplay} />
                    <br />
                    <Button variant="contained" onClick={handleRemoveImage}>Remove</Button>
                </div>
            )}
            <br />

            <br />
            <input
                type="file"
                name="myImage"
                onChange={(event) => {
                    handleImageUpload(event);
                }}
            />
        </div>
    );
}

export default UploadImages;