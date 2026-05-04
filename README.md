# 📅 Event Invitation SPA - Hướng Dẫn Đầy Đủ

Ứng dụng quản lý sự kiện & mời khách hiện đại, xây dựng với Vanilla JS + Firebase Firestore.

---

## ✨ Tính Năng

- ✅ **Admin Dashboard** - Quản lý sự kiện & khách mời
- ✅ **Event Configuration** - Tùy chỉnh tên, ngày tháng, địa điểm
- ✅ **Canvas Invitation** - Thiệp mời động với thiết kế riêng
- ✅ **Guest Management** - Thêm/Xóa/Gửi mời khách
- ✅ **Dynamic Links** - Sinh link mời với guestId
- ✅ **Guest View** - Khách xem thiệp & xác nhận tham dự
- ✅ **Dark Theme** - Giao diện xanh Pi Network (hiện đại)
- ✅ **Responsive** - Tối ưu mobile & tablet
- ✅ **Firestore Integration** - Lưu trữ dữ liệu real-time

---

## 🚀 Quick Start (5 phút)

### 1. Setup Firebase

```bash
# B1: Vào https://console.firebase.google.com
# B2: Tạo project (VD: "event-app")
# B3: Enable Firestore Database
#     - Location: asia-southeast1 (Việt Nam)
#     - Mode: Start in test mode (để test dễ)
# B4: Settings → Project Settings
# B5: Copy Web SDK config
```

### 2. Cập nhật firebase-config.js

```javascript
// firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyC...YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### 3. Chạy Local

```bash
# Mở terminal trong folder project
python -m http.server 8000

# Mở browser: http://localhost:8000
```

### 4. Test Admin Panel

```
🔐 Login Password: admin123456
```

---

## 📁 Cấu Trúc File

```
event-app/
├── index.html              # HTML (admin + guest view)
├── styles.css              # CSS (dark theme, responsive)
├── app.js                  # Core logic (routing, CRUD)
├── firebase-config.js      # Firebase setup
├── firestore-rules.json    # Firestore security rules
└── README.md               # Tài liệu này
```

---

## 🎯 Hướng Dẫn Sử Dụng

### Admin View

**1. Đăng nhập**
- URL: `/` (không có ?guestId=)
- Nhập mật khẩu: `admin123456`

**2. Tạo Sự Kiện**
- Form "Cấu hình Sự kiện"
- Nhập: Tên, Ngày, Địa điểm, Mô tả
- Click "💾 Lưu Cấu hình"

**3. Thiết kế Thiệp**
- Form "Thiết kế Thiệp (Canvas)"
- Chọn: Màu nền, Màu chữ, Font
- Click "💾 Lưu Thiết kế"

**4. Thêm Khách**
- Form "Danh sách Khách mời"
- Nhập tên + ghi chú (tuỳ chọn)
- Click "➕ Thêm khách"

**5. Gửi Mời**
- Table: Tìm khách
- Button "📋 Copy" → Copy link
- Chia sẻ link qua Email, SMS, Messenger, ...
- Click "✉️ Đã gửi" → Đánh dấu đã gửi

### Guest View

**1. Nhận Link**
```
https://your-app.com/?guestId=abc123def456
```

**2. Xem Thiệp**
- Canvas hiển thị thiệp động
- Tên khách, tên sự kiện, ngày tháng

**3. Xác nhận**
- Click "✅ Tôi sẽ đến" hoặc "❌ Tôi không thể đến"
- Admin sẽ thấy response

---

## 🗄️ Database Schema

### Firestore Collections

```
eventConfig/
└── main (Document)
    ├── name: "Birthday Party 2026"
    ├── date: "2026-05-15T18:00"
    ├── location: "123 Nguyen Hue, HCMC"
    ├── description: "..."
    └── updatedAt: "2026-05-04T..."

templateConfig/
└── main (Document)
    ├── bgColor: "#1a1a2e"
    ├── textColor: "#00ff00"
    ├── fontFamily: "Arial"
    └── updatedAt: "2026-05-04T..."

guests/ (Collection)
├── doc1
│   ├── name: "Nguyễn Văn A"
│   ├── note: "Nhân viên marketing"
│   ├── sent: true
│   ├── attended: true/false/null
│   ├── createdAt: "2026-05-04T..."
│   ├── sentAt: "2026-05-04T..."
│   └── respondedAt: "2026-05-04T..."
└── doc2
    └── ...
```

---

## 🔒 Firestore Security Rules

```json
{
  "rules": {
    "eventConfig": {
      "main": {
        ".read": true,
        ".write": false
      }
    },
    "templateConfig": {
      "main": {
        ".read": true,
        ".write": false
      }
    },
    "guests": {
      "{guestId}": {
        ".read": true,
        ".write": false,
        "attended": {
          ".write": "resource.id == request.auth.uid"
        }
      }
    }
  }
}
```

**Giải thích:**
- ✅ Khách có thể đọc thiệp (eventConfig, templateConfig)
- ✅ Khách có thể cập nhật trạng thái tham dự (attended)
- ❌ Khách KHÔNG thể viết dữ liệu khác
- ❌ Admin write được qua app.js (hardcode password)

---

## 🚢 Deploy

### Option 1: Firebase Hosting (Khuyến nghị)

```bash
# B1: Cài Firebase CLI
npm install -g firebase-tools

# B2: Login
firebase login

# B3: Initialize
firebase init hosting

# B4: Copy files vào public/
cp index.html styles.css app.js firebase-config.js public/

# B5: Deploy
firebase deploy --only hosting
```

**URL sau deploy:**
```
https://your-project.web.app
```

---

### Option 2: Vercel (Siêu nhanh)

```bash
# B1: Push code to GitHub
git add .
git commit -m "feat: Event SPA"
git push origin main

# B2: Vào vercel.com
# B3: Connect repo → Auto deploy

# URL: https://your-project.vercel.app
```

---

### Option 3: GitHub Pages

```bash
# B1: Push code to GitHub (main branch)
git add .
git commit -m "feat: Event SPA"
git push origin main

# B2: Settings → Pages → Source: main
# B3: Wait ~2 mins

# URL: https://username.github.io/repo-name
```

---

## ⚙️ Tuỳ Chỉnh

### Đổi Mật Khẩu Admin

```javascript
// firebase-config.js
const ADMIN_PASSWORD = "your-new-password";
```

### Đổi Màu Pi Network

```css
/* styles.css */
:root {
    --primary: #00ff00;        /* Xanh Pi */
    --bg: #0a0e27;             /* Nền tối */
    --card-bg: #1a1a2e;        /* Card nền */
}
```

### Đổi Font

```javascript
// app.js > setupAdminForms
select.innerHTML = `
    <option value="'Segoe UI'">Segoe UI</option>
    <option value="'Times New Roman'">Times New Roman</option>
    <option value="'Courier New'">Courier New</option>
`;
```

---

## 🐛 Troubleshooting

### ❌ "firebase is not defined"

**Nguyên nhân:** Firebase JS chưa load
**Giải pháp:** Kiểm tra `index.html` có `<script>` Firebase chưa

```html
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js"></script>
```

---

### ❌ "Firestore quota exceeded"

**Nguyên nhân:** Vượt giới hạn request
**Giải pháp:** 
- Chuyển từ "test mode" → "production mode"
- Đặt rules bảo mật tốt hơn

---

### ❌ "Canvas not rendering"

**Nguyên nhân:** eventConfig chưa có dữ liệu
**Giải pháp:**
1. Admin: Nhập sự kiện & lưu
2. Refresh guest view
3. Canvas sẽ hiển thị

---

### ❌ "Link copy không hoạt động"

**Nguyên nhân:** Browser cũ không hỗ trợ Clipboard API
**Giải pháp:** Dùng browser mới (Chrome, Firefox, Safari latest)

---

## 💡 Nâng Cấp Tiếp Theo

```
[ ] Firebase Auth - Thay password hardcode
[ ] Image Upload - Logo + background thiệp
[ ] Email Integration - Tự động gửi mời email
[ ] Analytics - Thống kê xem/xác nhận
[ ] QR Code - Check-in tại sự kiện
[ ] Multi-event - Nhiều sự kiện cùng lúc
[ ] Export PDF - In thiệp
[ ] Batch Import - Upload khách từ Excel
[ ] Pi Network Payment - Thanh toán vé
[ ] SMS Reminder - Nhắc nhở SMS
```

---

## 📝 License

MIT - Tự do sử dụng & sửa đổi

---

## 👨‍💻 Support

Gặp lỗi? Cần help?

1. **GitHub Issues** - Report bug
2. **Documentation** - Đọc README này
3. **Firebase Console** - Check Firestore data

---

**🎉 Chúc bạn tạo sự kiện thành công!**

Coded with ❤️ for Pi Network Community
