// User Management System
console.log('👤 User system loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM Ready - User System');
    
    // Initialize user interface
    initializeUserInterface();
    
    // Setup form handlers
    setupFormHandlers();
});

function initializeUserInterface() {
    console.log('🎨 Initializing user interface...');
    
    // Load dropdown data
    loadDropdownData();
    
    // Set minimum date to today
    setMinDate();
}

function loadDropdownData() {
    console.log('📋 Loading dropdown data...');
    
    // Load users
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const namaPeminjamSelect = document.getElementById('namaPeminjam');
    
    if (namaPeminjamSelect) {
        // Clear existing options except the first one
        while (namaPeminjamSelect.options.length > 1) {
            namaPeminjamSelect.remove(1);
        }
        
        // Add user options
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.nama;
            option.textContent = user.nama;
            namaPeminjamSelect.appendChild(option);
        });
        
        console.log(`✅ Loaded ${users.length} users`);
    }
    
    // Load barang
    const inventaris = JSON.parse(localStorage.getItem('inventaris')) || { barang: [] };
    const barangSelect = document.getElementById('barang');
    
    if (barangSelect) {
        // Clear existing options except the first one
        while (barangSelect.options.length > 1) {
            barangSelect.remove(1);
        }
        
        // Add barang options
        inventaris.barang.forEach(barang => {
            const option = document.createElement('option');
            option.value = barang.nama;
            option.textContent = `${barang.nama} (Tersedia: ${barang.tersedia})`;
            option.disabled = barang.tersedia === 0;
            barangSelect.appendChild(option);
        });
        
        console.log(`✅ Loaded ${inventaris.barang.length} barang`);
    }
    
    // Load ruangan
    const ruanganSelect = document.getElementById('ruangan');
    
    if (ruanganSelect) {
        // Clear existing options except the first one
        while (ruanganSelect.options.length > 1) {
            ruanganSelect.remove(1);
        }
        
        // Add ruangan options
        inventaris.ruangan.forEach(ruangan => {
            const option = document.createElement('option');
            option.value = ruangan.nama;
            option.textContent = `${ruangan.nama} ${ruangan.tersedia ? '(Tersedia)' : '(Tidak Tersedia)'}`;
            option.disabled = !ruangan.tersedia;
            ruanganSelect.appendChild(option);
        });
        
        console.log(`✅ Loaded ${inventaris.ruangan.length} ruangan`);
    }
}

function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    const tanggalInputs = document.querySelectorAll('input[type="date"]');
    
    tanggalInputs.forEach(input => {
        if (input) {
            input.min = today;
        }
    });
    
    console.log('✅ Set minimum date to today');
}

function setupFormHandlers() {
    console.log('🔧 Setting up form handlers...');
    
    // Pinjam Barang form
    const pinjamBarangForm = document.getElementById('pinjamBarangForm');
    if (pinjamBarangForm) {
        pinjamBarangForm.addEventListener('submit', handlePinjamBarang);
        console.log('✅ Barang form handler added');
    }
    
    // Pinjam Ruangan form
    const pinjamRuanganForm = document.getElementById('pinjamRuanganForm');
    if (pinjamRuanganForm) {
        pinjamRuanganForm.addEventListener('submit', handlePinjamRuangan);
        console.log('✅ Ruangan form handler added');
    }
}

function handlePinjamBarang(e) {
    e.preventDefault();
    console.log('🔄 Processing pinjam barang...');
    
    const formData = new FormData(e.target);
    const namaPeminjam = formData.get('namaPeminjam');
    const jabatan = formData.get('jabatan');
    const barang = formData.get('barang');
    const jumlahPinjam = parseInt(formData.get('jumlahPinjam') || '1');
    const tanggalPinjam = formData.get('tanggalPinjam');
    const jamPinjam = formData.get('jamPinjam');
    
    // Validation
    if (!namaPeminjam || !jabatan || !barang || !tanggalPinjam || !jamPinjam) {
        showNotification('❌ Harap isi semua field!', 'error');
        return;
    }
    
    if (!jumlahPinjam || jumlahPinjam < 1) {
        showNotification('❌ Jumlah barang harus minimal 1!', 'error');
        return;
    }
    
    // Check availability
    if (!isBarangTersedia(barang, jumlahPinjam)) {
        showNotification('❌ Stok barang tidak mencukupi!', 'error');
        return;
    }
    
    // Check for double booking
    if (isBarangBooked(barang, tanggalPinjam, jamPinjam)) {
        showNotification('❌ Barang sudah dipinjam pada waktu tersebut!', 'error');
        return;
    }
    
    // Create peminjaman record
    const peminjamanData = {
        id: Date.now(),
        namaPeminjam: namaPeminjam,
        jabatan: jabatan,
        barang: barang,
        jumlahPinjam: jumlahPinjam,
        tanggalPinjam: tanggalPinjam,
        jamPinjam: jamPinjam,
        status: 'Aktif',
        tanggalPengembalian: '',
        jamPengembalian: '',
        type: 'barang'
    };
    
    // Save to localStorage
    savePeminjaman(peminjamanData);
    
    // Update availability
    updateKetersediaanBarang(barang, -jumlahPinjam);
    
    // Show success and reset form
    showNotification(`✅ Peminjaman ${barang} (${jumlahPinjam} unit) berhasil diajukan!`, 'success');
    e.target.reset();
    
    // Reload dropdown data
    setTimeout(() => {
        loadDropdownData();
    }, 1000);
}

function handlePinjamRuangan(e) {
    e.preventDefault();
    console.log('🔄 Processing pinjam ruangan...');
    
    const formData = new FormData(e.target);
    const namaPeminjam = formData.get('namaPeminjam');
    const jabatan = formData.get('jabatan');
    const ruangan = formData.get('ruangan');
    const tanggalPinjam = formData.get('tanggalPinjam');
    const jamPinjam = formData.get('jamPinjam');
    
    // Validation
    if (!namaPeminjam || !jabatan || !ruangan || !tanggalPinjam || !jamPinjam) {
        showNotification('❌ Harap isi semua field!', 'error');
        return;
    }
    
    // Check availability
    if (!isRuanganTersedia(ruangan)) {
        showNotification('❌ Ruangan tidak tersedia!', 'error');
        return;
    }
    
    // Check for double booking
    if (isRuanganBooked(ruangan, tanggalPinjam, jamPinjam)) {
        showNotification('❌ Ruangan sudah dipinjam pada waktu tersebut!', 'error');
        return;
    }
    
    // Create peminjaman record
    const peminjamanData = {
        id: Date.now(),
        namaPeminjam: namaPeminjam,
        jabatan: jabatan,
        ruangan: ruangan,
        tanggalPinjam: tanggalPinjam,
        jamPinjam: jamPinjam,
        status: 'Aktif',
        tanggalPengembalian: '',
        jamPengembalian: '',
        type: 'ruangan'
    };
    
    // Save to localStorage
    savePeminjaman(peminjamanData);
    
    // Update availability
    updateKetersediaanRuangan(ruangan, false);
    
    // Show success and reset form
    showNotification('✅ Peminjaman ruangan berhasil diajukan!', 'success');
    e.target.reset();
    
    // Reload dropdown data
    setTimeout(() => {
        loadDropdownData();
    }, 1000);
}

// UTILITY FUNCTIONS
function isBarangTersedia(namaBarang, jumlah) {
    const inventaris = JSON.parse(localStorage.getItem('inventaris')) || { barang: [] };
    const barang = inventaris.barang.find(b => b.nama === namaBarang);
    return barang && barang.tersedia >= jumlah;
}

function isRuanganTersedia(namaRuangan) {
    const inventaris = JSON.parse(localStorage.getItem('inventaris')) || { ruangan: [] };
    const ruangan = inventaris.ruangan.find(r => r.nama === namaRuangan);
    return ruangan && ruangan.tersedia;
}

function isBarangBooked(namaBarang, tanggal, jam) {
    const peminjaman = JSON.parse(localStorage.getItem('peminjaman')) || [];
    return peminjaman.some(p => 
        p.barang === namaBarang && 
        p.tanggalPinjam === tanggal && 
        p.jamPinjam === jam &&
        p.status === 'Aktif'
    );
}

function isRuanganBooked(namaRuangan, tanggal, jam) {
    const peminjaman = JSON.parse(localStorage.getItem('peminjaman')) || [];
    return peminjaman.some(p => 
        p.ruangan === namaRuangan && 
        p.tanggalPinjam === tanggal && 
        p.jamPinjam === jam &&
        p.status === 'Aktif'
    );
}

function savePeminjaman(data) {
    const peminjaman = JSON.parse(localStorage.getItem('peminjaman')) || [];
    peminjaman.push(data);
    localStorage.setItem('peminjaman', JSON.stringify(peminjaman));
    console.log('💾 Peminjaman saved:', data);
}

function updateKetersediaanBarang(namaBarang, perubahan) {
    const inventaris = JSON.parse(localStorage.getItem('inventaris'));
    inventaris.barang = inventaris.barang.map(barang => {
        if (barang.nama === namaBarang) {
            return {
                ...barang,
                tersedia: Math.max(0, barang.tersedia + perubahan)
            };
        }
        return barang;
    });
    localStorage.setItem('inventaris', JSON.stringify(inventaris));
    console.log('📦 Barang availability updated:', namaBarang, perubahan);
}

function updateKetersediaanRuangan(namaRuangan, status) {
    const inventaris = JSON.parse(localStorage.getItem('inventaris'));
    inventaris.ruangan = inventaris.ruangan.map(ruangan => {
        if (ruangan.nama === namaRuangan) {
            return {
                ...ruangan,
                tersedia: status
            };
        }
        return ruangan;
    });
    localStorage.setItem('inventaris', JSON.stringify(inventaris));
    console.log('🏫 Ruangan availability updated:', namaRuangan, status);
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