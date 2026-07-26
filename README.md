# 🏠 Kostify

**Kostify** adalah aplikasi web Sistem Informasi Manajemen Kos yang digunakan untuk membantu pengelolaan kamar, penghuni, pembayaran, serta monitoring kondisi kos melalui dashboard.

Aplikasi dibangun menggunakan React untuk frontend, NestJS untuk backend REST API, dan MongoDB Atlas sebagai database.

## ✨ Fitur Utama

- Dashboard ringkasan pengelolaan kos
- Manajemen data kamar
- Manajemen data penghuni
- Manajemen pembayaran
- Monitoring status kamar
- Perhitungan jumlah penghuni aktif
- Perhitungan pemasukan
- Riwayat pembayaran terbaru
- Occupancy rate kamar
- Validasi data pada backend
- Proteksi pembayaran ganda pada periode yang sama
- Proteksi penghapusan penghuni yang memiliki riwayat pembayaran
- Perubahan otomatis status kamar berdasarkan status penghuni
- Dokumentasi REST API menggunakan Swagger

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- Axios
- Lucide React
- CSS

### Backend

- NestJS
- TypeScript
- Mongoose
- Class Validator
- Swagger / OpenAPI

### Database

- MongoDB Atlas

### Deployment

- Vercel
- MongoDB Atlas

## 📁 Struktur Project

```text
kostify/
├── backend/
│   ├── src/
│   │   ├── rooms/
│   │   ├── tenants/
│   │   ├── payments/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── .gitignore
├── vercel.json
└── README.md
```

## 🚀 Menjalankan Project Secara Lokal

### 1. Clone Repository

```bash
git clone https://github.com/Dhika-04/kostify.git
cd kostify
```

### 2. Konfigurasi Backend

Masuk ke folder backend:

```bash
cd backend
npm install
```

Buat file `.env` berdasarkan `.env.example`:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

> Jangan menyimpan username, password, atau MongoDB connection string asli di repository.

Jalankan backend:

```bash
npm run start:dev
```

Backend akan berjalan secara lokal pada port `3000`.

### 3. Menjalankan Frontend

Buka terminal baru:

```bash
cd frontend
npm install
npm run dev
```

Frontend akan berjalan pada:

```text
http://localhost:5173
```

Vite development proxy akan meneruskan request `/api` ke backend lokal.

## 🔌 REST API

Endpoint utama Kostify:

### Rooms

```text
GET    /api/rooms
GET    /api/rooms/:id
POST   /api/rooms
PUT    /api/rooms/:id
DELETE /api/rooms/:id
```

### Tenants

```text
GET    /api/tenants
GET    /api/tenants/:id
POST   /api/tenants
PUT    /api/tenants/:id
DELETE /api/tenants/:id
```

### Payments

```text
GET    /api/payments
GET    /api/payments/:id
POST   /api/payments
PUT    /api/payments/:id
DELETE /api/payments/:id
```

## 📖 Dokumentasi API

Backend menggunakan Swagger/OpenAPI sebagai dokumentasi REST API.

Pada development lokal, dokumentasi dapat diakses melalui:

```text
http://localhost:3000/docs
```

## 🔄 Business Logic

Kostify memiliki beberapa aturan bisnis untuk menjaga konsistensi data.

**Kamar dan Penghuni**

Ketika penghuni aktif menempati kamar, status kamar berubah menjadi `occupied`. Ketika penghuni menjadi tidak aktif, kamar kembali menjadi `available`.

**Riwayat Pembayaran**

Penghuni yang sudah memiliki riwayat pembayaran tidak dapat dihapus secara permanen. Penghuni tersebut dapat diubah menjadi `inactive` sehingga histori transaksi tetap tersimpan.

**Pembayaran Ganda**

Sistem mencegah pencatatan pembayaran lebih dari satu kali untuk penghuni dan periode bulan/tahun yang sama.

## 🌐 Deployment

Kostify menggunakan arsitektur:

```text
React / Vite
     ↓
   /api
     ↓
NestJS REST API
     ↓
MongoDB Atlas
```

Frontend dan backend dideploy menggunakan Vercel Services, sedangkan data disimpan pada MongoDB Atlas.

## 🔐 Environment Variables

Credential database tidak disimpan di repository.

Contoh konfigurasi tersedia pada:

```text
backend/.env.example
```

Environment variable yang diperlukan:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

## 👨‍💻 Developer

**Dhika**

Project UAS Pemrograman Web  
2026