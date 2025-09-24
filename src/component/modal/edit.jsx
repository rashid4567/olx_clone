import { Modal, ModalBody } from "flowbite-react";
import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../Firbase/firebase";
import fileUpload from "../../assets/fileUpload.svg";
import loading from "../../assets/loading.gif";
import close from "../../assets/close.svg";

const EditModal = ({ item, onClose, onUpdateSuccess }) => {
  const [title, setTitle] = useState(item.title);
  const [category, setCategory] = useState(item.category);
  const [price, setPrice] = useState(item.price.toString());
  const [description, setDescription] = useState(item.description);
  const [submitting, setSubmitting] = useState(false);
  const [image, setImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(item.imageUrl);

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const readImageAsDataUrl = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    let imageUrl = currentImageUrl;
    if (image) {
      try {
        imageUrl = await readImageAsDataUrl(image);
      } catch (error) {
        console.error(error);
        alert("Failed to read the image");
        setSubmitting(false);
        return;
      }
    }

    const trimmedTitle = title.trim();
    const trimmedCategory = category.trim();
    const trimmedPrice = price.trim();
    const trimmedDescription = description.trim();

    if (
      !trimmedTitle ||
      !trimmedCategory ||
      !trimmedPrice ||
      !trimmedDescription
    ) {
      alert("All fields are required");
      setSubmitting(false);
      return;
    }

    if (Number(trimmedPrice) <= 0) {
      alert("Price must be positive");
      setSubmitting(false);
      return;
    }

    try {
      const itemRef = doc(db, "products", item.id);
      const updatedData = {
        title: trimmedTitle,
        category: trimmedCategory,
        price: Number(trimmedPrice),
        description: trimmedDescription,
        imageUrl,
        updatedAt: new Date().toDateString(),
      };

      await updateDoc(itemRef, updatedData);

      const updatedItem = {
        ...item,
        ...updatedData,
      };

      alert("Item updated successfully!");
      onUpdateSuccess(updatedItem);
    } catch (error) {
      console.error("Error updating document: ", error);
      alert("Failed to update item. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const removeImage = () => {
    setImage(null);
    setCurrentImageUrl("");
  };

  return (
    <div>
      <Modal
        theme={{
          content: {
            base: "relative w-full p-4 md:h-auto",
            inner:
              "relative flex max-h-[90dvh] flex-col rounded-lg bg-white shadow dark:bg-gray-700",
          },
        }}
        onClick={onClose}
        position={"center"}
        show={true}
        className="bg-black"
        size="md"
        popup={true}
      >
        <ModalBody
          className="bg-white h-auto p-0 rounded-md"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            onClick={onClose}
            src={close}
            alt="close_btn"
            className="w-6 absolute z-10 top-6 right-8 cursor-pointer"
          />
          <div className="p-6 pl-8 pr-8 pb-8">
            <p className="font-bold text-lg mb-3">Edit Item</p>
            <form onSubmit={handleSubmit}>
              {/* Title Input */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-teal-300 placeholder-gray-500"
                  required
                />
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-teal-300 placeholder-gray-500"
                  required
                />
              </div>

              <div className="mb-4">
                <input
                  type="number"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-teal-300 placeholder-gray-500"
                  required
                />
              </div>

              <div className="mb-4">
                <textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-teal-300 placeholder-gray-500 resize-vertical"
                  required
                />
              </div>

              <div className="pt-2 w-full relative">
                {image || currentImageUrl ? (
                  <div className="relative h-40 sm:h-60 w-full flex justify-center border-2 border-black border-solid rounded-md overflow-hidden">
                    <img
                      className="object-contain"
                      src={image ? URL.createObjectURL(image) : currentImageUrl}
                      alt="Selected"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="relative h-40 sm:h-60 w-full border-2 border-black border-solid rounded-md">
                    <input
                      onChange={handleImageUpload}
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 h-full w-full opacity-0 cursor-pointer z-30"
                    />
                    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col items-center">
                      <img className="w-12" src={fileUpload} alt="Upload" />
                      <p className="text-center text-sm pt-2">
                        Click to upload images
                      </p>
                      <p className="text-center text-sm pt-2">SVG, PNG, JPG</p>
                    </div>
                  </div>
                )}
              </div>

              {submitting ? (
                <div className="w-full flex h-14 justify-center pt-4 pb-2">
                  <img
                    className="w-32 object-cover"
                    src={loading}
                    alt="loading"
                  />
                </div>
              ) : (
                <div className="w-full pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 p-3 rounded-lg text-gray-600 border-2 border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 p-3 rounded-lg text-white hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: "#002f34" }}
                  >
                    Update Item
                  </button>
                </div>
              )}
            </form>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default EditModal;
