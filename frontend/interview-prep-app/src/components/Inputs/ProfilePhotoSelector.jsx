import React, { useRef, useState } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage, preview, setPreview }) => {

  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);

      const preview = URL.createObjectURL(file);
      if (setPreview) {
        setPreview(preview);
      }

      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);

    if (setPreview) {
      setPreview(null);
    }
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className="flex justify-center mb-4">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!image ? (
        <div className="relative w-20 h-20 flex items-center justify-center bg-orange-50 border-2 border-dashed border-orange-300 rounded-full cursor-pointer hover:bg-orange-100 transition">
          <LuUser className="text-4xl text-orange-400" />

          <button
            type="button"
            className="absolute -bottom-1 -right-1 w-7 h-7 flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow transition"
            onClick={onChooseFile}
          >
            <LuUpload size={13} />
          </button>
        </div>
      ) : (
        <div className="relative w-20 h-20">
          <img
            src={preview || previewUrl}
            alt="profile photo"
            className="w-20 h-20 rounded-full object-cover border-2 border-orange-300 shadow"
          />

          <button
            type="button"
            className="absolute -bottom-1 -right-1 w-7 h-7 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full shadow transition"
            onClick={handleRemoveImage}
          >
            <LuTrash size={13} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
