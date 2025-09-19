import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    images: [''],
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
      setPagination(data.pagination);
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

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          images: formData.images.filter(img => img.trim() !== '')
        })
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
      images: product.images.length > 0 ? product.images : [''],
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
      images: [''],
      description: '',
      benefits: '',
      price: '',
      stock: '',
      mukhi: '',
      category: ''
    });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages.length > 0 ? newImages : [''] });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/admin/dashboard" className="text-xl font-semibold text-gray-800">
                Admin Dashboard
              </Link>
              <span className="mx-2 text-gray-400">›</span>
              <span className="text-gray-600">Inventory Management</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className="bg-white w-64 min-h-screen shadow-lg p-4">
          <div className="space-y-2">
            <Link
              to="/admin/dashboard"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Dashboard
            </Link>
            <Link
              to="/admin/inventory"
              className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg"
            >
              Inventory Management
            </Link>
            <Link
              to="/admin/sales"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Sales Management
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              Add Product
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th>Product</th>
                      <th>Stock</th>
                      <th>Price</th>
                      <th>Mukhi</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td>
                          <div className="flex items-center">
                            {product.images[0] && (
                              <img
                                className="h-10 w-10 rounded-full object-cover mr-4"
                                src={product.images[0]}
                                alt={product.name}
                                onError={(e) => { e.target.src = '/api/placeholder/40/40'; }}
                              />
                            )}
                            <div>
                              <div>{product.name}</div>
                              <div className="text-gray-500 text-sm">{product.description.substring(0, 50)}...</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.stock <= 5 ? 'bg-red-100' :
                            product.stock <= 20 ? 'bg-yellow-100' : 'bg-green-100'
                          }`}>
                            {product.stock}
                          </span>
                        </td>
                        <td>${product.price.toFixed(2)}</td>
                        <td>{product.mukhi || 'N/A'}</td>
                        <td>
                          <button onClick={() => handleEdit(product)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                          <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900 ml-2">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <div>
                  <p>Page {currentPage} of {pagination.totalPages}</p>
                </div>
                <div>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={page === currentPage ? 'bg-indigo-50 text-indigo-600' : 'bg-white text-gray-500'}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50">
              <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Form Fields */}
                  <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  {/* Images */}
                  {formData.images.map((img, i) => (
                    <div key={i} className="flex">
                      <input type="url" value={img} onChange={(e) => handleImageChange(i, e.target.value)} placeholder="Image URL" />
                      {formData.images.length > 1 && <button type="button" onClick={() => removeImageField(i)}>Remove</button>}
                    </div>
                  ))}
                  <button type="button" onClick={addImageField}>+ Add image</button>

                  <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                  <textarea placeholder="Benefits" value={formData.benefits} onChange={(e) => setFormData({ ...formData, benefits: e.target.value })} />
                  <input type="number" placeholder="Price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                  <input type="number" placeholder="Stock" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required />
                  <input type="text" placeholder="Mukhi" value={formData.mukhi} onChange={(e) => setFormData({ ...formData, mukhi: e.target.value })} />
                  <input type="text" placeholder="Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />

                  <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit">{editingProduct ? 'Update Product' : 'Add Product'}</button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;
