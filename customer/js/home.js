document.addEventListener('DOMContentLoaded', () => {
      appState.checkAuth();

      let activeCategory = 'all';
      let selectedDate = new Date(); // default today
      let selectedStartTime = '';
      let selectedEndTime = '';
      let isSearchExecuted = false;

      const validateSearch = () => {
        const btn = document.getElementById('find-venues-btn');
        if (selectedDate && selectedStartTime && selectedEndTime) {
          btn.disabled = false;
        } else {
          btn.disabled = true;
        }
        
        if (isSearchExecuted) {
          renderVenues();
        }
      };

      document.getElementById('find-venues-btn').addEventListener('click', () => {
        isSearchExecuted = true;
        document.getElementById('available-venues-title').style.display = 'block';
        document.getElementById('venue-list').style.display = 'block';
        renderVenues();
      });

      // Add time formatting helper
      const formatTime12hOptions = (h) => {
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 === 0 ? 12 : h % 12;
        return `${displayH}:00 ${ampm}`;
      };

      // Populate Dates
      const renderDates = () => {
        const container = document.getElementById('date-container');
        let html = '';
        const today = new Date();
        for (let i = 0; i < 14; i++) {
          const d = new Date(today);
          d.setDate(today.getDate() + i);
          
          const isSameDay = (d1, d2) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
          
          const isActive = isSameDay(d, selectedDate) ? 'active' : '';
          const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
          const dayNum = d.getDate();
          const monthStr = d.toLocaleDateString('en-US', { month: 'short' });
          
          html += `
            <div class="date-chip ${isActive}" data-date="${d.toISOString()}">
              <div class="date-chip-day">${weekday}</div>
              <div class="date-chip-date">${dayNum}</div>
              <div class="date-chip-month">${monthStr}</div>
            </div>
          `;
        }
        container.innerHTML = html;

        container.querySelectorAll('.date-chip').forEach(chip => {
          chip.addEventListener('click', (e) => {
            selectedDate = new Date(e.currentTarget.getAttribute('data-date'));
            renderDates();
            validateSearch();
          });
        });
      };

      // Populate Times
      const renderTimes = () => {
        const startSelect = document.getElementById('start-time-select');
        const endSelect = document.getElementById('end-time-select');
        
        let startHtml = '<option value="" disabled selected hidden>0:00</option>';
        for(let i=0; i<24; i++) {
          const val = `${i.toString().padStart(2, '0')}:00`;
          startHtml += `<option value="${val}">${formatTime12hOptions(i)}</option>`;
        }
        startSelect.innerHTML = startHtml;

        startSelect.addEventListener('change', (e) => {
          selectedStartTime = e.target.value;
          endSelect.disabled = false;
          
          // Re-populate end times to only show times after start time
          const startHour = parseInt(selectedStartTime.split(':')[0]);
          let endHtml = '<option value="" disabled selected hidden>0:00</option>';
          for(let i=startHour + 1; i<=24; i++) {
             // Handle 24 as 00:00 next day if needed, but for simplicity we stop at 24:00/00:00
             if(i === 24) {
                endHtml += `<option value="23:59">11:59 PM</option>`;
             } else {
                const val = `${i.toString().padStart(2, '0')}:00`;
                endHtml += `<option value="${val}">${formatTime12hOptions(i)}</option>`;
             }
          }
          endSelect.innerHTML = endHtml;
          
          // If previous end time is now invalid, clear it
          if(selectedEndTime) {
            const endHour = parseInt(selectedEndTime.split(':')[0]) || (selectedEndTime === '23:59' ? 24 : 0);
            if(endHour <= startHour) {
              selectedEndTime = '';
              endSelect.value = '';
            } else {
              endSelect.value = selectedEndTime;
            }
          }
          validateSearch();
        });

        endSelect.addEventListener('change', (e) => {
          selectedEndTime = e.target.value;
          validateSearch();
        });
      };

      const renderCategories = () => {
        const container = document.getElementById('categories-container');
        container.innerHTML = CATEGORIES.map(c => `
          <div class="category-chip ${c.id === activeCategory ? 'active' : ''}" data-id="${c.id}">
            ${c.icon} ${c.name}
          </div>
        `).join('');

        container.querySelectorAll('.category-chip').forEach(chip => {
          chip.addEventListener('click', (e) => {
            activeCategory = e.currentTarget.getAttribute('data-id');
            renderCategories();
            if (isSearchExecuted) renderVenues();
          });
        });
      };

      const renderVenues = () => {
        const searchQuery = document.getElementById('search-input').value;
        const container = document.getElementById('venue-list');
        
        let filtered = VENUES.filter(v => {
          const matchCat = activeCategory === 'all' || v.category === activeCategory;
          const matchSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              v.location.toLowerCase().includes(searchQuery.toLowerCase());
          
          let matchAvailability = true;
          if (selectedStartTime && selectedEndTime) {
            // Check availability through appState helper
            const dStr = selectedDate.toISOString().split('T')[0];
            // availabilityHelpers logic
            matchAvailability = window.availabilityHelpers.isVenueAvailable(v.id, dStr, selectedStartTime, selectedEndTime);
          }

          return matchCat && matchSearch && matchAvailability;
        });

        if (filtered.length === 0) {
          container.innerHTML = `<div style="text-align:center; padding: 40px 0; color: var(--text-muted);">No available venues found for the selected time and criteria.</div>`;
          return;
        }

        container.innerHTML = filtered.map(v => {
          const isFav = appState.isFavorite(v.id);
          const badgeClass = v.availableToday ? 'status-available' : 'status-unavailable';
          const badgeText = v.availableToday ? 'Available Today' : 'Fully Booked';

          return `
            <div class="venue-card" onclick="handleVenueSelect(${v.id}, ${v.pricePerHour})">
              <div class="venue-img-wrapper">
                <img class="venue-img" src="${v.image}" alt="${v.name}" loading="lazy">
                <div class="status-badge ${badgeClass}">${badgeText}</div>
                <button class="fav-btn ${isFav ? 'active' : ''}" data-id="${v.id}" onclick="toggleFav(event, ${v.id})">
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
              </div>
              <div class="venue-details">
                <div class="venue-header-row">
                  <div class="venue-name">${v.name}</div>
                  <div class="venue-rating">
                    <svg viewBox="0 0 24 24" width="14" height="14"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    ${v.rating}
                  </div>
                </div>
                <div class="venue-meta">${v.distance} &bull; ${v.location}</div>
                <div class="venue-price">₹${v.pricePerHour} <span>/ hour</span></div>
              </div>
            </div>
          `;
        }).join('');
      };

      window.toggleFav = (e, id) => {
        e.stopPropagation();
        const active = appState.toggleFavorite(id);
        const btn = e.currentTarget;
        if(active) btn.classList.add('active');
        else btn.classList.remove('active');
      };

      window.handleVenueSelect = (id, pricePerHour) => {
        if (!selectedStartTime || !selectedEndTime) {
          alert('Please select both a start time and an end time to book.');
          return;
        }
        
        const dStr = selectedDate.toISOString().split('T')[0];
        const duration = window.bookingCalc.calculateDuration(selectedStartTime, selectedEndTime);
        const totalPrice = window.bookingCalc.calculateTotal(pricePerHour, duration);
        
        const draft = {
          venueId: id,
          date: dStr,
          startTime: selectedStartTime,
          endTime: selectedEndTime,
          duration: duration,
          totalPrice: totalPrice
        };
        appState.saveBookingDraft(draft);
        window.location.href = 'confirmation.html';
      };

      document.getElementById('search-input').addEventListener('input', () => {
        if (isSearchExecuted) renderVenues();
      });

      renderDates();
      renderTimes();
      renderCategories();
      
      document.getElementById('profile-btn').addEventListener('click', () => {
        appState.logout();
      });
    });
