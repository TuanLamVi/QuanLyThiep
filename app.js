// app.js - Event SPA Core Logic

// ==================== STATE ====================
const state = {
    isAdmin: false,
    guestId: null,
    eventConfig: {},
    templateConfig: {},
    guests: [],
    currentGuestData: null
};

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 App initialized');
    await checkRouting();
});

// ==================== ROUTING ====================
async function checkRouting() {
    const params = new URLSearchParams(window.location.search);
    const guestId = params.get('guestId');

    if (guestId) {
        // Guest View
        state.guestId = guestId;
        showView('guestView');
        await loadGuestView();
    } else {
        // Admin View
        showView('adminLoginView');
        setupAdminLoginForm();
    }
}

function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');
}

// ==================== ADMIN LOGIN ====================
function setupAdminLoginForm() {
    const form = document.getElementById('adminLoginForm');
    const errorMsg = document.getElementById('loginError');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('adminPassword').value;

        if (password === ADMIN_PASSWORD) {
            state.isAdmin = true;
            errorMsg.textContent = '';
            showAdminDashboard();
        } else {
            errorMsg.textContent = '❌ Mật khẩu không đúng!';
            document.getElementById('adminPassword').value = '';
        }
    });
}

function setupLogout() {
    document.getElementById('logoutBtn').addEventListener('click', () => {
        state.isAdmin = false;
        state.guests = [];
        state.eventConfig = {};
        document.getElementById('adminPassword').value = '';
        showView('adminLoginView');
        setupAdminLoginForm();
    });
}

// ==================== ADMIN DASHBOARD ====================
async function showAdminDashboard() {
    showView('adminDashboardView');
    setupLogout();
    await loadAdminData();
    setupAdminForms();
    displayGuestsTable();
    setupGuestForm();
}

async function loadAdminData() {
    try {
        showLoading(true);

        // Load Event Config
        const eventDoc = await db.collection('eventConfig').doc('main').get();
        if (eventDoc.exists) {
            state.eventConfig = eventDoc.data();
            populateEventForm(state.eventConfig);
        }

        // Load Template Config
        const templateDoc = await db.collection('templateConfig').doc('main').get();
        if (templateDoc.exists) {
            state.templateConfig = templateDoc.data();
            populateTemplateForm(state.templateConfig);
        }

        // Load Guests
        const guestsSnapshot = await db.collection('guests').orderBy('createdAt', 'desc').get();
        state.guests = [];
        guestsSnapshot.forEach(doc => {
            state.guests.push({ id: doc.id, ...doc.data() });
        });

        showLoading(false);
    } catch (error) {
        console.error('❌ Lỗi tải dữ liệu:', error);
        showLoading(false);
        alert('Lỗi tải dữ liệu: ' + error.message);
    }
}

function populateEventForm(config) {
    if (config.name) document.getElementById('eventName').value = config.name;
    if (config.date) document.getElementById('eventDate').value = config.date;
    if (config.location) document.getElementById('eventLocation').value = config.location;
    if (config.description) document.getElementById('eventDescription').value = config.description;
}

function populateTemplateForm(config) {
    if (config.bgColor) document.getElementById('bgColor').value = config.bgColor;
    if (config.textColor) document.getElementById('textColor').value = config.textColor;
    if (config.fontFamily) document.getElementById('fontFamily').value = config.fontFamily;
}

// ==================== ADMIN FORMS ====================
function setupAdminForms() {
    // Event Config Form
    document.getElementById('eventConfigForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const eventData = {
            name: document.getElementById('eventName').value,
            date: document.getElementById('eventDate').value,
            location: document.getElementById('eventLocation').value,
            description: document.getElementById('eventDescription').value,
            updatedAt: new Date().toISOString()
        };

        try {
            showLoading(true);
            await db.collection('eventConfig').doc('main').set(eventData, { merge: true });
            state.eventConfig = eventData;
            showSuccess('✅ Lưu cấu hình sự kiện thành công!');
            showLoading(false);
        } catch (error) {
            console.error('❌ Lỗi lưu:', error);
            showLoading(false);
            alert('Lỗi: ' + error.message);
        }
    });

    // Template Config Form
    document.getElementById('templateConfigForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const templateData = {
            bgColor: document.getElementById('bgColor').value,
            textColor: document.getElementById('textColor').value,
            fontFamily: document.getElementById('fontFamily').value,
            updatedAt: new Date().toISOString()
        };

        try {
            showLoading(true);
            await db.collection('templateConfig').doc('main').set(templateData, { merge: true });
            state.templateConfig = templateData;
            showSuccess('✅ Lưu thiết kế thành công!');
            showLoading(false);
        } catch (error) {
            console.error('❌ Lỗi lưu:', error);
            showLoading(false);
            alert('Lỗi: ' + error.message);
        }
    });
}

// ==================== GUEST MANAGEMENT ====================
function setupGuestForm() {
    document.getElementById('addGuestForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('guestName').value.trim();
        const note = document.getElementById('guestNote').value.trim();

        if (!name) {
            alert('⚠️ Vui lòng nhập tên khách');
            return;
        }

        try {
            showLoading(true);
            const newGuest = {
                name,
                note,
                sent: false,
                attended: null,
                createdAt: new Date().toISOString()
            };

            const docRef = await db.collection('guests').add(newGuest);
            state.guests.push({ id: docRef.id, ...newGuest });

            // Clear form
            document.getElementById('guestName').value = '';
            document.getElementById('guestNote').value = '';

            displayGuestsTable();
            showSuccess('✅ Thêm khách mới thành công!');
            showLoading(false);
        } catch (error) {
            console.error('❌ Lỗi thêm khách:', error);
            showLoading(false);
            alert('Lỗi: ' + error.message);
        }
    });
}

function displayGuestsTable() {
    const tbody = document.querySelector('#guestsTable tbody');
    tbody.innerHTML = '';

    state.guests.forEach(guest => {
        const inviteLink = `${window.location.origin}${window.location.pathname}?guestId=${guest.id}`;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${guest.id.substring(0, 8)}</td>
            <td>${guest.name}</td>
            <td>${guest.note || '—'}</td>
            <td>
                <span class="sent-${guest.sent ? 'yes' : 'no'}">
                    ${guest.sent ? '✅ Có' : '❌ Chưa'}
                </span>
            </td>
            <td>
                <button class="copy-link-btn" onclick="copyToClipboard('${inviteLink}', this)">
                    📋 Copy
                </button>
            </td>
            <td>
                <button class="btn btn-warning" onclick="markSent('${guest.id}')" style="padding:6px 12px; font-size:12px;">
                    ✉️ Đã gửi
                </button>
                <button class="btn btn-danger" onclick="deleteGuest('${guest.id}')" style="padding:6px 12px; font-size:12px;">
                    🗑️ Xóa
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function copyToClipboard(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        btn.textContent = '✅ Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.textContent = '📋 Copy';
            btn.classList.remove('copied');
        }, 2000);
    });
}

async function markSent(guestId) {
    try {
        showLoading(true);
        await db.collection('guests').doc(guestId).update({
            sent: true,
            sentAt: new Date().toISOString()
        });

        const guest = state.guests.find(g => g.id === guestId);
        if (guest) guest.sent = true;

        displayGuestsTable();
        showSuccess('✅ Đã đánh dấu gửi!');
        showLoading(false);
    } catch (error) {
        console.error('❌ Lỗi:', error);
        showLoading(false);
    }
}

async function deleteGuest(guestId) {
    if (confirm('🗑️ Bạn chắc chắn muốn xóa khách này?')) {
        try {
            showLoading(true);
            await db.collection('guests').doc(guestId).delete();
            state.guests = state.guests.filter(g => g.id !== guestId);
            displayGuestsTable();
            showSuccess('✅ Xóa khách thành công!');
            showLoading(false);
        } catch (error) {
            console.error('❌ Lỗi xóa:', error);
            showLoading(false);
        }
    }
}

// ==================== GUEST VIEW ====================
async function loadGuestView() {
    try {
        showLoading(true);

        // Load guest data
        const guestDoc = await db.collection('guests').doc(state.guestId).get();
        if (!guestDoc.exists) {
            alert('❌ Khách không tồn tại');
            window.location.href = '/';
            return;
        }

        state.currentGuestData = { id: guestDoc.id, ...guestDoc.data() };

        // Load event config
        const eventDoc = await db.collection('eventConfig').doc('main').get();
        state.eventConfig = eventDoc.data() || {};

        // Load template config
        const templateDoc = await db.collection('templateConfig').doc('main').get();
        state.templateConfig = templateDoc.data() || {};

        // Draw invitation
        drawInvitationCanvas();

        // Setup buttons
        setupGuestButtons();

        showLoading(false);
    } catch (error) {
        console.error('❌ Lỗi tải view khách:', error);
        showLoading(false);
    }
}

function drawInvitationCanvas() {
    const canvas = document.getElementById('invitationCanvas');
    const ctx = canvas.getContext('2d');

    const bgColor = state.templateConfig.bgColor || '#1a1a2e';
    const textColor = state.templateConfig.textColor || '#00ff00';
    const fontFamily = state.templateConfig.fontFamily || 'Arial';

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Main title
    ctx.fillStyle = textColor;
    ctx.font = `bold 48px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.fillText('🎉 BẠN ĐƯỢC MỜI 🎉', canvas.width / 2, 100);

    // Event name
    ctx.font = `36px ${fontFamily}`;
    ctx.fillText(state.eventConfig.name || 'Sự kiện', canvas.width / 2, 180);

    // Separator
    ctx.strokeStyle = textColor;
    ctx.beginPath();
    ctx.moveTo(100, 220);
    ctx.lineTo(canvas.width - 100, 220);
    ctx.stroke();

    // Event details
    ctx.font = `18px ${fontFamily}`;
    ctx.textAlign = 'center';
    const details = [
        `📅 ${formatDate(state.eventConfig.date) || 'TBD'}`,
        `📍 ${state.eventConfig.location || 'Địa điểm'}`,
        `👤 ${state.currentGuestData.name}`
    ];

    let yPos = 300;
    details.forEach(detail => {
        ctx.fillText(detail, canvas.width / 2, yPos);
        yPos += 50;
    });

    // Description
    if (state.eventConfig.description) {
        ctx.font = `14px ${fontFamily}`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        const maxWidth = canvas.width - 80;
        const lineHeight = 20;
        const words = state.eventConfig.description.split(' ');
        let line = '';
        let textYPos = 500;

        words.forEach(word => {
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth) {
                ctx.fillText(line, canvas.width / 2, textYPos);
                line = word + ' ';
                textYPos += lineHeight;
            } else {
                line = testLine;
            }
        });
        if (line) ctx.fillText(line, canvas.width / 2, textYPos);
    }

    // Footer
    ctx.fillStyle = textColor;
    ctx.font = `14px ${fontFamily}`;
    ctx.fillText('⭐ Cảm ơn bạn đã sẽ dự!', canvas.width / 2, canvas.height - 50);
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function setupGuestButtons() {
    document.getElementById('attendBtn').addEventListener('click', async () => {
        await updateGuestResponse(true);
    });

    document.getElementById('declineBtn').addEventListener('click', async () => {
        await updateGuestResponse(false);
    });
}

async function updateGuestResponse(attended) {
    try {
        showLoading(true);
        await db.collection('guests').doc(state.guestId).update({
            attended,
            respondedAt: new Date().toISOString()
        });

        const msgEl = document.getElementById('guestMessage');
        msgEl.textContent = attended
            ? '✅ Cảm ơn! Chúng tôi rất vui khi bạn sẽ đến.'
            : '😢 Rất tiếc bạn không thể tham gia.';
        msgEl.style.display = 'block';

        document.getElementById('attendBtn').disabled = true;
        document.getElementById('declineBtn').disabled = true;

        showLoading(false);
    } catch (error) {
        console.error('❌ Lỗi cập nhật phản hồi:', error);
        showLoading(false);
        alert('Lỗi: ' + error.message);
    }
}

// ==================== UTILS ====================
function showLoading(show) {
    document.getElementById('loadingSpinner').classList.toggle('hidden', !show);
}

function showSuccess(message) {
    const msgEl = document.createElement('div');
    msgEl.className = 'success-msg';
    msgEl.textContent = message;
    msgEl.style.position = 'fixed';
    msgEl.style.top = '20px';
    msgEl.style.right = '20px';
    msgEl.style.zIndex = '10000';
    msgEl.style.animation = 'slideIn 0.3s ease-out';
    document.body.appendChild(msgEl);

    setTimeout(() => msgEl.remove(), 3000);
}

// Add animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
