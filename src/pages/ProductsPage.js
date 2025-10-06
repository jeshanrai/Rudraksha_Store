// src/pages/ProductsPage.js
import React, { useState, useEffect, useMemo } from 'react';
import { Filter, Grid, List } from 'lucide-react';
import ProductCard from '../components/ProductCard/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI States
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Filters & Sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ mukhi: [] });
  const [sortBy, setSortBy] = useState('featured');

  // ================== FETCH PRODUCTS ==================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch('http://localhost:5000/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();

        // ✅ Normalize product fields (important for ProductCard)
        const normalized = data.map((p) => ({
          ...p,
          price: p.sellingPrice || p.price || 0,
          originalPrice: p.originalPrice || p.mrp || p.sellingPrice || 0,
          image: p.image || '',
          stock: p.stock ?? 10,
          rating: p.rating ?? 0,
          reviews: p.reviews ?? 0,
        }));

        setProducts(normalized);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ================== FILTERING & SORTING ==================
  const filteredProducts = useMemo(() => {
    if (isLoading) return [];

    let filtered = [...products];

    // 🔍 Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 🔢 Mukhi filter
    if (filters.mukhi.length > 0) {
      filtered = filtered.filter((p) => filters.mukhi.includes(p.mukhi));
    }

    // 🔄 Sorting logic
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    return filtered;
  }, [products, isLoading, searchTerm, filters, sortBy]);

  const resetFilters = () => {
    setFilters({ mukhi: [] });
    setSearchTerm('');
    setSortBy('featured');
  };

  // ================== LOADING & ERROR STATES ==================
  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="error-message">
        <h3>Failed to load products</h3>
        <p>{error}</p>
      </div>
    );

  // ================== MAIN RETURN ==================
  return (
    <div className="products-page">
      <div className="container">
        {/* ================== HEADER ================== */}
        <div className="products-header">
          <h1 className="page-title">Our Collection</h1>

          <div className="products-controls">
            {/* 🔍 Search Box */}
            <input
              type="text"
              placeholder="Search products..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* 🔄 View Toggle */}
            <div className="view-toggle">
              <button
                onClick={() => setViewMode('grid')}
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                title="Grid View"
              >
                <Grid className="view-icon" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                title="List View"
              >
                <List className="view-icon" />
              </button>
            </div>

            {/* 🔽 Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>

            {/* ⚙️ Filters Button */}
            <button
              onClick={() => setShowFilters((prev) => !prev)}
              className="filter-btn"
            >
              <Filter className="filter-icon" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* ================== FILTERS + PRODUCTS ================== */}
        <div className="products-content">
          {/* FILTER SIDEBAR */}
          <aside
            className={`filters-sidebar ${
              showFilters ? 'filters-sidebar-open' : ''
            }`}
          >
            <h3 className="filters-title">Filters</h3>

            {/* Mukhi Filter */}
            <div className="filter-group">
              <h4 className="filter-label">Mukhi Type</h4>
              <div className="filter-options">
                {[1, 5, 6, 7, 11, 14].map((mukhi) => (
                  <label key={mukhi} className="filter-option">
                    <input
                      type="checkbox"
                      checked={filters.mukhi.includes(mukhi)}
                      onChange={(e) => {
                        setFilters((prev) => ({
                          ...prev,
                          mukhi: e.target.checked
                            ? [...prev.mukhi, mukhi]
                            : prev.mukhi.filter((m) => m !== mukhi),
                        }));
                      }}
                    />
                    {mukhi} Mukhi (
                    {products.filter((p) => p.mukhi === mukhi).length})
                  </label>
                ))}
              </div>
            </div>

            <button onClick={resetFilters} className="clear-filters-btn">
              Clear All Filters
            </button>
          </aside>

          {/* PRODUCTS SECTION */}
          <section className="products-grid-container">
            <p className="products-count">
              {filteredProducts.length} products found
            </p>

            {filteredProducts.length === 0 ? (
              <div className="no-products">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search term</p>
              </div>
            ) : (
              <div
                className={`products-grid ${
                  viewMode === 'grid' ? 'grid-view' : 'list-view'
                }`}
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
