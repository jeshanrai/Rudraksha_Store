import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "./OrderManagement.css";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProfit: 0,
  });
  const [dateFilter, setDateFilter] = useState({ startDate: "", endDate: "" });

  const { token, logout, user } = useAuth();

  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    totalAmount: "",
    customerName: "",
    customerPhone: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, [currentPage, dateFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const base = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const dateQuery =
        dateFilter.startDate && dateFilter.endDate
          ? `&startDate=${dateFilter.startDate}&endDate=${dateFilter.endDate}`
          : "";

      const response = await fetch(
        `${base}/api/orders?page=${currentPage}&limit=10${dateQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) return logout();
      if (!response.ok) throw new Error("Failed to fetch orders");

      const data = await response.json();
      const fetchedOrders = data.orders || [];
      const totalPages = data.totalPages || 1;

      let totalRevenue = 0;
      let totalProfit = 0;
      fetchedOrders.forEach((order) => {
        order.orderItems.forEach((item) => {
          const cost = item.product?.costPrice || 0;
          const profit = (item.price - cost) * item.quantity;
          totalProfit += profit;
          totalRevenue += item.price * item.quantity;
        });
      });

      setOrders(fetchedOrders);
      setTotalPages(totalPages);
      setSummary({
        totalRevenue,
        totalOrders: fetchedOrders.length,
        totalProfit,
      });
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/products?limit=1000`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.productId || !formData.quantity) {
      setError("Please select product and quantity");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/orders`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: user._id,
            orderItems: [
              {
                product: formData.productId,
                quantity: parseInt(formData.quantity),
                price: parseFloat(formData.totalAmount),
              },
            ],
            shippingAddress: {
              phone: formData.customerPhone,
              address: formData.address,
              city: "",
            },
            paymentMethod: "card",
            totalAmount: parseFloat(formData.totalAmount),
            notes: formData.notes,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add order");
      }

      await fetchOrders();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      productId: "",
      quantity: "",
      totalAmount: "",
      customerName: "",
      customerPhone: "",
      address: "",
      notes: "",
    });
    setError("");
  };

  const calculateTotal = (productId, quantity) => {
    const product = products.find((p) => p._id === productId);
    if (product && quantity !== "") {
      const discountedPrice =
        product.sellingPrice * (1 - (product.discountRate || 0) / 100);
      const total = discountedPrice * parseInt(quantity);
      setFormData((prev) => ({ ...prev, totalAmount: total.toFixed(2) }));
    } else {
      setFormData((prev) => ({ ...prev, totalAmount: "" }));
    }
  };

  const handleProductChange = (productId) => {
    setFormData((prev) => ({ ...prev, productId, totalAmount: "" }));
    if (formData.quantity !== "") calculateTotal(productId, formData.quantity);
  };

  const handleQuantityChange = (quantity) => {
    let qty = quantity === "" ? "" : parseInt(quantity);
    const selectedProduct = products.find((p) => p._id === formData.productId);

    if (selectedProduct && qty > selectedProduct.stock) {
      setError(`Cannot exceed available stock (${selectedProduct.stock})`);
      return;
    } else {
      setError("");
    }

    setFormData((prev) => ({ ...prev, quantity: qty }));
    if (formData.productId && qty !== "") calculateTotal(formData.productId, qty);
  };

const handleStatusChange = async (orderId, field, value) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/admin/orders/${orderId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [field]: value }),
      }
    );
    if (!response.ok) throw new Error("Failed to update status");
    fetchOrders(); // refresh table
  } catch (error) {
    console.error(error);
  }
};


  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount || 0);

  return (
    <div className="order-main">
      <div className="header">
        <h1>Order Management</h1>
        <button onClick={() => setShowModal(true)} className="btn-add">
          Add Order
        </button>
      </div>

      <div className="summary-cards">
        <div className="card">
          <p>Total Revenue</p>
          <h2>{formatCurrency(summary.totalRevenue)}</h2>
        </div>
        <div className="card">
          <p>Total Orders</p>
          <h2>{summary.totalOrders}</h2>
        </div>
        <div className="card">
          <p>Total Profit / Loss</p>
          <h2 style={{ color: summary.totalProfit >= 0 ? "green" : "red" }}>
            {formatCurrency(summary.totalProfit)}
          </h2>
        </div>
      </div>

      <div className="filter">
        <label>Start Date</label>
        <input
          type="date"
          value={dateFilter.startDate}
          onChange={(e) =>
            setDateFilter({ ...dateFilter, startDate: e.target.value })
          }
        />
        <label>End Date</label>
        <input
          type="date"
          value={dateFilter.endDate}
          onChange={(e) =>
            setDateFilter({ ...dateFilter, endDate: e.target.value })
          }
        />
        <button onClick={() => setDateFilter({ startDate: "", endDate: "" })}>
          Clear Filter
        </button>
      </div>

      <div className="orders-table">
        {loading ? (
          <div className="loading">Loading orders...</div>
        ) : orders.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product(s)</th>
                <th>Qty</th>
                <th>Amount</th>
                <th>Profit</th>
                <th>Payment Status</th>
                <th>Order Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                let totalProfit = 0;
                const totalQty = order.orderItems.reduce((sum, item) => {
                  totalProfit += (item.price - (item.product?.costPrice || 0)) * item.quantity;
                  return sum + item.quantity;
                }, 0);

                return (
                  <tr key={order._id}>
                    <td>{order._id.slice(-6).toUpperCase()}</td>
                    <td>{order.shippingAddress?.name || "N/A"}</td>
                    <td>{order.orderItems.map(item => item.product?.name || item.name).join(", ")}</td>
                    <td>{totalQty}</td>
                    <td>{formatCurrency(order.totalAmount)}</td>
                    <td style={{ color: totalProfit >= 0 ? "green" : "red" }}>
                      {formatCurrency(totalProfit)}
                    </td>
                    <td>
                      <select
                        value={order.paymentStatus}
                        onChange={(e) =>
                          handleStatusChange(order._id, "paymentStatus", e.target.value)
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                      </select>
                    </td>
                    <td>
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          handleStatusChange(order._id, "orderStatus", e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>{formatDate(order.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="no-orders">No orders found</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={page === currentPage ? "active" : ""}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Modal Section */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Order</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
              <label>Customer Name *</label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
              />

              <label>Phone *</label>
              <input
                type="text"
                required
                value={formData.customerPhone}
                onChange={(e) =>
                  setFormData({ ...formData, customerPhone: e.target.value })
                }
              />

              <label>Address *</label>
              <textarea
                rows="2"
                required
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />

              <label>Product *</label>
              <select
                required
                value={formData.productId}
                onChange={(e) => handleProductChange(e.target.value)}
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name} - ₹{product.sellingPrice.toFixed(2)} (Stock: {product.stock})
                  </option>
                ))}
              </select>

              <label>Quantity *</label>
              <input
                type="number"
                min="1"
                required
                value={formData.quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
              />

              <label>Total Amount *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.totalAmount}
                onChange={(e) =>
                  setFormData({ ...formData, totalAmount: e.target.value })
                }
              />

              <label>Notes</label>
              <textarea
                rows="2"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit">Add Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
