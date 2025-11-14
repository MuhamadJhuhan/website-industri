document.addEventListener('DOMContentLoaded', function() {

    // ======================================================= //
    // --- ELEMEN-ELEMEN DOM YANG SERING DIGUNAKAN --- //
    // ======================================================= //
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.navbar');
    const productGrid = document.querySelector('.product-grid');
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const loginModal = document.getElementById('login-modal');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const loginForm = document.getElementById('login-form');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const ctaButton = document.querySelector('.cta-button');
    const contactForm = document.getElementById('contact-form');

    // TAMBahan: Elemen untuk Modal Pengembang
    const developerModal = document.getElementById('developerModal');
    const modalAvatar = document.getElementById('modalAvatar');
    const modalName = document.getElementById('modalName');
    const modalRole = document.getElementById('modalRole');
    const modalBio = document.getElementById('modalBio');
    const modalDetailLink = document.getElementById('modalDetailLink');
    const closeModalBtn = document.querySelector('.close-modal');

    // ======================================================= //
    // --- VARIABEL GLOBAL --- //
    // ======================================================= //
    let cart = [];
    let isLoggedIn = false;

    // ======================================================= //
    // --- FUNGSI-FUNGSI UTAMA --- //
    // ======================================================= //

    // Fungsi untuk menampilkan notifikasi
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #8b4513;
            color: #f8f5f2;
            padding: 15px 25px;
            border-radius: 5px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 1002;
            transform: translateY(100px);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateY(100px)';
            notification.style.opacity = '0';
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    // Fungsi untuk menambahkan produk ke keranjang
    function addToCart(productCard) {
        const productId = parseInt(productCard.dataset.id);
        const productName = productCard.dataset.name;
        const productPrice = parseInt(productCard.dataset.price);
        const productImage = productCard.dataset.image;

        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ 
                id: productId, 
                name: productName, 
                price: productPrice, 
                image: productImage,
                quantity: 1 
            });
        }
        
        updateCartUI();
        showNotification(`${productName} ditambahkan ke keranjang`);
    }

    // Fungsi untuk memperbarui tampilan keranjang
    function updateCartUI() {
        const cartCount = document.querySelector('.cart-count');
        const cartItems = document.querySelector('.cart-items');
        const totalPrice = document.getElementById('total-price');
        
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Keranjang belanja Anda kosong</p>';
        } else {
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">Rp ${item.price.toLocaleString('id-ID')}</div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn increase" data-id="${item.id}">+</button>
                    </div>
                `;
                cartItems.appendChild(cartItem);
            });
            
            document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.getAttribute('data-id'));
                    updateQuantity(productId, -1);
                });
            });
            
            document.querySelectorAll('.quantity-btn.increase').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.getAttribute('data-id'));
                    updateQuantity(productId, 1);
                });
            });
        }
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalPrice.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    }

    // Fungsi untuk memperbarui jumlah item di keranjang
    function updateQuantity(productId, change) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                cart = cart.filter(item => item.id !== productId);
            }
            updateCartUI();
        }
    }

    // Fungsi untuk menampilkan produk berdasarkan kategori
    function displayProducts(category = 'all') {
        const allProductCards = document.querySelectorAll('.product-card');
        
        allProductCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }


    // ======================================================= //
    // --- EVENT LISTENER UNTUK NAVIGASI --- //
    // ======================================================= //
    
    // Toggle menu mobile
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Tutup menu mobile saat klik link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            if (!this.classList.contains('cart-icon') && !this.classList.contains('profile-icon')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Ubah background navbar saat scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.backgroundColor = 'rgba(139, 69, 19, 0.95)';
        } else {
            navbar.style.backgroundColor = 'rgba(139, 69, 19, 0.9)';
        }
    });

    // Smooth scrolling untuk link navigasi
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.classList.contains('cart-icon') || this.classList.contains('profile-icon')) {
                return;
            }
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ======================================================= //
    // --- EVENT LISTENER UNTUK PRODUK --- //
    // ======================================================= //

    // Event listener untuk tombol filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const category = this.getAttribute('data-filter');
            displayProducts(category);
        });
    });

    // Event listener untuk tombol "Tambah ke Keranjang"
    // Gunakan event delegation karena tombol ada di HTML
    productGrid.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productCard = e.target.closest('.product-card');
            addToCart(productCard);
        }
    });


    // ======================================================= //
    // --- EVENT LISTENER UNTUK KERANJANG & MODAL --- //
    // ======================================================= //

    // Buka modal keranjang
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        cartModal.style.display = 'block';
    });
    
    // Tutup modal
    document.querySelectorAll('.close').forEach(button => {
        button.addEventListener('click', function() {
            cartModal.style.display = 'none';
            loginModal.style.display = 'none';
        });
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === cartModal) cartModal.style.display = 'none';
        if (e.target === loginModal) loginModal.style.display = 'none';
    });

    // Tombol Checkout
    checkoutBtn.addEventListener('click', function() {
        if (cart.length > 0) {
            if (!isLoggedIn) {
                showNotification('Silakan login terlebih dahulu untuk melakukan checkout.');
                loginModal.style.display = 'block';
            } else {
                const order = {
                    id: Date.now(),
                    items: [...cart],
                    total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                    date: new Date().toLocaleString('id-ID')
                };

                let orders = JSON.parse(localStorage.getItem('dwiJalokaOrders')) || [];
                orders.push(order);
                localStorage.setItem('dwiJalokaOrders', JSON.stringify(orders));

                showNotification('Terima kasih! Pesanan Anda sedang diproses.');
                cart = [];
                updateCartUI();
                cartModal.style.display = 'none';
            }
        } else {
            showNotification('Keranjang belanja Anda kosong');
        }
    });


    // ======================================================= //
    // --- EVENT LISTENER UNTUK AUTENTIKASI USER --- //
    // ======================================================= //

    // Buka modal login
    loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'block';
    });
    
    // Proses form login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        if (email && password) {
            isLoggedIn = true;
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'block';
            loginModal.style.display = 'none';
            showNotification('Login berhasil! Selamat datang kembali.');
            loginForm.reset();
        }
    });
    
    // Proses logout
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        isLoggedIn = false;
        loginBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        showNotification('Anda telah berhasil logout.');
    });


    // ======================================================= //
    // --- EVENT LISTENER UNTUK INTERAKSI LAINNYA --- //
    // ======================================================= //

    // Tombol CTA dengan animasi delay
    ctaButton.addEventListener('click', function() {
        const originalText = this.textContent;
        this.textContent = 'Memuat...';
        this.disabled = true;
        
        setTimeout(() => {
            document.getElementById('produk').scrollIntoView({ behavior: 'smooth' });
            this.textContent = originalText;
            this.disabled = false;
        }, 1000);
    });
    
    // Form kontak dengan animasi delay
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        if (name && email && message) {
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Mengirim...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Pesan Anda telah terkirim! Kami akan segera menghubungi Anda.');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        }
    });


    // ======================================================= //
    // --- JAVASCRIPT HALAMAN ADMIN --- //
    // ======================================================= //

    const adminPanel = document.getElementById('admin-panel');
    const adminLogin = document.getElementById('admin-login');
    const ordersContainer = document.getElementById('orders-container');
    const adminPasswordInput = document.getElementById('admin-password');
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const adminLogoutBtn = document.getElementById('admin-logout-btn');
    const ordersTableBody = document.getElementById('orders-table-body');
    const ADMIN_PASSWORD = 'admin123';

    // Fungsi untuk menampilkan pesanan di tabel admin
    function displayOrders() {
        const orders = JSON.parse(localStorage.getItem('dwiJalokaOrders')) || [];
        ordersTableBody.innerHTML = '';

        if (orders.length === 0) {
            ordersTableBody.innerHTML = '<tr><td colspan="5">Belum ada pesanan masuk.</td></tr>';
            return;
        }

        orders.reverse().forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>#${order.id}</td>
                <td>${order.date}</td>
                <td>Rp ${order.total.toLocaleString('id-ID')}</td>
                <td>${order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}</td>
                <td><button class="delete-btn" data-id="${order.id}">Hapus</button></td>
            `;
            ordersTableBody.appendChild(row);
        });
    }

    // Fungsi untuk menghapus pesanan
    function deleteOrder(orderId) {
        const isConfirmed = confirm('Apakah Anda yakin ingin menghapus pesanan ini?');
        if (!isConfirmed) return;

        let orders = JSON.parse(localStorage.getItem('dwiJalokaOrders')) || [];
        orders = orders.filter(order => order.id !== orderId);
        localStorage.setItem('dwiJalokaOrders', JSON.stringify(orders));
        
        displayOrders();
        showNotification('Pesanan berhasil dihapus.');
    }

    // Event listener untuk tombol login admin
    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', function() {
            if (adminPasswordInput.value === ADMIN_PASSWORD) {
                adminLogin.style.display = 'none';
                ordersContainer.style.display = 'block';
                displayOrders();
            } else {
                showNotification('Password salah!');
            }
        });
    }

    // Event listener untuk tombol logout admin
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', function() {
            adminLogin.style.display = 'block';
            ordersContainer.style.display = 'none';
            adminPasswordInput.value = '';
            window.location.hash = '#home';
        });
    }

    // Event listener untuk tombol hapus pesanan (event delegation)
    if(ordersTableBody) {
        ordersTableBody.addEventListener('click', function(e) {
            if (e.target.classList.contains('delete-btn')) {
                const orderId = parseInt(e.target.getAttribute('data-id'));
                deleteOrder(orderId);
            }
        });
    }

    // Fungsi untuk mengatur tampilan admin panel
    function handleAdminPanel() {
        if (window.location.hash === '#admin-panel') {
            if(adminPanel) adminPanel.style.display = 'flex';
            document.querySelectorAll('main section').forEach(section => {
                if (section.id !== 'admin-panel') {
                    section.style.display = 'none';
                }
            });
        } else {
            if(adminPanel) adminPanel.style.display = 'none';
            document.querySelectorAll('main section').forEach(section => {
                if (section.id !== 'admin-panel') {
                    section.style.display = 'block';
                }
            });
        }
    }

    // Event listener untuk perubahan hash di URL
    window.addEventListener('hashchange', handleAdminPanel);
    handleAdminPanel(); // Jalankan sekali saat halaman dimuat


    // ======================================================= //
    // --- JAVASCRIPT HALAMAN PENGEMBANG --- //
    // ======================================================= //

    // Data developer
    const developers = {
        1: {
            name: "sofiah rida",
            role: "UI/UX Designer",
            bio: "Spesialis dalam desain antarmuka pengguna dengan pengalaman 5 tahun di industri transportasi digital.",
            PortofolioLink: "",
        },
        2: {
            name: "vita aprilia",
            role: "Frontend Developer",
            bio: "Ahli dalam pengembangan frontend dengan teknologi modern seperti React dan Vue.js.",
            PortofolioLink: "https://github.com/pvitaaprillia-jpg/vitaaprilliaputri.porofolio.git",
        },
        3: {
            name: "nalunk pradita",
            role: "Backend Developer",
            bio: "ahli backend developer",
            PortofolioLink: "https://nalunkpradita8-svg.github.io/porto-nalunk/",
        },
        4: {
            name: "Muhamad jhuhan ixsa alviano",
            role: "Mobile Developer",
            bio: "Spesialis dalam pengembangan aplikasi mobile untuk platform Android.",
            PortofolioLink: " https://muhamadjhuhan.github.io/portofolio_jhuhan/",
        },
        5: {
            name: "Sapta mulya putra",
            role: "Data Analyst",
            bio: "Analis data dengan fokus pengalaman pengguna.",
            PortofolioLink: "https://saptamulya.github.io/website.porto/",
        },
    };

    // Fungsi untuk membuka modal
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
        }
    }

    // Fungsi untuk menutup semua modal
    function closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    // Add click event to all developer avatars
    document.querySelectorAll(".developer-avatar").forEach((avatar) => {
        avatar.addEventListener("click", function () {
            const developerId = this.getAttribute("data-developer");
            const developer = developers[developerId];

            // Update modal content dengan data developer
            modalAvatar.src = this.querySelector("img").src;
            modalName.textContent = developer.name;
            modalRole.textContent = developer.role;
            modalBio.textContent = developer.bio;
            modalDetailLink.href = developer.PortofolioLink;

            // Tambahkan atribut untuk tracking
            modalDetailLink.setAttribute("data-developer-id", developerId);

            // Show modal dengan animasi
            openModal('developerModal');

            // Scroll ke atas jika di mobile
            if (window.innerWidth <= 768) {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });
    });

    // Close modal saat tombol close diklik
    closeModalBtn.addEventListener("click", function () {
        closeAllModals();
    });

    // Close modal saat area di luar modal diklik
    window.addEventListener("click", function (event) {
        if (event.target.classList.contains('modal')) {
            closeAllModals();
        }
    });

    // Close modal saat tombol ESC ditekan
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeAllModals();
        }
    });

    // Track klik pada link detail 
    modalDetailLink.addEventListener("click", function (e) {
        const developerId = this.getAttribute("data-developer-id");
        const developer = developers[developerId];

        // Log untuk analytics (opsional)
        console.log(`User clicked detail link for ${developer.name}`);

        // Buka di tab baru
        e.target.setAttribute("target", "_blank");
        e.target.setAttribute("rel", "noopener noreferrer");
    });


    // ======================================================= //
    // --- INISIALISASI --- //
    // ======================================================= //
    
    // Tampilkan semua produk saat halaman dimuat
    displayProducts();
    // Inisialisasi UI keranjang
    updateCartUI();
});