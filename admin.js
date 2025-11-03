// Admin Management System - FIXED VERSION
console.log('👑 Admin system loaded');

// Global data initialization
let inventaris = JSON.parse(localStorage.getItem('inventaris')) || { barang: [], ruangan: [] };
let users = JSON.parse(localStorage.getItem('users')) || [];
let peminjaman = JSON.parse(localStorage.getItem('peminjaman')) || [];

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM Ready - Admin System');
    
    // Initialize data
    initializeData();
    
    // Setup all event listeners
    setupEventListeners();
    
    // Load initial data
    loadInitialData();
});

function initializeData() {
    console.log('📦 Initializing data...');
    
    // Only create default data if empty
    if (inventaris.barang.length === 0) {
        inventaris.barang = [
            { id: Date.now() + 1, nama: 'Proyektor', kategori: 'Elektronik', jumlah: 5, tersedia: 5 },
            { id: Date.now() + 2, nama: 'Spidol', kategori: 'Alat Tulis', jumlah: 20, tersedia: 20 },
            { id: Date.now() + 3, nama: 'Kabel HDMI', kategori: 'Elektronik', jumlah: 8, tersedia: 8 }
        ];
        console.log('✅ Default barang created');
    }
    
    if (inventaris.ruangan.length === 0) {
        inventaris.ruangan = [
            { id: Date.now() + 4, nama: 'Lab IPA', kapasitas: 30, tersedia: true },
            { id: Date.now() + 5, nama: 'Aula', kapasitas: 100, tersedia: true },
            { id: Date.now() + 6, nama: 'Perpustakaan', kapasitas: 40, tersedia: true }
        ];
        console.log('✅ Default ruangan created');
    }
    
    if (users.length === 0) {
        users = [
            { id: Date.now() + 7, nama: 'Budi Santoso', jabatan: 'Guru' },
            { id: Date.now() + 8, nama: 'Siti Rahayu', jabatan: 'Guru' },
            { id: Date.now() + 9, nama: 'Ahmad Fauzi', jabatan: 'Staff' }
        ];
        console.log('✅ Default users created');
    }
    
    // Save to localStorage
    saveAllData();
}

function setupEventListeners() {
    console.log('🔧 Setting up event listeners...');
    
    // Form submissions
    const tambahBarangForm = document.getElementById('tambahBarangForm');
    const tambahRuanganForm = document.getElementById('tambahRuanganForm');
    const tambahUserForm = document.getElementById('tambahUserForm');
    
    if (tambahBarangForm) {
        tambahBarangForm.addEventListener('submit', handleTambahBarang);
        console.log('✅ Barang form listener added');
    }
    
    if (tambahRuanganForm) {
        tambahRuanganForm.addEventListener('submit', handleTambahRuangan);
        console.log('✅ Ruangan form listener added');
    }
    
    if (tambahUserForm) {
        tambahUserForm.addEventListener('submit', handleTambahUser);
        console.log('✅ User form listener added');
    }
    
    // Dashboard buttons
    const lihatPeminjamanBtn = document.getElementById('lihatPeminjaman');
    const lihatRiwayatBtn = document.getElementById('lihatRiwayat');
    
    if (lihatPeminjamanBtn) {
        lihatPeminjamanBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleSection('peminjamanAktif');
            loadPeminjamanAktif();
        });
        console.log('✅ Peminjaman button listener added');
    }
    
    if (lihatRiwayatBtn) {
        lihatRiwayatBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleSection('riwayatPeminjaman');
            loadRiwayatPeminjaman();
            loadStatistik();
        });
        console.log('✅ Riwayat button listener added');
    }
}

function loadInitialData() {
    console.log('📊 Loading initial data...');
    
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('inventory.html')) {
        loadInventaris();
    } else if (currentPage.includes('users.html')) {
        loadUsers();
    } else if (currentPage.includes('dashboard.html')) {
        loadStatistik();
    }
}

// FORM HANDLERS
function handleTambahBarang(e) {
    e.preventDefault();
    console.log('🔄 Processing tambah barang...');
    
    const nama = document.getElementById('namaBarang').value.trim();
    const kategori = document.getElementById('kategoriBarang').value;
    const jumlah = parseInt(document.getElementById('jumlahBarang').value);
    
    if (!nama || !kategori || !jumlah) {
        showNotification('❌ Harap isi semua field!', 'error');
        return;
    }
    
    const newBarang = {
        id: Date.now(),
        nama: nama,
        kategori: kategori,
        jumlah: jumlah,
        tersedia: jumlah
    };
    
    inventaris.barang.push(newBarang);
    saveAllData();
    
    showNotification('✅ Barang berhasil ditambahkan!', 'success');
    e.target.reset();
    loadInventaris();
}

function handleTambahRuangan(e) {
    e.preventDefault();
    console.log('🔄 Processing tambah ruangan...');
    
    const nama = document.getElementById('namaRuangan').value.trim();
    const kapasitas = parseInt(document.getElementById('kapasitasRuangan').value);
    
    if (!nama || !kapasitas) {
        showNotification('❌ Harap isi semua field!', 'error');
        return;
    }
    
    const newRuangan = {
        id: Date.now(),
        nama: nama,
        kapasitas: kapasitas,
        tersedia: true
    };
    
    inventaris.ruangan.push(newRuangan);
    saveAllData();
    
    showNotification('✅ Ruangan berhasil ditambahkan!', 'success');
    e.target.reset();
    loadInventaris();
}

function handleTambahUser(e) {
    e.preventDefault();
    console.log('🔄 Processing tambah user...');
    
    const nama = document.getElementById('namaUser').value.trim();
    const jabatan = document.getElementById('jabatanUser').value;
    
    if (!nama || !jabatan) {
        showNotification('❌ Harap isi semua field!', 'error');
        return;
    }
    
    // Check for duplicate
    const userExists = users.find(user => user.nama.toLowerCase() === nama.toLowerCase());
    if (userExists) {
        showNotification('❌ Pengguna dengan nama tersebut sudah ada!', 'error');
        return;
    }
    
    const newUser = {
        id: Date.now(),
        nama: nama,
        jabatan: jabatan
    };
    
    users.push(newUser);
    saveAllData();
    
    showNotification('✅ Pengguna berhasil ditambahkan!', 'success');
    e.target.reset();
    loadUsers();
}

// DATA LOADERS
function loadInventaris() {
    console.log('📦 Loading inventaris...');
    
    // Load barang
    const barangTableBody = document.getElementById('barangTableBody');
    if (barangTableBody) {
        barangTableBody.innerHTML = '';
        
        if (inventaris.barang.length === 0) {
            barangTableBody.innerHTML = '<tr><td colspan="5" class="text-center">Belum ada barang</td></tr>';
        } else {
            inventaris.barang.forEach(barang => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${barang.nama}</td>
                    <td>${barang.kategori}</td>
                    <td>${barang.jumlah}</td>
                    <td>${barang.tersedia}</td>
                    <td>
                        <button class="btn btn-small btn-secondary" onclick="editBarang(${barang.id})">Edit</button>
                        <button class="btn btn-small btn-danger" onclick="hapusBarang(${barang.id})">Hapus</button>
                    </td>
                `;
                barangTableBody.appendChild(row);
            });
        }
    }
    
    // Load ruangan
    const ruanganTableBody = document.getElementById('ruanganTableBody');
    if (ruanganTableBody) {
        ruanganTableBody.innerHTML = '';
        
        if (inventaris.ruangan.length === 0) {
            ruanganTableBody.innerHTML = '<tr><td colspan="4" class="text-center">Belum ada ruangan</td></tr>';
        } else {
            inventaris.ruangan.forEach(ruangan => {
                const statusText = ruangan.tersedia ? 'Tersedia' : 'Tidak Tersedia';
                const statusClass = ruangan.tersedia ? 'status-active' : 'status-completed';
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${ruangan.nama}</td>
                    <td>${ruangan.kapasitas} orang</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    <td>
                        <button class="btn btn-small btn-secondary" onclick="editRuangan(${ruangan.id})">Edit</button>
                        <button class="btn btn-small btn-danger" onclick="hapusRuangan(${ruangan.id})">Hapus</button>
                    </td>
                `;
                ruanganTableBody.appendChild(row);
            });
        }
    }
}

function loadUsers() {
    console.log('👥 Loading users...');
    
    const userTableBody = document.getElementById('userTableBody');
    if (userTableBody) {
        userTableBody.innerHTML = '';
        
        if (users.length === 0) {
            userTableBody.innerHTML = '<tr><td colspan="3" class="text-center">Belum ada pengguna</td></tr>';
        } else {
            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.nama}</td>
                    <td>${user.jabatan}</td>
                    <td>
                        <button class="btn btn-small btn-secondary" onclick="editUser(${user.id})">Edit</button>
                        <button class="btn btn-small btn-danger" onclick="hapusUser(${user.id})">Hapus</button>
                    </td>
                `;
                userTableBody.appendChild(row);
            });
        }
    }
}

function loadPeminjamanAktif() {
    console.log('📋 Loading peminjaman aktif...');
    
    const peminjamanAktif = peminjaman.filter(p => p.status === 'Aktif');
    const tableBody = document.getElementById('peminjamanTableBody');
    
    if (tableBody) {
        tableBody.innerHTML = '';
        
        if (peminjamanAktif.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" class="text-center">Tidak ada peminjaman aktif</td></tr>';
        } else {
            peminjamanAktif.forEach(p => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${p.namaPeminjam}</td>
                    <td>${p.jabatan}</td>
                    <td>${p.barang || p.ruangan}</td>
                    <td>${formatTanggal(p.tanggalPinjam)}</td>
                    <td>${p.jamPinjam}</td>
                    <td><span class="status-badge status-active">Aktif</span></td>
                    <td>
                        <button class="btn btn-small btn-primary" onclick="prosesPengembalian(${p.id})">
                            Proses Pengembalian
                        </button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }
    }
}

function loadRiwayatPeminjaman() {
    console.log('📊 Loading riwayat...');
    
    const riwayat = peminjaman.filter(p => p.status === 'Selesai');
    const tableBody = document.getElementById('riwayatTableBody');
    
    if (tableBody) {
        tableBody.innerHTML = '';
        
        if (riwayat.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="8" class="text-center">Belum ada riwayat pengembalian</td></tr>';
        } else {
            riwayat.forEach(p => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${p.namaPeminjam}</td>
                    <td>${p.jabatan}</td>
                    <td>${p.barang || p.ruangan}</td>
                    <td>${formatTanggal(p.tanggalPinjam)}</td>
                    <td>${p.jamPinjam}</td>
                    <td>${formatTanggal(p.tanggalPengembalian)}</td>
                    <td>${p.jamPengembalian}</td>
                    <td><span class="status-badge status-completed">Selesai</span></td>
                `;
                tableBody.appendChild(row);
            });
        }
    }
}

function loadStatistik() {
    console.log('📈 Loading statistik...');
    
    const totalBarang = inventaris.barang.length;
    const totalRuangan = inventaris.ruangan.length;
    const peminjamanAktif = peminjaman.filter(p => p.status === 'Aktif').length;
    const pengembalianSelesai = peminjaman.filter(p => p.status === 'Selesai').length;
    
    // Update elements if they exist
    const elements = {
        'totalBarangRiwayat': totalBarang,
        'totalRuanganRiwayat': totalRuangan,
        'peminjamanAktifRiwayat': peminjamanAktif,
        'pengembalianSelesaiRiwayat': pengembalianSelesai
    };
    
    Object.keys(elements).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = elements[id];
        }
    });
}

// UTILITY FUNCTIONS
function toggleSection(sectionId) {
    const sections = ['peminjamanAktif', 'riwayatPeminjaman'];
    sections.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = id === sectionId ? 'block' : 'none';
        }
    });
}

function saveAllData() {
    localStorage.setItem('inventaris', JSON.stringify(inventaris));
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('peminjaman', JSON.stringify(peminjaman));
    console.log('💾 All data saved to localStorage');
}

function formatTanggal(tanggal) {
    if (!tanggal) return '-';
    return new Date(tanggal).toLocaleDateString('id-ID');
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${type === 'success' ? '✅' : '❌'}</span>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 4000);
}

// ACTION FUNCTIONS (called from HTML)
function prosesPengembalian(id) {
    const peminjamanItem = peminjaman.find(p => p.id === id);
    if (peminjamanItem) {
        const now = new Date();
        peminjamanItem.status = 'Selesai';
        peminjamanItem.tanggalPengembalian = now.toISOString().split('T')[0];
        peminjamanItem.jamPengembalian = now.toTimeString().split(' ')[0].substring(0, 5);
        
        // Update ketersediaan
        if (peminjamanItem.barang) {
            const barang = inventaris.barang.find(b => b.nama === peminjamanItem.barang);
            if (barang) barang.tersedia += peminjamanItem.jumlahPinjam || 1;
        } else if (peminjamanItem.ruangan) {
            const ruangan = inventaris.ruangan.find(r => r.nama === peminjamanItem.ruangan);
            if (ruangan) ruangan.tersedia = true;
        }
        
        saveAllData();
        showNotification('✅ Pengembalian berhasil diproses!', 'success');
        
        // Reload data
        loadPeminjamanAktif();
        loadRiwayatPeminjaman();
        loadStatistik();
    }
}

function hapusBarang(id) {
    if (confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
        inventaris.barang = inventaris.barang.filter(b => b.id !== id);
        saveAllData();
        showNotification('✅ Barang berhasil dihapus!', 'success');
        loadInventaris();
    }
}

function hapusRuangan(id) {
    if (confirm('Apakah Anda yakin ingin menghapus ruangan ini?')) {
        inventaris.ruangan = inventaris.ruangan.filter(r => r.id !== id);
        saveAllData();
        showNotification('✅ Ruangan berhasil dihapus!', 'success');
        loadInventaris();
    }
}

function hapusUser(id) {
    if (confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
        users = users.filter(u => u.id !== id);
        saveAllData();
        showNotification('✅ Pengguna berhasil dihapus!', 'success');
        loadUsers();
    }
}

// Placeholder edit functions
function editBarang(id) {
    showNotification('🔄 Fitur edit barang akan segera tersedia', 'warning');
}

function editRuangan(id) {
    showNotification('🔄 Fitur edit ruangan akan segera tersedia', 'warning');
}

function editUser(id) {
    showNotification('🔄 Fitur edit pengguna akan segera tersedia', 'warning');
}

// Refresh functions
function refreshPeminjaman() {
    loadPeminjamanAktif();
    showNotification('✅ Data peminjaman diperbarui', 'success');
}

function refreshRiwayat() {
    loadRiwayatPeminjaman();
    loadStatistik();
    showNotification('✅ Data riwayat diperbarui', 'success');
}