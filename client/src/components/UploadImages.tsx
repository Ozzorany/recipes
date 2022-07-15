import { useState } from "react";

function UploadImages({ onSelectedImage }: { onSelectedImage: (image: any) => void }) {
    const [selectedImage, setSelectedImage] = useState<any>();

    const handleImageUpload = (event: any) => {
        setSelectedImage(event.target!.files[0]!);
        console.log(event.target!.files[0]!);
        
        onSelectedImage(event.target!.files[0]!);
    }

    return (
        <div>
            {selectedImage && (
                <div>
                    <img alt="not fount" width={"250px"} src={URL.createObjectURL(selectedImage)} />
                    <br />
                    <button onClick={() => setSelectedImage(null)}>Remove</button>
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