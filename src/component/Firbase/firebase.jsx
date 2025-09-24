import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);
const db = getFirestore(app);

const fetchFromFireStore = async () => {
  try {
    const productsCollection = collection(db, "products");
    const productSnapshot = await getDocs(productsCollection);
    const productList = productSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
       
        price: typeof data.price === 'number' ? data.price : parseFloat(data.price) || 0,
        
        createdAt: data.createdAt || null,
        updatedAt: data.updatedAt || null,
      };
    });
   
    return productList;
  } catch (err) {
    console.error("Unable to fetch the data", err);
    return [];
  }
};

export { 
  app, 
  auth, 
  provider, 
  analytics, 
  storage, 
  db, 
  fetchFromFireStore, 
  addDoc, 
  collection,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs
};