import { useEffect, useState } from 'react';
import {
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import api from '../services/api';

const initialForm = {
  roomNumber: '',
  type: '',
  price: '',
  facilities: '',
  status: 'available',
};

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchRooms = async () => {
    try {
      const response = await api.get('/rooms');
      setRooms(response.data);
    } catch {
      setError('Gagal mengambil data kamar.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const formatRupiah = (value) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value);

  const openCreateForm = () => {
    setEditingId(null);
    setForm(initialForm);
    setError('');
    setShowForm(true);
  };

  const openEditForm = (room) => {
    setEditingId(room._id);

    setForm({
      roomNumber: room.roomNumber,
      type: room.type,
      price: room.price,
      facilities: room.facilities.join(', '),
      status: room.status,
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

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      roomNumber: form.roomNumber,
      type: form.type,
      price: Number(form.price),
      facilities: form.facilities
        .split(',')
        .map((facility) => facility.trim())
        .filter(Boolean),
      status: form.status,
    };

    try {
      setError('');

      if (editingId) {
        await api.put(`/rooms/${editingId}`, payload);
      } else {
        await api.post('/rooms', payload);
      }

      await fetchRooms();
      closeForm();
    } catch (err) {
      setError(
        err.response?.data?.message || 'Gagal menyimpan data kamar.',
      );
    }
  };

  const handleDelete = async (room) => {
    const confirmed = window.confirm(
      `Hapus kamar ${room.roomNumber}?`,
    );

    if (!confirmed) return;

    try {
      await api.delete(`/rooms/${room._id}`);
      await fetchRooms();
    } catch (err) {
      alert(
        err.response?.data?.message || 'Gagal menghapus kamar.',
      );
    }
  };

  const statusLabel = {
    available: 'Tersedia',
    occupied: 'Terisi',
    maintenance: 'Maintenance',
  };

  const filteredRooms = rooms.filter((room) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
        room.roomNumber.toLowerCase().includes(keyword) ||
        room.type.toLowerCase().includes(keyword);

    const matchesStatus =
        statusFilter === 'all' ||
        room.status === statusFilter;

    return matchesSearch && matchesStatus;
    });

  return (
    <div className="page">
      <div className="page-header page-header-row">
        <div>
          <p className="eyebrow">MANAJEMEN</p>
          <h1>Kamar</h1>
          <p className="page-description">
            Kelola kamar, harga, fasilitas, dan status hunian.
          </p>
        </div>

        <button className="primary-button" onClick={openCreateForm}>
          <Plus size={18} />
          Tambah Kamar
        </button>
      </div>

      <section className="content-card">
        <div className="table-toolbar">
            <div className="search-box">
                <Search size={17} />

                <input
                type="text"
                placeholder="Cari nomor atau tipe kamar..."
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
                <option value="available">Tersedia</option>
                <option value="occupied">Terisi</option>
                <option value="maintenance">Maintenance</option>
            </select>
            </div>
        {loading ? (
          <p className="empty-state">Memuat data kamar...</p>
        ) : rooms.length === 0 ? (
          <p className="empty-state">Belum ada data kamar.</p>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>No. Kamar</th>
                  <th>Tipe</th>
                  <th>Harga / Bulan</th>
                  <th>Fasilitas</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {filteredRooms.map((room) => (
                  <tr key={room._id}>
                    <td>
                      <strong>{room.roomNumber}</strong>
                    </td>

                    <td>{room.type}</td>

                    <td>{formatRupiah(room.price)}</td>

                    <td>
                      <div className="facility-list">
                        {room.facilities.map((facility) => (
                          <span key={facility}>{facility}</span>
                        ))}
                      </div>
                    </td>

                    <td>
                      <span className={`status-badge ${room.status}`}>
                        {statusLabel[room.status]}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="icon-button"
                          onClick={() => openEditForm(room)}
                          title="Edit kamar"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="icon-button danger"
                          onClick={() => handleDelete(room)}
                          title="Hapus kamar"
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
                <h2>{editingId ? 'Edit Kamar' : 'Tambah Kamar'}</h2>
                <p>
                  {editingId
                    ? 'Perbarui informasi kamar.'
                    : 'Masukkan informasi kamar baru.'}
                </p>
              </div>

              <button className="close-button" onClick={closeForm}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {error && <div className="form-error">{error}</div>}

              <div className="form-grid">
                <div className="form-group">
                  <label>Nomor Kamar</label>
                  <input
                    name="roomNumber"
                    value={form.roomNumber}
                    onChange={handleChange}
                    placeholder="Contoh: A-03"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Tipe Kamar</label>
                  <input
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    placeholder="Contoh: Standard"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Harga / Bulan</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="800000"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="available">Tersedia</option>
                    <option value="occupied">Terisi</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Fasilitas</label>
                  <input
                    name="facilities"
                    value={form.facilities}
                    onChange={handleChange}
                    placeholder="WiFi, Kasur, Lemari, AC"
                  />
                  <small>Pisahkan setiap fasilitas dengan koma.</small>
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

                <button type="submit" className="primary-button">
                  {editingId ? 'Simpan Perubahan' : 'Tambah Kamar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Rooms;