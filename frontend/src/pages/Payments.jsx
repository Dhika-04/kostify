import { useEffect, useState } from 'react';
import { Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import api from '../services/api';

const initialForm = {
  tenantId: '',
  month: '',
  year: new Date().getFullYear(),
  amount: '',
  paymentMethod: 'transfer',
  status: 'paid',
  paymentDate: '',
};

const monthNames = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

function Payments() {
  const [payments, setPayments] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchData = async () => {
    try {
      const [paymentsResponse, tenantsResponse] = await Promise.all([
        api.get('/payments'),
        api.get('/tenants'),
      ]);

      setPayments(paymentsResponse.data);
      setTenants(tenantsResponse.data);
    } catch {
      setError('Gagal mengambil data pembayaran.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatRupiah = (value) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'tenantId') {
      const selectedTenant = tenants.find(
        (tenant) => tenant._id === value,
      );

      setForm((previous) => ({
        ...previous,
        tenantId: value,
        amount: selectedTenant?.roomId?.price || '',
      }));

      return;
    }

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm(initialForm);
    setError('');
    setShowForm(true);
  };

  const openEditForm = (payment) => {
    setEditingId(payment._id);

    setForm({
      tenantId: payment.tenantId?._id || '',
      month: payment.month,
      year: payment.year,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      status: payment.status,
      paymentDate: payment.paymentDate
        ? payment.paymentDate.substring(0, 10)
        : '',
    });

    setError('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      tenantId: form.tenantId,
      month: Number(form.month),
      year: Number(form.year),
      amount: Number(form.amount),
      paymentMethod: form.paymentMethod,
      status: form.status,
    };

    if (form.paymentDate) {
      payload.paymentDate = form.paymentDate;
    }

    try {
      setError('');

      if (editingId) {
        await api.put(`/payments/${editingId}`, payload);
      } else {
        await api.post('/payments', payload);
      }

      await fetchData();
      closeForm();
    } catch (err) {
      const message = err.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message.join(', ')
          : message || 'Gagal menyimpan pembayaran.',
      );
    }
  };

  const handleDelete = async (payment) => {
    const tenantName =
      payment.tenantId?.name || 'penghuni ini';

    const confirmed = window.confirm(
      `Hapus pembayaran ${tenantName} periode ${
        monthNames[payment.month - 1]
      } ${payment.year}?`,
    );

    if (!confirmed) return;

    try {
      await api.delete(`/payments/${payment._id}`);
      await fetchData();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          'Gagal menghapus pembayaran.',
      );
    }
  };

  const filteredPayments = payments.filter((payment) => {
      const keyword = search.toLowerCase();

      const tenantName =
        payment.tenantId?.name?.toLowerCase() || '';

      const tenantEmail =
        payment.tenantId?.email?.toLowerCase() || '';

      const matchesSearch =
        tenantName.includes(keyword) ||
        tenantEmail.includes(keyword);

      const matchesStatus =
        statusFilter === 'all' ||
        payment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

  return (
    <div className="page">
      <div className="page-header page-header-row">
        <div>
          <p className="eyebrow">KEUANGAN</p>
          <h1>Pembayaran</h1>
          <p className="page-description">
            Kelola pembayaran bulanan seluruh penghuni.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={openCreateForm}
        >
          <Plus size={18} />
          Tambah Pembayaran
        </button>
      </div>

      <section className="content-card">
        <div className="table-toolbar">
          <div className="search-box">
            <Search size={17} />

            <input
              type="text"
              placeholder="Cari nama atau email penghuni..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option value="all">Semua Status</option>
            <option value="paid">Lunas</option>
            <option value="unpaid">Belum Lunas</option>
          </select>
        </div>
        {loading ? (
          <p className="empty-state">
            Memuat pembayaran...
          </p>
        ) : payments.length === 0 ? (
          <p className="empty-state">
            Belum ada data pembayaran.
          </p>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Penghuni</th>
                  <th>Periode</th>
                  <th>Nominal</th>
                  <th>Metode</th>
                  <th>Tanggal Bayar</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment._id}>
                    <td>
                      <div className="payment-tenant">
                        <strong>
                          {payment.tenantId?.name ||
                            'Penghuni tidak ditemukan'}
                        </strong>

                        <small>
                          {payment.tenantId?.email || '-'}
                        </small>
                      </div>
                    </td>

                    <td>
                      <strong>
                        {monthNames[payment.month - 1]}{' '}
                        {payment.year}
                      </strong>
                    </td>

                    <td>
                      {formatRupiah(payment.amount)}
                    </td>

                    <td>
                      <span className="method-badge">
                        {payment.paymentMethod ===
                        'transfer'
                          ? 'Transfer'
                          : 'Tunai'}
                      </span>
                    </td>

                    <td>
                      {payment.paymentDate
                        ? new Date(
                            payment.paymentDate,
                          ).toLocaleDateString('id-ID')
                        : '-'}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          payment.status === 'paid'
                            ? 'available'
                            : 'maintenance'
                        }`}
                      >
                        {payment.status === 'paid'
                          ? 'Lunas'
                          : 'Belum Lunas'}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="icon-button"
                          onClick={() =>
                            openEditForm(payment)
                          }
                          title="Edit pembayaran"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="icon-button danger"
                          onClick={() =>
                            handleDelete(payment)
                          }
                          title="Hapus pembayaran"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div>
                <h2>
                  {editingId
                    ? 'Edit Pembayaran'
                    : 'Tambah Pembayaran'}
                </h2>

                <p>
                  {editingId
                    ? 'Perbarui informasi pembayaran.'
                    : 'Catat pembayaran penghuni.'}
                </p>
              </div>

              <button
                className="close-button"
                onClick={closeForm}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="form-error">
                  {error}
                </div>
              )}

              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Penghuni</label>

                  <select
                    name="tenantId"
                    value={form.tenantId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Pilih penghuni
                    </option>

                    {tenants
                      .filter(
                        (tenant) =>
                          tenant.status === 'active',
                      )
                      .map((tenant) => (
                        <option
                          key={tenant._id}
                          value={tenant._id}
                        >
                          {tenant.name} -{' '}
                          {tenant.roomId?.roomNumber ||
                            'Tanpa kamar'}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Bulan</label>

                  <select
                    name="month"
                    value={form.month}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Pilih bulan
                    </option>

                    {monthNames.map(
                      (month, index) => (
                        <option
                          key={month}
                          value={index + 1}
                        >
                          {month}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div className="form-group">
                  <label>Tahun</label>

                  <input
                    type="number"
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    min="2000"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Nominal</label>

                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    placeholder="Pilih penghuni terlebih dahulu"
                    min="0"
                    required
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label>Metode Pembayaran</label>

                  <select
                    name="paymentMethod"
                    value={form.paymentMethod}
                    onChange={handleChange}
                  >
                    <option value="transfer">
                      Transfer
                    </option>

                    <option value="cash">
                      Tunai
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="paid">
                      Lunas
                    </option>

                    <option value="unpaid">
                      Belum Lunas
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Tanggal Bayar</label>

                  <input
                    type="date"
                    name="paymentDate"
                    value={form.paymentDate}
                    onChange={handleChange}
                    required={form.status === 'paid'}
                    disabled={form.status === 'unpaid'}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeForm}
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  {editingId
                    ? 'Simpan Perubahan'
                    : 'Tambah Pembayaran'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payments;