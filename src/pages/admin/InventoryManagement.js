import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './InventoryManagement.css';

const InventoryManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const { token, logout } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    images: [],
    description: '',
    benefits: '',
    price: '',
    stock: '',
    mukhi: '',
    category: ''
  });

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/products?page=${currentPage}&limit=10&search=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          return;
        }
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data.products);
      setPagination(data.pagination || {});
    } catch (err) {
      console.error(err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const url = editingProduct
        ? `${process.env.REACT_APP_API_URL}/api/admin/products/${editingProduct._id}`
        : `${process.env.REACT_APP_API_URL}/api/admin/products`;

      const method = editingProduct ? 'PUT' : 'POST';

      // Send all data as JSON, images already converted to Base64
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10)
      };

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Operation failed');
      }

      await fetchProducts();
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/products/${productId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!response.ok) throw new Error('Failed to delete product');
      await fetchProducts();
    } catch (err) {
      console.error(err);
      setError('Failed to delete product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      images: product.images.length > 0 ? product.images : [],
      description: product.description,
      benefits: product.benefits || '',
      price: product.price.toString(),
      stock: product.stock.toString(),
      mukhi: product.mukhi || '',
      category: product.category || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      images: [],
      description: '',
      benefits: '',
      price: '',
      stock: '',
      mukhi: '',
      category: ''
    });
  };

  const handleImageChange = (index, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newImages = [...formData.images];
      newImages[index] = reader.result; // Base64 string
      setFormData({ ...formData, images: newImages });
    };
    reader.readAsDataURL(file);
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  return (
    <div className="inventory-container">
      {error && <div className="error-message">{error}</div>}

      <div className="inventory-header">
        <h1>Inventory Management</h1>
        <button onClick={() => { resetForm(); setShowModal(true); }}>
          {editingProduct ? 'Edit Product' : 'Add Product'}
        </button>
      </div>

      <div className="inventory-search">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="inventory-table-container">
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : (
          <table className="inventory-table">
  <thead>
    <tr>
      <th>Image</th>
      <th>Name</th>
      <th>Stock</th>
      <th>Price</th>
      <th>Mukhi</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {products.map(product => (
      <tr key={product._id}>
        {/* Product Image */}
        <td>
          {product.images[0] ? (
            <img
              className="product-thumb"
              src={product.images[0]}
              alt={product.name}
              onError={(e) => { e.target.src = '/api/placeholder/40/40'; }}
            />
          ) : (
            <img className="product-thumb" src="/api/placeholder/40/40" alt="placeholder" />
          )}
        </td>

        {/* Product Name */}
        <td>{product.name}</td>

        {/* Stock */}
        <td>{product.stock}</td>

        {/* Price */}
        <td>Rs{product.price.toFixed(2)}</td>

        {/* Mukhi */}
        <td>{product.mukhi || 'N/A'}</td>

        {/* Actions */}
        <td>
          <button onClick={() => handleEdit(product)}>Edit</button>
          <button onClick={() => handleDelete(product._id)}>Delete</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={page === currentPage ? 'active' : ''}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />

              <div className="image-upload">
                <label>Upload Images:</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    Array.from(e.target.files).forEach((file, index) =>
                      handleImageChange(index, file)
                    );
                  }}
                />
              </div>

              <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
              <textarea placeholder="Benefits" value={formData.benefits} onChange={(e) => setFormData({ ...formData, benefits: e.target.value })} />
              <input type="number" placeholder="Price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
              <input type="number" placeholder="Stock" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required />
              <input type="text" placeholder="Mukhi" value={formData.mukhi} onChange={(e) => setFormData({ ...formData, mukhi: e.target.value })} />
              <input type="text" placeholder="Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit">{editingProduct ? 'Update Product' : 'Add Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
