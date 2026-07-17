// ============================
// VenueX Owner Portal Logic
// ============================

// --- Configuration ---
const OWNER_CONFIG = {
  credentials: {
    email: 'owner@venuex.com',
    password: 'venue123'
  },
  venue: {
    name: 'Greenfield Sports Arena',
    location: 'Koramangala, Hyderabad'
  },
  grounds: [
    { id: '1-a', name: 'Arena Pitch A (7v7)' },
    { id: '1-b', name: 'Arena Pitch B (5v5)' },
    { id: '1-c', name: 'Box Cricket Cage' }
  ],
  // Operating hours: 6 AM to 11 PM
  startHour: 6,
  endHour: 23,
  storagePrefix: 'venuex_owner'
};

// Status cycle order
const STATUS_CYCLE = ['available', 'offline', 'maintenance'];
const STATUS_LABELS = {
  available: 'Available',
  offline: 'Offline Booking',
  maintenance: 'Maintenance'
};

// --- Storage Helpers ---
const ownerStorage = {
  get(key) {
    try {
      const data = localStorage.getItem(`${OWNER_CONFIG.storagePrefix}_${key}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Storage read error:', e);
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(`${OWNER_CONFIG.storagePrefix}_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error('Storage write error:', e);
    }
  },
  remove(key) {
    localStorage.removeItem(`${OWNER_CONFIG.storagePrefix}_${key}`);
  }
};

// --- Auth ---
function isOwnerLoggedIn() {
  return ownerStorage.get('logged_in') === true;
}

function ownerLogin(email, password) {
  if (email === OWNER_CONFIG.credentials.email && password === OWNER_CONFIG.credentials.password) {
    ownerStorage.set('logged_in', true);
    return true;
  }
  return false;
}

function ownerLogout() {
  ownerStorage.remove('logged_in');
  window.location.href = 'login.html';
}

function requireAuth() {
  const path = window.location.pathname;
  if (!isOwnerLoggedIn() && !path.includes('login.html')) {
    window.location.href = 'login.html';
  }
}

// --- Time Formatting ---
function formatHour12(hour) {
  const h = hour % 12 === 0 ? 12 : hour % 12;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  return `${h.toString().padStart(2, '0')}:00 ${ampm}`;
}

function formatSlotRange(hour) {
  return `${formatHour12(hour)} – ${formatHour12(hour + 1)}`;
}

// --- Slot Data ---
function getSlotsKey(groundId, dateStr) {
  return `slots_${groundId}_${dateStr}`;
}

function getSlots(groundId, dateStr) {
  const key = getSlotsKey(groundId, dateStr);
  let slots = ownerStorage.get(key);

  if (!slots) {
    // Initialize all slots as available
    slots = {};
    for (let h = OWNER_CONFIG.startHour; h < OWNER_CONFIG.endHour; h++) {
      const timeKey = `${h.toString().padStart(2, '0')}:00`;
      slots[timeKey] = 'available';
    }
    ownerStorage.set(key, slots);
  }

  return slots;
}

function setSlotStatus(groundId, dateStr, timeKey, status) {
  const key = getSlotsKey(groundId, dateStr);
  const slots = getSlots(groundId, dateStr);
  slots[timeKey] = status;
  ownerStorage.set(key, slots);

  // Also write to shared key for customer app integration
  syncToCustomerStorage(groundId, dateStr, slots);
}

function toggleSlotStatus(groundId, dateStr, timeKey) {
  const slots = getSlots(groundId, dateStr);
  const current = slots[timeKey] || 'available';
  const currentIndex = STATUS_CYCLE.indexOf(current);
  const nextIndex = (currentIndex + 1) % STATUS_CYCLE.length;
  const nextStatus = STATUS_CYCLE[nextIndex];

  setSlotStatus(groundId, dateStr, timeKey, nextStatus);
  return nextStatus;
}

// --- Customer App Integration ---
// Write to a shared localStorage key that the customer app can read
function syncToCustomerStorage(groundId, dateStr, slots) {
  try {
    // Build a list of blocked time ranges for the customer app
    const blockedSlots = [];
    for (const [timeKey, status] of Object.entries(slots)) {
      if (status === 'offline' || status === 'maintenance') {
        const hour = parseInt(timeKey.split(':')[0]);
        blockedSlots.push({
          groundId: groundId,
          date: dateStr,
          startTime: timeKey,
          endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
          status: status === 'offline' ? 'Blocked' : 'Blocked',
          source: status === 'offline' ? 'Offline Booking' : 'Maintenance'
        });
      }
    }
    localStorage.setItem(
      `venuex_owner_blocked_${groundId}_${dateStr}`,
      JSON.stringify(blockedSlots)
    );
  } catch (e) {
    console.error('Sync error:', e);
  }
}

// --- Today's Date ---
function getTodayString() {
  const d = new Date();
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// --- Toast Notification ---
function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-8px)';
    setTimeout(() => toast.remove(), 300);
  }, 1800);
}

// --- Schedule Renderer ---
function renderSchedule(groundId, dateStr) {
  const container = document.getElementById('slots-grid');
  if (!container) return;

  const slots = getSlots(groundId, dateStr);

  container.innerHTML = '';

  for (let h = OWNER_CONFIG.startHour; h < OWNER_CONFIG.endHour; h++) {
    const timeKey = `${h.toString().padStart(2, '0')}:00`;
    const status = slots[timeKey] || 'available';

    const card = document.createElement('div');
    card.className = `slot-card status-${status}`;
    card.setAttribute('data-time', timeKey);
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `${formatSlotRange(h)} - ${STATUS_LABELS[status]}. Tap to change status.`);

    card.innerHTML = `
      <span class="slot-time">${formatSlotRange(h)}</span>
      <span class="slot-status">
        <span class="slot-status-dot"></span>
        <span class="slot-status-label">${STATUS_LABELS[status]}</span>
      </span>
    `;

    // Tap handler
    card.addEventListener('click', () => {
      const newStatus = toggleSlotStatus(groundId, dateStr, timeKey);

      // Update card classes
      card.className = `slot-card status-${newStatus}`;
      card.querySelector('.slot-status-label').textContent = STATUS_LABELS[newStatus];
      card.setAttribute('aria-label', `${formatSlotRange(h)} - ${STATUS_LABELS[newStatus]}. Tap to change status.`);

      // Tap animation
      card.classList.add('tapped');
      setTimeout(() => card.classList.remove('tapped'), 300);

      // Toast feedback
      showToast(`${formatHour12(h)} → ${STATUS_LABELS[newStatus]}`);
    });

    // Keyboard accessibility
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });

    container.appendChild(card);
  }
}

// --- Portal Page Init ---
function initPortal() {
  requireAuth();

  // Set venue name
  const venueNameEl = document.getElementById('venue-name');
  const venueLocEl = document.getElementById('venue-location');
  if (venueNameEl) venueNameEl.textContent = OWNER_CONFIG.venue.name;
  if (venueLocEl) venueLocEl.textContent = OWNER_CONFIG.venue.location;

  // Populate ground selector
  const groundSelect = document.getElementById('ground-select');
  if (groundSelect) {
    groundSelect.innerHTML = OWNER_CONFIG.grounds.map(g =>
      `<option value="${g.id}">${g.name}</option>`
    ).join('');
  }

  // Set date to today
  const dateInput = document.getElementById('date-picker');
  if (dateInput) {
    dateInput.value = getTodayString();
  }

  // Initial render
  const currentGround = groundSelect ? groundSelect.value : OWNER_CONFIG.grounds[0].id;
  const currentDate = dateInput ? dateInput.value : getTodayString();
  renderSchedule(currentGround, currentDate);

  // Ground change
  if (groundSelect) {
    groundSelect.addEventListener('change', () => {
      renderSchedule(groundSelect.value, dateInput.value);
    });
  }

  // Date change
  if (dateInput) {
    dateInput.addEventListener('change', () => {
      renderSchedule(groundSelect.value, dateInput.value);
    });
  }

  // Logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      ownerLogout();
    });
  }
}

// --- Run ---
document.addEventListener('DOMContentLoaded', () => {
  // If on portal page, initialize
  if (document.getElementById('slots-grid')) {
    initPortal();
  }
});
