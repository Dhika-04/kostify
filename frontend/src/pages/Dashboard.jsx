import { useEffect, useState } from 'react';
import {
  BedDouble,
  Building2,
  CircleCheck,
  TrendingUp,
  Users,
  WalletCards,
} from 'lucide-react';
import api from '../services/api';

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

function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setError('');

        const [
          roomsResponse,
          tenantsResponse,
          paymentsResponse,
        ] = await Promise.all([
          api.get('/rooms'),
          api.get('/tenants'),
          api.get('/payments'),
        ]);

        setRooms(roomsResponse.data);
        setTenants(tenantsResponse.data);
        setPayments(paymentsResponse.data);
      } catch (error) {
        console.error(
          'Gagal mengambil data dashboard:',
          error,
        );

        setError(
          'Gagal mengambil data dashboard. Pastikan backend berjalan.',
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const availableRooms = rooms.filter(
    (room) => room.status === 'available',
  ).length;

  const occupiedRooms = rooms.filter(
    (room) => room.status === 'occupied',
  ).length;

  const maintenanceRooms = rooms.filter(
    (room) => room.status === 'maintenance',
  ).length;

  const activeTenants = tenants.filter(
    (tenant) => tenant.status === 'active',
  ).length;

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const monthlyIncome = payments
    .filter(
      (payment) =>
        payment.status === 'paid' &&
        payment.month === currentMonth &&
        payment.year === currentYear,
    )
    .reduce(
      (total, payment) => total + Number(payment.amount),
      0,
    );

  const totalIncome = payments
    .filter((payment) => payment.status === 'paid')
    .reduce(
      (total, payment) => total + Number(payment.amount),
      0,
    );

  const occupancyRate =
    rooms.length > 0
      ? Math.round((occupiedRooms / rooms.length) * 100)
      : 0;

  const paidPayments = payments.filter(
    (payment) => payment.status === 'paid',
  ).length;

  const unpaidPayments = payments.filter(
    (payment) => payment.status === 'unpaid',
  ).length;

  const formatRupiah = (value) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value);

  const getPaymentStatus = (status) =>
    status === 'paid' ? 'Lunas' : 'Belum Lunas';

  if (loading) {
    return (
      <div className="loading">
        Memuat dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="form-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">OVERVIEW</p>

          <h1>Dashboard</h1>

          <p className="page-description">
            Ringkasan operasional dan keuangan Kostify.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <BedDouble size={23} />
          </div>

          <div>
            <span>Total Kamar</span>
            <h2>{rooms.length}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Building2 size={23} />
          </div>

          <div>
            <span>Kamar Terisi</span>
            <h2>{occupiedRooms}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Users size={23} />
          </div>

          <div>
            <span>Penghuni Aktif</span>
            <h2>{activeTenants}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <WalletCards size={23} />
          </div>

          <div>
            <span>Pendapatan Bulan Ini</span>

            <h2 className="income">
              {formatRupiah(monthlyIncome)}
            </h2>
          </div>
        </div>
      </div>

      <div className="dashboard-highlight-grid">
        <section className="content-card occupancy-card">
          <div className="occupancy-top">
            <div>
              <div className="dashboard-section-icon">
                <TrendingUp size={19} />
              </div>

              <p>Occupancy Rate</p>

              <h2>{occupancyRate}%</h2>
            </div>

            <div className="occupancy-number">
              <strong>{occupiedRooms}</strong>
              <span>dari {rooms.length} kamar</span>
            </div>
          </div>

          <div className="occupancy-progress">
            <div
              className="occupancy-progress-value"
              style={{
                width: `${occupancyRate}%`,
              }}
            />
          </div>

          <p className="occupancy-caption">
            Persentase kamar yang sedang ditempati.
          </p>
        </section>

        <section className="content-card financial-summary">
          <div className="card-heading">
            <div>
              <h3>Ringkasan Keuangan</h3>
              <p>Keseluruhan transaksi pembayaran</p>
            </div>
          </div>

          <div className="finance-items">
            <div>
              <span>Total Pemasukan</span>
              <strong>{formatRupiah(totalIncome)}</strong>
            </div>

            <div>
              <span>Transaksi Lunas</span>
              <strong>{paidPayments}</strong>
            </div>

            <div>
              <span>Belum Lunas</span>
              <strong>{unpaidPayments}</strong>
            </div>
          </div>
        </section>
      </div>

      <div className="dashboard-grid">
        <section className="content-card">
          <div className="card-heading">
            <div>
              <h3>Status Kamar</h3>
              <p>Kondisi kamar saat ini</p>
            </div>
          </div>

          <div className="room-summary">
            <div>
              <strong>{availableRooms}</strong>
              <span>Tersedia</span>
            </div>

            <div>
              <strong>{occupiedRooms}</strong>
              <span>Terisi</span>
            </div>

            <div>
              <strong>{maintenanceRooms}</strong>
              <span>Maintenance</span>
            </div>
          </div>
        </section>

        <section className="content-card">
          <div className="card-heading">
            <div>
              <h3>Pembayaran Terbaru</h3>
              <p>5 transaksi pembayaran terakhir</p>
            </div>
          </div>

          <div className="recent-list">
            {payments.length === 0 ? (
              <p className="empty-state">
                Belum ada pembayaran.
              </p>
            ) : (
              payments.slice(0, 5).map((payment) => (
                <div
                  className="recent-item"
                  key={payment._id}
                >
                  <div>
                    <strong>
                      {payment.tenantId?.name ||
                        'Penghuni tidak ditemukan'}
                    </strong>

                    <span>
                      {monthNames[payment.month - 1]}{' '}
                      {payment.year}
                      {' • '}
                      {getPaymentStatus(payment.status)}
                    </span>
                  </div>

                  <strong>
                    {formatRupiah(payment.amount)}
                  </strong>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;