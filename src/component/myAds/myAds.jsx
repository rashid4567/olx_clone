import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../Firbase/firebase";
import { userAuth } from "../context/authcontext";
import { Link } from "react-router-dom";
import EditModal from "../modal/edit";
import loading from "../../assets/loading.gif";
import { formatFirestoreDate } from "../../utils/dateUtils";
import { NavBar } from "../NavBar/navBar";

const MyAds = () => {
  const [myItems, setMyItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const auth = userAuth();

  useEffect(() => {
    fetchMyItems();
  }, [auth.user]);

  const fetchMyItems = async () => {
    if (!auth.user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const q = query(
        collection(db, "products"),
        where("userId", "==", auth.user.uid)
      );
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          title: data.title || "",
          category: data.category || "",
          description: data.description || "",
          imageUrl: data.imageUrl || "",
          userId: data.userId || "",
          userName: data.userName || "Anonymous",
          price:
            typeof data.price === "number"
              ? data.price
              : parseFloat(data.price) || 0,

          createdAt:
            data.createdAt &&
            typeof data.createdAt === "object" &&
            data.createdAt.seconds
              ? new Date(data.createdAt.seconds * 1000).toISOString()
              : data.createdAt || null,
          updatedAt:
            data.updatedAt &&
            typeof data.updatedAt === "object" &&
            data.updatedAt.seconds
              ? new Date(data.updatedAt.seconds * 1000).toISOString()
              : data.updatedAt || null,
        };
      });

      setMyItems(items);
    } catch (error) {
      console.error("Error fetching my items:", error);
      alert("Failed to fetch your items");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (itemId, itemTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${itemTitle}"?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, "products", itemId));
      setMyItems(myItems.filter((item) => item.id !== itemId));
      alert("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item. Please try again.");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleUpdateSuccess = (updatedItem) => {
    setMyItems(
      myItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    setShowEditModal(false);
    setEditingItem(null);
  };

  if (!auth.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: "#002f34" }}>
            Please Login
          </h2>
          <p className="text-gray-600 mb-4">
            You need to be logged in to view your ads
          </p>
          <Link
            to="/"
            className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600 transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <img src={loading} alt="Loading..." className="w-32" />
      </div>
    );
  }

  return (
    <>
    <NavBar/>
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: "#002f34" }}>
            My Ads ({myItems.length})
          </h1>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Home
          </Link>
        </div>

        {myItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8l-4 4m0-4l4 4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No ads found
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't posted any items yet
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#002f34" }}
            >
              Post Your First Ad
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {myItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                  <img
                    src={item.imageUrl || "https://via.placeholder.com/300x200"}
                    alt={item.title}
                    className="w-full h-48 object-contain p-2"
                  />
                </div>

                <div className="p-4">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      {item.category}
                    </p>
                    <p
                      className="text-xl font-bold"
                      style={{ color: "#002f34" }}
                    >
                      ₹ {item.price?.toLocaleString()}
                    </p>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="text-xs text-gray-500 mb-4">
                    Posted on: {formatFirestoreDate(item.createdAt)}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="flex-1 bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showEditModal && editingItem && (
        <EditModal
          item={editingItem}
          onClose={() => {
            setShowEditModal(false);
            setEditingItem(null);
          }}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
    </>
  );
};

export default MyAds;
