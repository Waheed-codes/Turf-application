document.addEventListener('DOMContentLoaded', () => {
      appState.checkAuth();
      const draft = appState.getBookingDraft();
      
      if (!draft || !draft.venueId) {
        window.location.href = 'home.html';
        return;
      }
      
      const venue = VENUES.find(v => v.id === draft.venueId);
      if (!venue) {
        window.location.href = 'home.html';
        return;
      }

      // Populate review section
      document.getElementById('cd-venue').textContent = venue.name;
      document.getElementById('cd-location').textContent = venue.location;
      document.getElementById('cd-activity').textContent = venue.category;
      document.getElementById('cd-date').textContent = formatters.formatFullDate(draft.date);
      document.getElementById('cd-time').textContent = `${formatters.formatTime12h(draft.startTime)} - ${formatters.formatTime12h(draft.endTime)}`;
      document.getElementById('cd-duration').textContent = `${draft.duration} hour${draft.duration > 1 ? 's' : ''}`;
      document.getElementById('cd-total').textContent = `₹${draft.totalPrice}`;
      
      // Handle Confirm
      document.getElementById('confirm-booking-btn').addEventListener('click', () => {
        // Create booking
        const booking = {
          venueId: venue.id,
          venueName: venue.name,
          date: draft.date,
          startTime: draft.startTime,
          endTime: draft.endTime,
          duration: draft.duration,
          totalPrice: draft.totalPrice,
          status: 'Confirmed'
        };
        appState.addBooking(booking);
        
        // Hide review, show success
        document.getElementById('confirm-section').classList.add('hidden');
        document.getElementById('success-section').classList.remove('hidden');
        
        // Populate success section
        document.getElementById('t-venue').textContent = venue.name;
        document.getElementById('t-date').textContent = formatters.formatFullDate(draft.date);
        document.getElementById('t-time').textContent = `${formatters.formatTime12h(draft.startTime)} - ${formatters.formatTime12h(draft.endTime)}`;
        document.getElementById('t-total').textContent = `₹${draft.totalPrice}`;
      });
    });
