import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Ganti nilai di dalam objek ini dengan firebaseConfig dari Dashboard Firebase Anda
const firebaseConfig = {
  apiKey: "AIzaSyBN1shXDPgl-2Z3PITNGB7nOhpQSPAAsGg",
  authDomain: "welisagita-github-io.firebaseapp.com",
  projectId: "welisagita-github-io",
  storageBucket: "welisagita-github-io.firebasestorage.app",
  messagingSenderId: "557016586961",
  appId: "1:557016586961:web:537d2b019e6dbaa03003f0"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi layanan Firestore (Database)
export const db = getFirestore(app);