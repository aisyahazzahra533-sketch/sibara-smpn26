const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Serve semua file static dari root folder
app.use(express.static(__dirname));

// Parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route untuk homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route untuk admin pages - DENGAN DAN TANPA .html
app.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin/dashboard.html'));
});

app.get('/admin/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin/dashboard.html'));
});

app.get('/admin/inventory', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin/inventory.html'));
});

app.get('/admin/inventory.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin/inventory.html'));
});

app.get('/admin/users', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin/users.html'));
});

app.get('/admin/users.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin/users.html'));
});

// Route untuk user pages - DENGAN DAN TANPA .html
app.get('/user/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'user/dashboard.html'));
});

app.get('/user/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'user/dashboard.html'));
});

app.get('/user/pinjam-barang', (req, res) => {
    res.sendFile(path.join(__dirname, 'user/pinjam-barang.html'));
});

app.get('/user/pinjam-barang.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'user/pinjam-barang.html'));
});

app.get('/user/pinjam-ruangan', (req, res) => {
    res.sendFile(path.join(__dirname, 'user/pinjam-ruangan.html'));
});

app.get('/user/pinjam-ruangan.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'user/pinjam-ruangan.html'));
});

// Start server
app.listen(port, () => {
    console.log(`=================================`);
    console.log(`🚀 SIBARA App Berhasil Dijalankan!`);
    console.log(`📍 http://localhost:${port}`);
    console.log(`=================================`);
    console.log('Routes yang tersedia:');
    console.log('GET /');
    console.log('GET /admin/dashboard & /admin/dashboard.html');
    console.log('GET /admin/inventory & /admin/inventory.html');
    console.log('GET /admin/users & /admin/users.html');
    console.log('GET /user/dashboard & /user/dashboard.html');
    console.log('GET /user/pinjam-barang & /user/pinjam-barang.html');
    console.log('GET /user/pinjam-ruangan & /user/pinjam-ruangan.html');
    console.log('=================================');
});