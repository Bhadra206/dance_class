import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

type Props = {
  setFormData: React.Dispatch<React.SetStateAction<any>>;
};

const ImageUpload: React.FC<Props> = ({ setFormData }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onloadend = () => {
      // Save base64 string to formData
      setFormData((prev: any) => ({
        ...prev,
        image: reader.result, // base64 string
      }));
    };
    reader.readAsDataURL(file); // Convert to base64
  };  

  const handleBoxClick = () => {
    document.getElementById("fileInput")?.click();
  };

  return (
    <div className="form-right">
      <div className="image-upload-container" onClick={handleBoxClick}>
        <input
          type="file"
          id="fileInput"
          onChange={handleFileChange}
          className="hidden-file-input"
        />
        <FontAwesomeIcon icon={faUpload} className="upload-icon" />
        <p>Upload a file</p>
      </div>
    </div>
  );
};

export default ImageUpload;
