import { Modal, ModalBody } from "flowbite-react";
import React, { useState } from "react";

import { userAuth } from "../context/authcontext";
import {
  db,
  addDoc,
  collection,
  fetchFromFireStore,
} from "../Firbase/firebase";
import fileUpload from "../../assets/fileUpload.svg";
import loading from "../../assets/loading.gif";
import close from "../../assets/close.svg";

const Sell = (props) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [image, setImage] = useState(null);
  const { toggleSellModal, status, setItems } = props; 

  const auth = userAuth();

  const handleImageUpload = (e) => {
    if (e.target.files) setImage(e.target.files[0]); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.user) {
      alert("Please login to continue");
      return;
    }

    setSubmitting(true);

    const readImageAsDataUrl = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageUrl = reader.result;
          
          resolve(imageUrl);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    let imageUrl = "";
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

    if (!trimmedTitle || !trimmedCategory || !trimmedPrice || !trimmedDescription) {
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
      await addDoc(collection(db, "products"), {
        title: trimmedTitle,
        category: trimmedCategory,
        price: Number(trimmedPrice),
        description: trimmedDescription,
        imageUrl,
        userId: auth.user.uid,
        userName: auth.user.displayName || "Anonymous",
        createdAt: new Date().toDateString(),
      });

     
      setTitle("");
      setCategory("");
      setPrice("");
      setDescription("");
      setImage(null);

    
      if (setItems) {
        const datas = await fetchFromFireStore();
        setItems(datas);
      }
      
      alert("Item listed successfully!");
      toggleSellModal();
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to add item. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
        onClick={toggleSellModal}
        position={"center"}
        show={status}
        className="bg-black"
        size="md"
        popup={true}
      >
        <ModalBody
          className="bg-white h-auto p-0 rounded-md" 
          onClick={(e) => e.stopPropagation()}
        >
          <img 
            onClick={() => {
              toggleSellModal();
              setImage(null);
            }}
            src={close} 
            alt="close_btn" 
            className="w-6 absolute z-10 top-6 right-8 cursor-pointer" 
          />
          <div className="p-6 pl-8 pr-8 pb-8">
            <p className="font-bold text-lg mb-3">Sell Item</p>
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
                {image ? (
                  <div className="relative h-40 sm:h-60 w-full flex justify-center border-2 border-black border-solid rounded-md overflow-hidden">
                    <img
                      className="object-contain"
                      src={URL.createObjectURL(image)}
                      alt="Selected"
                    />
                    <button
                      type="button"
                      onClick={() => setImage(null)}
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
                      required
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
                <div className="w-full pt-2">
                  <button
                    type="submit"
                    className="w-full p-3 rounded-lg text-white hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: "#002f34" }}
                  >
                    Sell Item
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

export default Sell;