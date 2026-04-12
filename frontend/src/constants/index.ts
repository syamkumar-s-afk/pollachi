/**
 * Centralized application constants.
 * Single source of truth for categories, cities, and sub-categories
 * used across Home, Listings, and Admin pages.
 */

export const CATEGORIES = [
  'Education',
  'Finance',
  'Food & Beverage',
  'Healthcare',
  'Real Estate',
  'Retail',
  'Services',
  'Technology',
  'Travel & Transport',
  'Automotive',
  'Grocery',
  'Restaurant',
] as const;

export const ALL_SUB_CATEGORIES = [
  'School',
  'College',
  'Restaurant',
  'Cafe',
  'Hospital',
  'Clinic',
  'Pharmacy',
  'Supermarket',
  "Men's Wear",
  "Women's Wear",
  'Electronics',
  'Automotive Repair',
  'Hotels',
  'Vegetable, Milk',
  'Non-veg',
  'Veg',
] as const;

export const CATEGORY_MAP: Record<string, string[]> = {
  Education: ['School', 'College'],
  'Food & Beverage': ['Cafe'],
  Healthcare: ['Hospital', 'Clinic', 'Pharmacy'],
  Retail: ['Supermarket', "Men's Wear", "Women's Wear", 'Electronics'],
  Services: ['Hotels'],
  Automotive: ['Automotive Repair'],
  Grocery: ['Vegetable, Milk'],
  Restaurant: ['Veg', 'Non-veg', 'Restaurant'],
};

export const CITIES = [
  'Ariyalur',
  'Chengalpattu',
  'Chennai',
  'Coimbatore',
  'Cuddalore',
  'Dharmapuri',
  'Dindigul',
  'Erode',
  'Kallakurichi',
  'Kanchipuram',
  'Kanyakumari',
  'Karur',
  'Krishnagiri',
  'Madurai',
  'Mayiladuthurai',
  'Nagapattinam',
  'Namakkal',
  'Nilgiris',
  'Perambalur',
  'Pudukkottai',
  'Ramanathapuram',
  'Ranipet',
  'Salem',
  'Sivaganga',
  'Tenkasi',
  'Thanjavur',
  'Theni',
  'Thoothukudi',
  'Tiruchirappalli',
  'Tirunelveli',
  'Tirupathur',
  'Tiruppur',
  'Tiruvallur',
  'Tiruvannamalai',
  'Tiruvarur',
  'Vellore',
  'Viluppuram',
  'Virudhunagar',
] as const;

export const ITEMS_PER_PAGE = 20;

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
