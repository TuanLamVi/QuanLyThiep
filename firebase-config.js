// firebase-config.js - Firebase Configuration
// Thay YOUR_* bằng config của bạn từ Firebase Console

const firebaseConfig = {
  apiKey: "AIzaSyBpoi3xuIIiOQXMohVLOITlf0DX9JKbs-4",
  authDomain: "grouppublic-583ac.firebaseapp.com",
  projectId: "grouppublic-583ac",
  storageBucket: "grouppublic-583ac.firebasestorage.app",
  messagingSenderId: "70167414260",
  appId: "1:70167414260:web:8d3111a010959a38a965a1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Mật khẩu admin (hardcode - chỉ demo, bản production dùng Auth)
const ADMIN_PASSWORD = "admin123456";

// Log để kiểm tra kết nối
console.log('✅ Firebase initialized with project:', firebaseConfig.projectId);
