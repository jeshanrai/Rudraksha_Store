// src/context/AppContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import { mockProducts } from '../data/mockData';

const AppContext = createContext();

// Initial state
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  searchTerm: '',
  filters: {
    mukhi: [],
    priceRange: [0, 5000],
    category: []
  },
  sortBy: 'featured',
  viewMode: 'grid',
  isLoading: false,
  products: []
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      localStorage.setItem('user', JSON.stringify(action.payload));
      return { ...state, user: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload };
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'RESET_FILTERS':
      return { 
        ...state, 
        filters: {
          mukhi: [],
          priceRange: [0, 5000],
          category: []
        }
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const cart = useCart();

  // Simulate loading products
  useEffect(() => {
    const loadProducts = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        dispatch({ type: 'SET_PRODUCTS', payload: mockProducts });
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadProducts();
  }, []);

  const value = {
    ...state,
    ...cart,
    setUser: (user) => dispatch({ type: 'SET_USER', payload: user }),
    setSearchTerm: (term) => dispatch({ type: 'SET_SEARCH_TERM', payload: term }),
    setFilters: (filters) => dispatch({ type: 'SET_FILTERS', payload: filters }),
    setSortBy: (sortBy) => dispatch({ type: 'SET_SORT_BY', payload: sortBy }),
    setViewMode: (viewMode) => dispatch({ type: 'SET_VIEW_MODE', payload: viewMode }),
    resetFilters: () => dispatch({ type: 'RESET_FILTERS' })
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}