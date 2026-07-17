// Local Data for VenueX
const CATEGORIES = [
  { id: 'all', name: 'All', icon: '⚡' },
  { id: 'cricket', name: 'Cricket', icon: '🏏' },
  { id: 'football', name: 'Football', icon: '⚽' },
  { id: 'badminton', name: 'Badminton', icon: '🏸' },
  { id: 'basketball', name: 'Basketball', icon: '🏀' },
  { id: 'pickleball', name: 'Pickleball', icon: '🏓' }
];

const VENUES = [
  {
    id: 1,
    name: 'Greenfield Sports Arena',
    category: 'football',
    rating: 4.9,
    reviews: 312,
    distance: '1.2 km',
    location: 'Koramangala, Hyderabad',
    pricePerHour: 800,
    availableToday: true,
    image: 'assets/football_turf.png'
  },
  {
    id: 2,
    name: 'Greenfield Sports Club',
    category: 'football',
    rating: 4.9,
    reviews: 420,
    distance: '2.3 km',
    location: 'Koramangala, Hyderabad',
    pricePerHour: 2905,
    availableToday: true,
    image: 'assets/football_turf.png'
  },
  {
    id: 3,
    name: 'Elite Cricket Ground',
    category: 'cricket',
    rating: 4.7,
    reviews: 189,
    distance: '2.8 km',
    location: 'Indiranagar, Hyderabad',
    pricePerHour: 1200,
    availableToday: true,
    image: 'assets/football_turf.png' // Re-using football turf image for cricket/turf
  },
  {
    id: 4,
    name: 'Smash Badminton Club',
    category: 'badminton',
    rating: 4.8,
    reviews: 140,
    distance: '3.5 km',
    location: 'HSR Layout, Hyderabad',
    pricePerHour: 600,
    availableToday: true,
    image: 'assets/badminton_court.png'
  },
  {
    id: 5,
    name: 'The Hoops Arena',
    category: 'basketball',
    rating: 4.6,
    reviews: 98,
    distance: '4.1 km',
    location: 'Koramangala, Hyderabad',
    pricePerHour: 1500,
    availableToday: false,
    image: 'assets/basketball_court.png'
  },
  {
    id: 6,
    name: 'Pickleball Hub',
    category: 'pickleball',
    rating: 4.9,
    reviews: 75,
    distance: '1.8 km',
    location: 'Domlur, Hyderabad',
    pricePerHour: 1000,
    availableToday: true,
    image: 'assets/pickleball_court.png'
  },
  {
    id: 7,
    name: 'Gully Cricket Academy',
    category: 'cricket',
    rating: 4.8,
    reviews: 245,
    distance: '3.4 km',
    location: 'Koramangala, Hyderabad',
    pricePerHour: 900,
    availableToday: true,
    image: 'assets/football_turf.png'
  },
  {
    id: 8,
    name: 'Chinnaswamy Nets & Turf',
    category: 'cricket',
    rating: 4.9,
    reviews: 512,
    distance: '5.1 km',
    location: 'CBD, Hyderabad',
    pricePerHour: 1500,
    availableToday: false,
    image: 'assets/football_turf.png'
  },
  {
    id: 9,
    name: 'Feather Shuttle Court',
    category: 'badminton',
    rating: 4.7,
    reviews: 112,
    distance: '2.1 km',
    location: 'Domlur, Hyderabad',
    pricePerHour: 500,
    availableToday: true,
    image: 'assets/badminton_court.png'
  },
  {
    id: 10,
    name: 'Downtown Basketball Arena',
    category: 'basketball',
    rating: 4.8,
    reviews: 80,
    distance: '3.9 km',
    location: 'Indiranagar, Hyderabad',
    pricePerHour: 1200,
    availableToday: true,
    image: 'assets/basketball_court.png'
  },
  {
    id: 11,
    name: 'Bounce Pickleball Club',
    category: 'pickleball',
    rating: 4.8,
    reviews: 65,
    distance: '2.5 km',
    location: 'HSR Layout, Hyderabad',
    pricePerHour: 900,
    availableToday: true,
    image: 'assets/pickleball_court.png'
  }
];

const GROUNDS = {
  1: [ // Greenfield Sports Arena grounds
    {
      id: '1-a',
      name: 'Arena Pitch A (7v7)',
      surface: 'Synthetic Turf',
      capacity: '14 Players',
      amenities: ['Parking', 'Washroom', 'Lighting', 'Drinking Water'],
      pricePerHour: 800,
      available: true
    },
    {
      id: '1-b',
      name: 'Arena Pitch B (5v5)',
      surface: 'Synthetic Turf',
      capacity: '10 Players',
      amenities: ['Washroom', 'Lighting', 'Drinking Water'],
      pricePerHour: 600,
      available: true
    },
    {
      id: '1-c',
      name: 'Box Cricket Cage',
      surface: 'Synthetic Grass',
      capacity: '12 Players',
      amenities: ['Lighting', 'Drinking Water'],
      pricePerHour: 700,
      available: false
    }
  ],
  2: [ // Greenfield Sports Club grounds
    {
      id: '2-a',
      name: 'Main Turf Pitch (11v11)',
      surface: 'Synthetic Grass',
      capacity: '22 Players',
      amenities: ['Parking', 'Washroom', 'Lighting', 'Drinking Water'],
      pricePerHour: 2905,
      available: true
    },
    {
      id: '2-b',
      name: 'Mini Turf Pitch (7v7)',
      surface: 'Synthetic Grass',
      capacity: '14 Players',
      amenities: ['Washroom', 'Lighting', 'Drinking Water'],
      pricePerHour: 1900,
      available: true
    },
    {
      id: '2-c',
      name: 'Indoor Box Arena',
      surface: 'Rubber Flooring',
      capacity: '10 Players',
      amenities: ['Lighting', 'Drinking Water'],
      pricePerHour: 1500,
      available: false
    }
  ],
  3: [ // Elite Cricket Ground grounds
    {
      id: '3-a',
      name: 'Main Turf Ground',
      surface: 'Natural Grass',
      capacity: '22 Players',
      amenities: ['Parking', 'Washroom', 'Lighting', 'Drinking Water'],
      pricePerHour: 1200,
      available: true
    },
    {
      id: '3-b',
      name: 'Net Practice Pitch A',
      surface: 'Clay Pitch',
      capacity: '6 Players',
      amenities: ['Lighting', 'Drinking Water'],
      pricePerHour: 500,
      available: true
    },
    {
      id: '3-c',
      name: 'Net Practice Pitch B',
      surface: 'Concrete Pitch',
      capacity: '6 Players',
      amenities: ['Drinking Water'],
      pricePerHour: 400,
      available: false
    }
  ],
  4: [ // Smash Badminton Club grounds
    {
      id: '4-a',
      name: 'Premium Wooden Court 1',
      surface: 'Polished Maple',
      capacity: '4 Players',
      amenities: ['Washroom', 'Lighting', 'Drinking Water'],
      pricePerHour: 600,
      available: true
    },
    {
      id: '4-b',
      name: 'Premium Wooden Court 2',
      surface: 'Polished Maple',
      capacity: '4 Players',
      amenities: ['Washroom', 'Lighting', 'Drinking Water'],
      pricePerHour: 600,
      available: true
    },
    {
      id: '4-c',
      name: 'Synthetic Mat Court 3',
      surface: 'Synthetic Mat',
      capacity: '4 Players',
      amenities: ['Washroom', 'Lighting'],
      pricePerHour: 500,
      available: false
    }
  ],
  5: [ // The Hoops Arena grounds
    {
      id: '5-a',
      name: 'Indoor Wooden Court',
      surface: 'Hardwood',
      capacity: '10 Players',
      amenities: ['Parking', 'Washroom', 'Lighting', 'Drinking Water'],
      pricePerHour: 1500,
      available: false
    },
    {
      id: '5-b',
      name: 'Outdoor Asphalt Court',
      surface: 'Asphalt',
      capacity: '10 Players',
      amenities: ['Washroom', 'Lighting'],
      pricePerHour: 900,
      available: false
    }
  ],
  6: [ // Pickleball Hub grounds
    {
      id: '6-a',
      name: 'Court A (Outdoor)',
      surface: 'Acrylic Cushion',
      capacity: '4 Players',
      amenities: ['Parking', 'Washroom', 'Lighting', 'Drinking Water'],
      pricePerHour: 1000,
      available: true
    },
    {
      id: '6-b',
      name: 'Court B (Indoor)',
      surface: 'Acrylic Cushion',
      capacity: '4 Players',
      amenities: ['Parking', 'Washroom', 'Lighting', 'Drinking Water'],
      pricePerHour: 1200,
      available: true
    }
  ],
  7: [
    {
      id: '7-a',
      name: 'Indoor Cricket Lane A',
      surface: 'AstroTurf',
      capacity: '8 Players',
      amenities: ['Lighting', 'Drinking Water'],
      pricePerHour: 800,
      available: true
    },
    {
      id: '7-b',
      name: 'Indoor Cricket Lane B',
      surface: 'Concrete Pitch',
      capacity: '8 Players',
      amenities: ['Lighting', 'Drinking Water'],
      pricePerHour: 600,
      available: true
    }
  ],
  8: [
    {
      id: '8-a',
      name: 'Premium Turf Pitch A',
      surface: 'Natural Grass',
      capacity: '22 Players',
      amenities: ['Parking', 'Washroom', 'Lighting', 'Drinking Water'],
      pricePerHour: 1500,
      available: false
    },
    {
      id: '8-b',
      name: 'Practice Net A',
      surface: 'Synthetic Pitch',
      capacity: '6 Players',
      amenities: ['Lighting', 'Drinking Water'],
      pricePerHour: 500,
      available: true
    }
  ],
  9: [
    {
      id: '9-a',
      name: 'Wooden Court 1',
      surface: 'Polished Maple',
      capacity: '4 Players',
      amenities: ['Washroom', 'Lighting', 'Drinking Water'],
      pricePerHour: 500,
      available: true
    },
    {
      id: '9-b',
      name: 'Wooden Court 2',
      surface: 'Polished Maple',
      capacity: '4 Players',
      amenities: ['Washroom', 'Lighting', 'Drinking Water'],
      pricePerHour: 500,
      available: false
    }
  ],
  10: [
    {
      id: '10-a',
      name: 'Main Court (Indoor)',
      surface: 'Hardwood',
      capacity: '10 Players',
      amenities: ['Parking', 'Washroom', 'Lighting', 'Drinking Water'],
      pricePerHour: 1200,
      available: true
    }
  ],
  11: [
    {
      id: '11-a',
      name: 'Cushion Court A',
      surface: 'Acrylic Cushion',
      capacity: '4 Players',
      amenities: ['Parking', 'Washroom', 'Lighting', 'Drinking Water'],
      pricePerHour: 900,
      available: true
    },
    {
      id: '11-b',
      name: 'Cushion Court B',
      surface: 'Acrylic Cushion',
      capacity: '4 Players',
      amenities: ['Parking', 'Washroom', 'Lighting', 'Drinking Water'],
      pricePerHour: 900,
      available: true
    }
  ]
};

// Map amenities to their icons/emojis
const AMENITY_ICONS = {
  'Parking': '🚗',
  'Washroom': '🚻',
  'Lighting': '💡',
  'Drinking Water': '💧'
};
