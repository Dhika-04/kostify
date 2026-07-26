# 🏠 Kostify

**Kostify** adalah aplikasi web Sistem Informasi Manajemen Kos yang digunakan untuk membantu pengelolaan kamar, penghuni, pembayaran, serta monitoring kondisi kos melalui dashboard.

Aplikasi ini dibangun menggunakan **React + Vite** sebagai frontend, **NestJS** sebagai backend REST API, dan **MongoDB Atlas** sebagai database.

Kostify mendukung pengelolaan data secara CRUD (*Create, Read, Update, Delete*) dan telah di-deploy sehingga dapat digunakan secara online.

---

## 🌐 Live Demo

Aplikasi Kostify dapat diakses melalui:

https://kostify-y1nz.vercel.app

---

## ✨ Fitur Utama

Kostify memiliki beberapa fitur utama:

- Dashboard ringkasan operasional kos
- Manajemen data kamar
- Manajemen data penghuni
- Manajemen pembayaran
- Tambah, lihat, edit, dan hapus data
- Monitoring status kamar
- Monitoring penghuni aktif
- Perhitungan occupancy rate
- Perhitungan total pemasukan
- Ringkasan transaksi pembayaran
- Riwayat pembayaran terbaru
- Validasi data pada backend
- Dokumentasi REST API menggunakan Swagger

---

## 📊 Dashboard

Dashboard memberikan ringkasan kondisi kos berdasarkan data yang tersimpan di database.

Informasi yang ditampilkan meliputi:

- Total kamar
- Jumlah kamar terisi
- Jumlah penghuni aktif
- Pendapatan bulan berjalan
- Occupancy rate
- Jumlah kamar tersedia
- Jumlah kamar maintenance
- Total pemasukan
- Jumlah transaksi lunas
- Jumlah transaksi belum lunas
- Pembayaran terbaru

Data pada dashboard diperoleh secara langsung dari REST API dan MongoDB Atlas.

---

## 🛏️ Manajemen Kamar

Modul kamar digunakan untuk mengelola seluruh kamar yang tersedia pada Kostify.

Operasi yang tersedia:

- Menambahkan kamar
- Melihat daftar kamar
- Mengubah data kamar
- Menghapus kamar
- Menentukan nomor kamar
- Menentukan tipe kamar
- Menentukan harga kamar
- Menentukan fasilitas
- Mengelola status kamar

Status kamar dapat digunakan untuk menunjukkan kondisi kamar seperti:

```text
available
occupied
maintenance
```

---

## 👥 Manajemen Penghuni

Modul penghuni digunakan untuk mengelola data penghuni kos.

Data penghuni meliputi:

- Nama
- Nomor telepon
- Email
- Kamar
- Tanggal check-in
- Status penghuni

Status penghuni:

```text
active
inactive
```

Sistem menghubungkan data penghuni dengan data kamar menggunakan MongoDB ObjectId.

---

## 💳 Manajemen Pembayaran

Modul pembayaran digunakan untuk mencatat transaksi pembayaran penghuni.

Data pembayaran meliputi:

- Penghuni
- Bulan pembayaran
- Tahun pembayaran
- Jumlah pembayaran
- Metode pembayaran
- Status pembayaran
- Tanggal pembayaran

Metode pembayaran:

```text
cash
transfer
```

Status pembayaran:

```text
paid
unpaid
```

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- JavaScript
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

- MongoDB
- MongoDB Atlas

### Deployment

- Vercel
- MongoDB Atlas

### Version Control

- Git
- GitHub

---

## 🏗️ Arsitektur Aplikasi

Secara sederhana, arsitektur Kostify adalah:

```text
User
  │
  ▼
React + Vite
  │
  │ HTTP Request
  ▼
/api
  │
  ▼
NestJS REST API
  │
  │ Mongoose
  ▼
MongoDB Atlas
```

Frontend mengirim request menggunakan Axios menuju REST API.

Backend NestJS menerima request, melakukan validasi dan pemrosesan data, kemudian berkomunikasi dengan MongoDB Atlas menggunakan Mongoose.

---

## 📁 Struktur Project

```text
kostify/
│
├── backend/
│   ├── src/
│   │   ├── payments/
│   │   │   ├── dto/
│   │   │   ├── schemas/
│   │   │   ├── payments.controller.ts
│   │   │   ├── payments.module.ts
│   │   │   └── payments.service.ts
│   │   │
│   │   ├── rooms/
│   │   │   ├── dto/
│   │   │   ├── schemas/
│   │   │   ├── rooms.controller.ts
│   │   │   ├── rooms.module.ts
│   │   │   └── rooms.service.ts
│   │   │
│   │   ├── tenants/
│   │   │   ├── dto/
│   │   │   ├── schemas/
│   │   │   ├── tenants.controller.ts
│   │   │   ├── tenants.module.ts
│   │   │   └── tenants.service.ts
│   │   │
│   │   ├── app.module.ts
│   │   └── main.ts
│   │
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Rooms.jsx
│   │   │   ├── Tenants.jsx
│   │   │   └── Payments.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── vercel.json
└── README.md
```

---

## 🚀 Menjalankan Project Secara Lokal

### 1. Clone Repository

Clone repository Kostify:

```bash
git clone https://github.com/Dhika-04/kostify.git
```

Masuk ke directory project:

```bash
cd kostify
```

---

## ⚙️ Menjalankan Backend

Masuk ke folder backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Buat file:

```text
.env
```

Gunakan `.env.example` sebagai referensi.

Contoh:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

> Jangan memasukkan username, password, atau MongoDB connection string asli ke dalam repository GitHub.

Jalankan backend:

```bash
npm run start:dev
```

Backend akan berjalan pada:

```text
http://localhost:3000
```

---

## 💻 Menjalankan Frontend

Buka terminal baru dari root project, kemudian:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Frontend akan berjalan pada:

```text
http://localhost:5173
```

Pada development environment, Vite proxy meneruskan request:

```text
/api
```

menuju:

```text
http://localhost:3000
```

Sehingga frontend dapat menggunakan konfigurasi API yang sama pada development maupun production.

---

## 🔌 REST API

Kostify menyediakan REST API untuk tiga resource utama:

```text
Rooms
Tenants
Payments
```

Base path API:

```text
/api
```

---

## 🛏️ Rooms API

### Mendapatkan seluruh kamar

```http
GET /api/rooms
```

### Mendapatkan satu kamar

```http
GET /api/rooms/:id
```

### Menambahkan kamar

```http
POST /api/rooms
```

### Mengubah kamar

```http
PUT /api/rooms/:id
```

### Menghapus kamar

```http
DELETE /api/rooms/:id
```

---

## 👥 Tenants API

### Mendapatkan seluruh penghuni

```http
GET /api/tenants
```

### Mendapatkan satu penghuni

```http
GET /api/tenants/:id
```

### Menambahkan penghuni

```http
POST /api/tenants
```

### Mengubah penghuni

```http
PUT /api/tenants/:id
```

### Menghapus penghuni

```http
DELETE /api/tenants/:id
```

---

## 💳 Payments API

### Mendapatkan seluruh pembayaran

```http
GET /api/payments
```

### Mendapatkan satu pembayaran

```http
GET /api/payments/:id
```

### Menambahkan pembayaran

```http
POST /api/payments
```

### Mengubah pembayaran

```http
PUT /api/payments/:id
```

### Menghapus pembayaran

```http
DELETE /api/payments/:id
```

---

## 📖 Swagger API Documentation

Backend Kostify menggunakan **Swagger / OpenAPI** untuk membantu dokumentasi dan pengujian REST API.

Ketika backend dijalankan secara lokal, Swagger UI dapat diakses melalui:

```text
http://localhost:3000/docs
```

Melalui Swagger, endpoint API dapat dilihat dan diuji secara langsung.

> Swagger UI saat ini digunakan pada development environment. Aplikasi production tetap menggunakan REST API melalui path `/api`.

---

## ✅ Validasi Data

Backend menggunakan:

```text
class-validator
```

untuk melakukan validasi request sebelum data disimpan ke database.

Beberapa contoh validasi:

- Email harus memiliki format email yang valid
- `roomId` harus berupa MongoDB ObjectId
- `tenantId` harus berupa MongoDB ObjectId
- Bulan pembayaran harus berada antara 1–12
- Tahun pembayaran harus valid
- Jumlah pembayaran tidak boleh negatif
- Status hanya menerima nilai yang telah ditentukan
- Metode pembayaran hanya menerima nilai yang telah ditentukan

Validasi diterapkan secara global menggunakan `ValidationPipe` pada NestJS.

---

## 🔄 Relasi Data

Kostify memiliki hubungan antara tiga resource utama:

```text
Room
  ▲
  │ roomId
  │
Tenant
  ▲
  │ tenantId
  │
Payment
```

Penghuni terhubung dengan kamar menggunakan:

```text
roomId
```

Pembayaran terhubung dengan penghuni menggunakan:

```text
tenantId
```

MongoDB ObjectId digunakan sebagai identifier untuk hubungan antar data tersebut.

---

## 🗄️ Database

Database Kostify menggunakan **MongoDB Atlas**.

Collection utama:

```text
rooms
tenants
payments
```

MongoDB diakses dari backend menggunakan Mongoose.

Connection string disimpan sebagai environment variable:

```env
MONGODB_URI
```

Credential database tidak disimpan di source code maupun repository GitHub.

---

## 🔐 Environment Variables

Environment variable backend:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

Contoh konfigurasi tersedia pada:

```text
backend/.env.example
```

File `.env` asli diabaikan Git melalui `.gitignore`.

---

## 🌍 Production Deployment

Aplikasi production:

```text
https://kostify-y1nz.vercel.app
```

Pada production, request frontend:

```text
/api/*
```

diteruskan menuju backend NestJS.

Arsitektur production:

```text
Browser
   │
   ▼
Vercel
   │
   ├── Frontend → React / Vite
   │
   └── /api/* → NestJS Backend
                    │
                    ▼
               MongoDB Atlas
```

---

## 🧪 Pengujian

Fungsi utama aplikasi telah diuji pada development dan production environment.

Pengujian mencakup:

- Dashboard dapat mengambil data
- Data kamar dapat ditampilkan
- Tambah kamar
- Edit kamar
- Hapus kamar
- Data penghuni dapat ditampilkan
- Tambah penghuni
- Edit penghuni
- Hapus penghuni
- Data pembayaran dapat ditampilkan
- Tambah pembayaran
- Edit pembayaran
- Hapus pembayaran
- Data tetap tersimpan setelah halaman direfresh
- Frontend dapat berkomunikasi dengan backend production
- Backend dapat berkomunikasi dengan MongoDB Atlas

CRUD utama aplikasi telah berhasil dijalankan pada deployment production.

---

## 🔒 Keamanan Repository

File yang mengandung credential dan data sensitif tidak disimpan dalam Git repository.

`.gitignore` mengabaikan:

```text
.env
node_modules/
dist/
```

Repository hanya menyediakan:

```text
backend/.env.example
```

sebagai contoh konfigurasi environment variable.

---

## 📌 Status Project

**Kostify — Final Project**

Status:

```text
Frontend              ✅
Backend               ✅
MongoDB Atlas         ✅
REST API              ✅
CRUD Kamar            ✅
CRUD Penghuni         ✅
CRUD Pembayaran       ✅
Dashboard             ✅
Validation            ✅
Swagger Development   ✅
Git & GitHub          ✅
Production Deployment ✅
```

---

## 👨‍💻 Developer

**Dhika**

Final Project / UAS Pemrograman Web  
2026

---

## 📄 License

Project ini dibuat untuk keperluan akademik dan pembelajaran.