import { useEffect, useState } from 'react';
import { Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import api from '../services/api';

const initialForm = {
  name: '',
  phone: '',
  email: '',
  roomId: '',
  checkInDate: '',
  status: 'active',
};

function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchData = async () => {
    try {
      const [tenantsResponse, roomsResponse] = await Promise.all([
        api.get('/tenants'),
        api.get('/rooms'),
      ]);

      setTenants(tenantsResponse.data);
      setRooms(roomsResponse.data);
    } catch {
      setError('Gagal mengambil data penghuni.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

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

  const openEditForm = (tenant) => {
    setEditingId(tenant._id);

    setForm({
      name: tenant.name,
      phone: tenant.phone,
      email: tenant.email,
      roomId: tenant.roomId?._id || '',
      checkInDate: tenant.checkInDate
        ? tenant.checkInDate.substring(0, 10)
        : '',
      status: tenant.status,
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

    try {
      setError('');

      if (editingId) {
        await api.put(`/tenants/${editingId}`, form);
      } else {
        await api.post('/tenants', form);
      }

      await fetchData();
      closeForm();
    } catch (err) {
      const message = err.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message.join(', ')
          : message || 'Gagal menyimpan data penghuni.',
      );
    }
  };

  const handleDelete = async (tenant) => {
    const confirmed = window.confirm(
      `Hapus penghuni ${tenant.name}? Kamar akan kembali tersedia.`,
    );

    if (!confirmed) return;

    try {
      await api.delete(`/tenants/${tenant._id}`);
      await fetchData();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          'Gagal menghapus data penghuni.',
      );
    }
  };

  const getAvailableRooms = () => {
    return rooms.filter((room) => {
      if (room.status === 'available') return true;

      if (
        editingId &&
        room._id === form.roomId
      ) {
        return true;
      }

      return false;
    });
  };

  const filteredTenants = tenants.filter((tenant) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      tenant.name?.toLowerCase().includes(keyword) ||
      tenant.email?.toLowerCase().includes(keyword) ||
      tenant.phone?.toLowerCase().includes(keyword) ||
      tenant.roomId?.roomNumber
        ?.toLowerCase()
        .includes(keyword);

    const matchesStatus =
      statusFilter === 'all' ||
      tenant.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page">
      <div className="page-header page-header-row">
        <div>
          <p className="eyebrow">MANAJEMEN</p>
          <h1>Penghuni</h1>
          <p className="page-description">
            Kelola data penghuni dan penempatan kamar.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={openCreateForm}
        >
          <Plus size={18} />
          Tambah Penghuni
        </button>
      </div>

      <section className="content-card">
        <div className="table-toolbar">
          <div className="search-box">
            <Search size={17} />

            <input
              type="text"
              placeholder="Cari nama, email, telepon, atau kamar..."
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
            <option value="active">Aktif</option>
            <option value="inactive">Tidak Aktif</option>
          </select>
        </div>
        {loading ? (
          <p className="empty-state">
            Memuat data penghuni...
          </p>
        ) : tenants.length === 0 ? (
          <p className="empty-state">
            Belum ada data penghuni.
          </p>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Kontak</th>
                  <th>Kamar</th>
                  <th>Check In</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {filteredTenants.map((tenant) => (
                  <tr key={tenant._id}>
                    <td>
                      <strong>{tenant.name}</strong>
                    </td>

                    <td>
                      <div className="contact-cell">
                        <span>{tenant.phone}</span>
                        <small>{tenant.email}</small>
                      </div>
                    </td>

                    <td>
                      {tenant.roomId ? (
                        <div className="room-cell">
                          <strong>
                            {tenant.roomId.roomNumber}
                          </strong>
                          <small>{tenant.roomId.type}</small>
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>

                    <td>
                      {new Date(
                        tenant.checkInDate,
                      ).toLocaleDateString('id-ID')}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          tenant.status === 'active'
                            ? 'available'
                            : 'maintenance'
                        }`}
                      >
                        {tenant.status === 'active'
                          ? 'Aktif'
                          : 'Tidak Aktif'}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="icon-button"
                          onClick={() =>
                            openEditForm(tenant)
                          }
                          title="Edit penghuni"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="icon-button danger"
                          onClick={() =>
                            handleDelete(tenant)
                          }
                          title="Hapus penghuni"
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
                    ? 'Edit Penghuni'
                    : 'Tambah Penghuni'}
                </h2>

                <p>
                  {editingId
                    ? 'Perbarui data dan penempatan penghuni.'
                    : 'Masukkan data penghuni baru.'}
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
                <div className="form-group">
                  <label>Nama Lengkap</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nama penghuni"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>No. Telepon</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="08xxxxxxxxxx"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="nama@email.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Kamar</label>

                  <select
                    name="roomId"
                    value={form.roomId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Pilih kamar
                    </option>

                    {getAvailableRooms().map((room) => (
                      <option
                        key={room._id}
                        value={room._id}
                      >
                        {room.roomNumber} - {room.type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Tanggal Check In</label>
                  <input
                    type="date"
                    name="checkInDate"
                    value={form.checkInDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Status Penghuni</label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="active">
                      Aktif
                    </option>
                    <option value="inactive">
                      Tidak Aktif
                    </option>
                  </select>
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
                    : 'Tambah Penghuni'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tenants;