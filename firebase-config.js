// firebase-config.js - Firebase Configuration
// Thay YOUR_* bằng config của bạn từ Firebase Console

const firebaseConfig = {
  apiKey: "AIzaSyBjWM4CoGmezvADuSTl5XSnPd2ntugyh4M",
  authDomain: "thiepmoi-74103698-dbe87.firebaseapp.com",
  projectId: "thiepmoi-74103698-dbe87",
  storageBucket: "thiepmoi-74103698-dbe87.firebasestorage.app",
  messagingSenderId: "294963219705"
  appId: "1:294963219705:web:2a9222d250cf81dfe3a628"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Mật khẩu admin (hardcode - chỉ demo, bản production dùng Auth)
const ADMIN_PASSWORD = "admin123456";

// Log để kiểm tra kết nối
console.log('✅ Firebase initialized with project:', firebaseConfig.projectId);
