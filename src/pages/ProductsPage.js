// src/pages/ProductsPage.js
import React, { useState, useMemo } from 'react';
import { Filter, Grid, List } from 'lucide-react';
import ProductCard from '../components/ProductCard/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useApp } from '../context/AppContext';

const ProductsPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const { 
    products, 
    isLoading, 
    searchTerm, 
    filters, 
    setFilters, 
    sortBy, 
    setSortBy, 
    viewMode, 
    setViewMode,
    resetFilters 
  } = useApp();

  const filteredProducts = useMemo(() => {
    if (isLoading) return [];
    
    return products.filter(product => {
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (filters.mukhi.length && !filters.mukhi.includes(product.mukhi)) {
        return false;
      }
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.id - a.id;
        default: // 'featured'
          return a.featured === b.featured ? 0 : a.featured ? -1 : 1;
      }
    });
  }, [products, isLoading, searchTerm, filters, sortBy]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-header">
          <h1 className="page-title">Our Collection</h1>
          <div className="products-controls">
            <div className="view-toggle">
              <button
                onClick={() => setViewMode('grid')}
                className={`view-btn ${viewMode === 'grid' ? 'view-btn-active' : ''}`}
                aria-label="Grid view"
              >
                <Grid className="view-icon" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`view-btn ${viewMode === 'list' ? 'view-btn-active' : ''}`}
                aria-label="List view"
              >
                <List className="view-icon" />
              </button>
            </div>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
              aria-label="Sort by"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="filter-btn"
              aria-label="Filters"
            >
              <Filter className="filter-icon" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="products-content">
          {/* Filters Sidebar */}
          <div className={`filters-sidebar ${showFilters ? 'filters-sidebar-open' : ''}`}>
            <h3 className="filters-title">Filters</h3>
            
            <div className="filter-group">
              <h4 className="filter-label">Mukhi Type</h4>
              <div className="filter-options">
                {[1, 5, 6, 7, 11, 14].map(mukhi => (
                  <label key={mukhi} className="filter-option">
                    <input 
                      type="checkbox" 
                      className="filter-checkbox"
                      checked={filters.mukhi.includes(mukhi)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters({ ...filters, mukhi: [...filters.mukhi, mukhi] });
                        } else {
                          setFilters({ ...filters, mukhi: filters.mukhi.filter(m => m !== mukhi) });
                        }
                      }}
                    />
                    {mukhi} Mukhi ({products.filter(p => p.mukhi === mukhi).length})
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4 className="filter-label">Price Range</h4>
              <div className="price-filter">
                <input 
                  type="range" 
                  min="0" 
                  max="5000" 
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters({ ...filters, priceRange: [0, parseInt(e.target.value)] })}
                  className="price-slider"
                />
                <div className="price-labels">
                  <span>₹0</span>
                  <span>₹{filters.priceRange[1]}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={resetFilters}
              className="clear-filters-btn"
            >
              Clear All Filters
            </button>
          </div>

          {/* Products Grid */}
          <div className="products-grid-container">
            <p className="products-count">{filteredProducts.length} products found</p>
            <div className={`products-grid ${viewMode === 'grid' ? 'grid-view' : 'list-view'}`}>
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  viewMode={viewMode}
                />
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="no-products">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search term</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;