# VenueX - Mobile Venue Booking Application (V1 MVP)

**VenueX** is a premium, minimal, mobile-first venue booking application built using vanilla HTML5, CSS3, and ES6 JavaScript. The design is inspired by the clean aesthetics of Apple and Airbnb, featuring a light minimalist theme, gray primary colors (`#4B5563`), soft shadows, rounded corners, and micro-animations.

---

## 📱 Live Demo (Desktop vs. Mobile Viewport)

*   **On Desktop screens**: The application renders inside an iPhone-like phone frame simulator (`390px` width) centered in the viewport, creating a realistic app-like presentation.
*   **On Mobile screens**: The layout naturally adapts to a full-bleed interface for native-like interactions.

---

## 📁 Project Structure

```
Turf-application/
├── index.html            <- Loading Splash Screen (auto-redirects in 1.5s)
├── login.html            <- Clean Minimal White Login Screen (Google, Apple, Phone SSO and Form Login)
├── home.html             <- Dashboard with live Search, Category Chips, Featured Cards, Tab Navigation
├── venue-details.html    <- Venue information page, Horizontal date picker, Start/End HTML5 time selection
├── availability.html     <- List of grounds/courts per venue (fades unavailable options, Book Now trigger)
├── confirmation.html     <- Animated success checkmark, confetti effect, receipt summary
├── css/
│   └── style.css         <- Unified style sheets, variables, UI cards, and responsive wrapper
├── js/
│   ├── data.js           <- Mock Database (Venues, Grounds, Categories, Amenities, and Pricing rates)
│   └── app.js            <- Core Application logic (localStorage sync, Duration/Price Math, Date formatters)
├── assets/
│   ├── football_turf.png      <- Image asset for fields and courts
│   ├── badminton_court.png    <- Image asset for indoor courts
│   ├── basketball_court.png   <- Image asset for hardwood courts
│   └── pickleball_court.png   <- Image asset for pickleball courts
└── README.md             <- Project documentation
```

---

## ⚡ Features Implemented

1.  **Splash & Onboarding**: Smooth loading logo spinner that forwards the user automatically to the minimal white login interface.
2.  **SSO & Credential Entry**: Interactive SSO options (Apple, Google, Phone) and phone/email mock credential validation that creates an active user session.
3.  **Dynamic Search & Filtering**: Instant title/location search matching, paired with category chips that filter featured and nearby listings in real-time.
4.  **Favorites Persistence**: Heart favorite buttons on the dashboard and details pages instantly sync turf preferences to `localStorage` and display in a dedicated "Favorites" tab.
5.  **Reactive Booking Engine**:
    *   **Date Picker**: Generates a dynamic horizontal strip of dates (starting with current local system date). Includes an inline custom date picker calendar tool for arbitrary selections.
    *   **Time Picker**: Dual time box elements overlaying native time inputs.
    *   **Automatic Calculations**: Duration is parsed instantly (handles standard hours). Total estimated fee is recalculated reactively ($EstimatedTotal = Rate \times Duration$).
6.  **Ground Selection**: Renders a list of fields/courts for the venue, displaying specific surface parameters, player capacity, and amenity tags. Unavailable slots fade out and display an "Unavailable" badge.
7.  **In-App Tab Switching**: Bottom navigation switches dashboard pages dynamically (Home Dashboard, Bookings ticket list, Starred Favorites, and Profile config) without full-page reloads.
8.  **Checkout & Confetti Success**: Generates a unique `VX-******` reservation ticket on purchase, pushes it to local storage history, and pops a colorful confetti burst effect on checkout.

---

## 🛠️ How to Run Locally

Since this is a client-side vanilla web application, it does not require a complex build or server environment:

### Option A: Local Browser Opening
1.  Navigate to the project root folder.
2.  Double-click `index.html` (or drag it into any modern web browser like Google Chrome, Safari, or Microsoft Edge).

### Option B: Local Web Server
If you want to serve it using a local dev server (like VS Code Live Server or Python's HTTP Server):
1.  Run:
    ```bash
    python3 -m http.server 8000
    ```
2.  Open your browser and navigate to:
    ```
    http://localhost:8000/index.html
    ```