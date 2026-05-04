// firebase-config.js - Firebase Configuration
// Thay YOUR_* bằng config của bạn từ Firebase Console

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Mật khẩu admin (hardcode - chỉ demo, bản production dùng Auth)
const ADMIN_PASSWORD = "admin123456";

// Log để kiểm tra kết nối
console.log('✅ Firebase initialized with project:', firebaseConfig.projectId);
