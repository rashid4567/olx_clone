import { collection, getDocs } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../Firbase/firebase";

const Context = createContext(null);
export const ItemsContext = () => useContext(Context);

const convertTimestamp = (timestamp) => {
  if (!timestamp) return null;
  if (typeof timestamp === "string") return timestamp;
  if (timestamp && typeof timestamp === "object" && timestamp.seconds) {
    const date = new Date(timestamp.seconds * 1000);
    return date.toISOString();
  }
  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }
  return null;
};

export const ItemsContextProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItemsFromFireStore = async () => {
      try {
        setLoading(true);
        const productsCollection = collection(db, "products");
        const productSnapshot = await getDocs(productsCollection);
        const productsList = productSnapshot.docs.map((doc) => {
          const data = doc.data();

          const cleanedData = {
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

            createdAt: convertTimestamp(data.createdAt),
            updatedAt: convertTimestamp(data.updatedAt),
          };

          return cleanedData;
        });

        setItems(productsList);
      } catch (error) {
        console.error("Error fetching products:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItemsFromFireStore();
  }, []);

  return (
    <Context.Provider value={{ items, setItems, loading }}>
      {children}
    </Context.Provider>
  );
};
