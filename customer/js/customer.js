// VenueX App Helper Module

// Storage Helpers
window.storage = {
  get(key) {
    try {
      const data = localStorage.getItem(`venuex_${key}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error reading localStorage', e);
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(`venuex_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error('Error writing localStorage', e);
    }
  },
  remove(key) {
    localStorage.removeItem(`venuex_${key}`);
  }
};

// State Management
window.appState = {
  // Favorites
  getFavorites() {
    return storage.get('favorites') || [];
  },
  toggleFavorite(venueId) {
    const favorites = this.getFavorites();
    const id = parseInt(venueId);
    const index = favorites.indexOf(id);
    if (index === -1) {
      favorites.push(id);
    } else {
      favorites.splice(index, 1);
    }
    storage.set('favorites', favorites);
    return favorites.includes(id);
  },
  isFavorite(venueId) {
    return this.getFavorites().includes(parseInt(venueId));
  },

  // Auth / Session
  getCurrentUser() {
    return storage.get('user') || { name: 'Arjun Sharma', location: 'Hyderabad, Karnataka', avatar: 'AS' };
  },
  login(name = 'Arjun Sharma') {
    const user = { name, location: 'Hyderabad, Karnataka', avatar: name.split(' ').map(n => n[0]).join('').toUpperCase() };
    storage.set('user', user);
    return user;
  },
  logout() {
    storage.remove('user');
    window.location.href = 'login.html';
  },
  checkAuth() {
    const user = storage.get('user');
    // If not logged in and not on login/index page, redirect
    const path = window.location.pathname;
    if (!user && !path.includes('login.html') && !path.includes('index.html') && path !== '/' && path !== '') {
      window.location.href = 'login.html';
    }
  },

  // Booking Draft (Details -> Availability)
  getBookingDraft() {
    return storage.get('booking_draft') || {
      venueId: null,
      date: null,
      startTime: null,
      endTime: null,
      duration: 0,
      totalPrice: 0
    };
  },
  saveBookingDraft(draft) {
    storage.set('booking_draft', draft);
  },

  // Confirmed Bookings
  getBookings() {
    return storage.get('bookings') || [];
  },
  addBooking(booking) {
    const bookings = this.getBookings();
    booking.id = 'VX-' + Math.floor(100000 + Math.random() * 900000);
    booking.createdAt = new Date().toISOString();
    bookings.push(booking);
    storage.set('bookings', bookings);
    return booking;
  }
};

// Math and Calculation Helpers
window.bookingCalc = {
  // Calculate duration in decimal hours from "HH:MM" start and end strings
  calculateDuration(startStr, endStr) {
    if (!startStr || !endStr) return 0;
    const [startH, startM] = startStr.split(':').map(Number);
    const [endH, endM] = endStr.split(':').map(Number);
    
    let startMin = startH * 60 + startM;
    let endMin = endH * 60 + endM;
    
    let diffMin = endMin - startMin;
    if (diffMin < 0) {
      // Overnight booking: add 24 hours
      diffMin += 24 * 60;
    }
    
    const duration = diffMin / 60;
    return parseFloat(duration.toFixed(2));
  },
  
  calculateTotal(hourlyRate, duration) {
    return Math.round(hourlyRate * duration);
  }
};

// Date/Time Format Helpers
window.formatters = {
  // Format HTML input time "HH:MM" to "hh:mm AM/PM"
  formatTime12h(timeStr) {
    if (!timeStr) return '';
    const [hStr, mStr] = timeStr.split(':');
    const h = parseInt(hStr);
    const m = parseInt(mStr);
    const ampm = h >= 12 ? 'AM' : 'AM'; // Wait, standard AM/PM is h >= 12 ? 'PM' : 'AM'
    // Let's implement standard 12-hour AM/PM:
    const standardAmpm = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    const displayM = m < 10 ? '0' + m : m;
    const displayHStr = displayH < 10 ? '0' + displayH : displayH;
    return `${displayHStr}:${displayM} ${standardAmpm}`;
  },
  
  // Format date YYYY-MM-DD to a nice text "Friday, July 17, 2026"
  formatFullDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  // Format date YYYY-MM-DD to short layout: "Tmrw, Jul 17" or "Today, Jul 16" or "Sat, Jul 18"
  formatShortDate(dateStr) {
    if (!dateStr) return '';
    const targetDate = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const isSameDay = (d1, d2) => d1.getFullYear() === d2.getFullYear() &&
                                   d1.getMonth() === d2.getMonth() &&
                                   d1.getDate() === d2.getDate();

    const monthName = targetDate.toLocaleDateString('en-US', { month: 'short' });
    const dayNum = targetDate.getDate();

    if (isSameDay(targetDate, today)) {
      return `Today, ${monthName} ${dayNum}`;
    } else if (isSameDay(targetDate, tomorrow)) {
      return `Tmrw, ${monthName} ${dayNum}`;
    } else {
      const weekday = targetDate.toLocaleDateString('en-US', { weekday: 'short' });
      return `${weekday}, ${monthName} ${dayNum}`;
    }
  }
};

window.availabilityHelpers = {
  // Convert HH:MM to total minutes from midnight
  parseTimeToMinutes(timeStr) {
    if (!timeStr) return 0;
    const parts = timeStr.split(':');
    if (parts.length !== 2) return 0;
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  },

  // Check if a specific ground is occupied during the given time
  isGroundOccupied(groundId, date, startTime, endTime) {
    const startMin = this.parseTimeToMinutes(startTime);
    const endMin = this.parseTimeToMinutes(endTime);

    // Check confirmed customer bookings
    const bookings = appState.getBookings();
    for (const b of bookings) {
      if (b.groundId === groundId && b.date === date) {
        if (b.status === 'Confirmed' || b.status === 'Blocked') {
          const bStart = this.parseTimeToMinutes(b.startTime);
          const bEnd = this.parseTimeToMinutes(b.endTime);
          // Overlap condition: start1 < end2 && start2 < end1
          if (startMin < bEnd && bStart < endMin) {
            return true;
          }
        }
      }
    }

    // Check owner portal blocked slots
    try {
      const ownerBlocked = localStorage.getItem(`venuex_owner_blocked_${groundId}_${date}`);
      if (ownerBlocked) {
        const blockedSlots = JSON.parse(ownerBlocked);
        for (const slot of blockedSlots) {
          const bStart = this.parseTimeToMinutes(slot.startTime);
          const bEnd = this.parseTimeToMinutes(slot.endTime);
          if (startMin < bEnd && bStart < endMin) {
            return true;
          }
        }
      }
    } catch (e) {
      console.error('Error reading owner blocked slots:', e);
    }

    return false;
  },

  // Check if a venue has at least one ground available during the given time
  isVenueAvailable(venueId, date, startTime, endTime) {
    // Determine the grounds for this venue
    // The GROUNDS object is currently in availability.html or data.js. We need to ensure it's loaded.
    // If GROUNDS is not defined globally in data.js, we assume 1 default ground if missing.
    if (typeof window.GROUNDS === 'undefined' || !window.GROUNDS[venueId]) {
      // Simulate at least one ground available if we don't have explicit ground data, but we do have owner blocks to check
      // As a fallback, check groundId = "G-V{venueId}-1" (which is the format we used in owner portal)
      const mockGroundId = `G-V${venueId}-1`;
      return !this.isGroundOccupied(mockGroundId, date, startTime, endTime);
    }

    const venueGrounds = window.GROUNDS[venueId];
    if (!venueGrounds || venueGrounds.length === 0) return false;

    // Check if at least one ground is available
    for (const ground of venueGrounds) {
      // A ground is available if its static available flag is true AND it's not occupied
      if (ground.available && !this.isGroundOccupied(ground.id, date, startTime, endTime)) {
        return true;
      }
    }
    
    return false;
  }
};

// Check Auth state on script load
document.addEventListener('DOMContentLoaded', () => {
  appState.checkAuth();
});
