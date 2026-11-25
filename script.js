/**
 * SIGMA PRINTING MANADO - JAVASCRIPT LOGIC
 * File: script.js
 * Fitur:
 * 1. Live Search & Highlight Produk di Navbar
 * 2. Filter Kategori Produk Cepat
 * 3. Kalkulator Estimasi Biaya Cetak Interaktif
 * 4. Modal Order Cepat terintegrasi ke WhatsApp
 * 5. Floating Back-to-Top Button & Scroll Behavior
 */

// Nomor WhatsApp Resmi Toko (Silakan ganti dengan nomor aktif jika diperlukan)
const WHATSAPP_PHONE_NUMBER = "6281234567890";

// Data Material untuk Kalkulator
const PRINT_MATERIALS = {
    baliho: [
        { id: "flexi280", name: "Flexi Standar 280gr (Promo)", price: 18000, unit: "m²" },
        { id: "flexi340", name: "Flexi Sedang 340gr (Terlaris)", price: 25000, unit: "m²" },
        { id: "flexi440", name: "Flexi Korea 440gr (Tebal Awet)", price: 45000, unit: "m²" },
        { id: "backlite_out", name: "Backlite Outdoor (Neon Box)", price: 55000, unit: "m²" }
    ],
    a3: [
        { id: "cromo", name: "Stiker Cromo Glossy A3+", price: 8000, unit: "lembar" },
        { id: "vinyl", name: "Stiker Vinyl Waterproof A3+ (Tahan Air)", price: 12000, unit: "lembar" },
        { id: "artcarton", name: "Art Carton 260gr A3+ (Tebal Kaku)", price: 6000, unit: "lembar" },
        { id: "transparan", name: "Stiker Transparan Bening A3+", price: 14000, unit: "lembar" },
        { id: "artpaper", name: "Art Paper 150gr A3+ (Brosur/Flyer)", price: 5000, unit: "lembar" }
    ],
    indoor: [
        { id: "albatros", name: "Albatros + Laminasi (Roll Up/X-Banner)", price: 65000, unit: "m²" },
        { id: "luster", name: "Luster Paper High-Resolution", price: 75000, unit: "m²" },
        { id: "canvas", name: "Kanvas Lukis Artistik (Canvas)", price: 12000, unit: "m²" },
        { id: "backlite_in", name: "Backlite Film Indoor Bioskop", price: 90000, unit: "m²" }
    ]
};

// ==========================================================================
// INISIALISASI SAAT DOM SIAP
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    initWelcomeScreen();
    initCalculator();
    initNavbarSearch();
    initCategoryFilters();
    initScrollToTop();
    initMobileNavClose();
    initScrollReveal();
    checkUrlSearchParam();
});

// ==========================================================================
// 0. FITUR LAYAR AWAL (WELCOME SCREEN) & CERITA PEMBUAT
// ==========================================================================
function initWelcomeScreen() {
    const welcomeScreen = document.getElementById("welcomeScreen");
    const btnEnter = document.getElementById("btnEnterSite");

    if (!welcomeScreen || !btnEnter) return;

    btnEnter.addEventListener("click", (e) => {
        e.preventDefault();
        welcomeScreen.classList.add("hide-welcome");
        document.body.classList.remove("welcome-locked");
        
        // Arahkan mulus ke beranda.html setelah animasi transisi
        setTimeout(() => {
            window.location.href = "beranda.html";
        }, 350);
    });
}

// Buka Modal Cerita Pembuat Website (Josua Hansen Lontoh)
function openCreatorStory() {
    const storyModalElem = document.getElementById("creatorStoryModal");
    if (storyModalElem && typeof bootstrap !== "undefined") {
        const storyModal = new bootstrap.Modal(storyModalElem);
        storyModal.show();
    }
}

// Masuk ke Layar Utama langsung dari dalam Modal Cerita
function enterSiteFromStory() {
    const storyModalElem = document.getElementById("creatorStoryModal");
    if (storyModalElem && typeof bootstrap !== "undefined") {
        const modalInstance = bootstrap.Modal.getInstance(storyModalElem);
        if (modalInstance) {
            modalInstance.hide();
        }
    }

    const welcomeScreen = document.getElementById("welcomeScreen");
    if (welcomeScreen && !welcomeScreen.classList.contains("hide-welcome")) {
        welcomeScreen.classList.add("hide-welcome");
        document.body.classList.remove("welcome-locked");
    }

    const path = window.location.pathname;
    if (path.endsWith("index.html") || path.endsWith("/")) {
        setTimeout(() => {
            window.location.href = "beranda.html";
        }, 350);
    }
}

// ==========================================================================
// PEMBERITAHUAN FORMALITAS UNTUK APLIKASI EKSTERNAL
// ==========================================================================
function showFormalityNotice(appName = "Aplikasi Eksternal", customMsg = null) {
    const modalTitle = document.getElementById("formalityNoticeTitle");
    const modalDesc = document.getElementById("formalityNoticeDesc");
    const modalElem = document.getElementById("formalityNoticeModal");

    if (modalTitle) {
        modalTitle.textContent = `Fitur ${appName} (Formalitas)`;
    }
    if (modalDesc) {
        modalDesc.textContent = customMsg || `Akses ke aplikasi ${appName} ini dibuat hanya untuk formalitas demonstrasi project web.`;
    }

    if (modalElem && typeof bootstrap !== "undefined") {
        const noticeModal = new bootstrap.Modal(modalElem);
        noticeModal.show();
    } else {
        alert(`Pemberitahuan: Fitur ${appName} dibuat hanya untuk formalitas.`);
    }
}

// ==========================================================================
// 1. FITUR SEARCH NAVBAR & LIVE DROPDOWN
// ==========================================================================
function initNavbarSearch() {
    const searchInput = document.getElementById("navbarSearchInput");
    const resultsBox = document.getElementById("searchResultsBox");

    if (!searchInput || !resultsBox) return;

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim().toLowerCase();
        
        if (query.length === 0) {
            resultsBox.classList.add("d-none");
            resultsBox.innerHTML = "";
            return;
        }

        const productCards = document.querySelectorAll(".product-card-item");
        const matchedItems = [];

        productCards.forEach((card) => {
            const titleAttr = card.getAttribute("data-title") || "";
            const titleElem = card.querySelector("h5, h4");
            const titleText = titleElem ? titleElem.textContent.toLowerCase() : "";
            const descElem = card.querySelector("p");
            const descText = descElem ? descElem.textContent.toLowerCase() : "";

            if (titleAttr.includes(query) || titleText.includes(query) || descText.includes(query)) {
                matchedItems.push({
                    element: card,
                    title: titleElem ? titleElem.textContent : "Produk Sigma",
                    badge: card.querySelector(".badge-price-tag") ? card.querySelector(".badge-price-tag").textContent : "Lihat Harga"
                });
            }
        });

        if (matchedItems.length > 0) {
            let html = '<div class="text-secondary small px-2 py-1 border-bottom border-secondary mb-1">Ditemukan ' + matchedItems.length + ' hasil:</div>';
            matchedItems.forEach((item, index) => {
                html += `
                    <div class="search-result-item d-flex justify-content-between align-items-center" onclick="goToSearchResult('${item.title}')">
                        <div>
                            <i class="bi bi-tag-fill text-danger me-2"></i>
                            <strong>${item.title}</strong>
                        </div>
                        <span class="badge bg-dark border border-secondary text-warning">${item.badge}</span>
                    </div>
                `;
            });
            resultsBox.innerHTML = html;
            resultsBox.classList.remove("d-none");
        } else {
            resultsBox.innerHTML = `
                <div class="p-3 text-center text-muted small">
                    <i class="bi bi-search me-1"></i> Tidak ada produk sesuai "<strong>${escapeHtml(query)}</strong>".
                    <div class="mt-1 text-danger">Silakan tanyakan langsung ke CS kami di Paal 2.</div>
                </div>
            `;
            resultsBox.classList.remove("d-none");
        }
    });

    // Sembunyikan dropdown saat klik di luar
    document.addEventListener("click", (e) => {
        if (!searchInput.contains(e.target) && !resultsBox.contains(e.target)) {
            resultsBox.classList.add("d-none");
        }
    });
}

function triggerSearch() {
    const searchInput = document.getElementById("navbarSearchInput");
    if (!searchInput) return;
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;

    const productCards = document.querySelectorAll(".product-card-item");
    let found = null;

    productCards.forEach((card) => {
        const titleAttr = card.getAttribute("data-title") || "";
        const titleElem = card.querySelector("h5, h4");
        const titleText = titleElem ? titleElem.textContent.toLowerCase() : "";

        if (!found && (titleAttr.includes(query) || titleText.includes(query))) {
            found = card;
        }
    });

    if (found) {
        document.getElementById("searchResultsBox").classList.add("d-none");
        highlightAndScrollTo(found);
    } else {
        alert('Produk "' + query + '" tidak ditemukan. Silakan hubungi CS Sigma Printing Paal 2 untuk pesanan khusus.');
    }
}

function goToSearchResult(titleText) {
    const resultsBox = document.getElementById("searchResultsBox");
    if (resultsBox) resultsBox.classList.add("d-none");

    const productCards = document.querySelectorAll(".product-card-item");
    let foundCard = null;

    productCards.forEach((card) => {
        const titleElem = card.querySelector("h5, h4");
        if (titleElem && titleElem.textContent.trim().toLowerCase().includes(titleText.trim().toLowerCase())) {
            foundCard = card;
        }
    });

    if (foundCard) {
        highlightAndScrollTo(foundCard);
    } else {
        // Jika sedang di halaman lain (beranda, tentang, kontak, kalkulator), arahkan ke produk.html
        window.location.href = `produk.html?search=${encodeURIComponent(titleText)}`;
    }
}

function highlightAndScrollTo(element) {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
    element.classList.add("highlight-pulse");
    setTimeout(() => {
        element.classList.remove("highlight-pulse");
    }, 2500);
}

// Cek parameter ?search= di URL saat halaman dimuat (untuk navigasi pencarian antar halaman)
function checkUrlSearchParam() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTarget = urlParams.get("search");
    if (!searchTarget) return;

    setTimeout(() => {
        const productCards = document.querySelectorAll(".product-card-item");
        productCards.forEach((card) => {
            const titleElem = card.querySelector("h5, h4");
            if (titleElem && titleElem.textContent.trim().toLowerCase().includes(searchTarget.trim().toLowerCase())) {
                highlightAndScrollTo(card);
            }
        });
    }, 400);
}

// ==========================================================================
// 2. FILTER KATEGORI CEPAT
// ==========================================================================
function initCategoryFilters() {
    const filterButtons = document.querySelectorAll(".btn-filter");
    const sections = document.querySelectorAll(".product-section");
    if (!filterButtons.length) return;

    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            filterButtons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");

            if (filterValue === "all") {
                sections.forEach((sec) => (sec.style.display = "block"));
            } else {
                sections.forEach((sec) => {
                    if (sec.getAttribute("data-category") === filterValue) {
                        sec.style.display = "block";
                        sec.scrollIntoView({ behavior: "smooth", block: "start" });
                    } else {
                        sec.style.display = "none";
                    }
                });
            }
        });
    });
}

// ==========================================================================
// 3. KALKULATOR ESTIMASI BIAYA CETAK
// ==========================================================================
function initCalculator() {
    const serviceTypeElem = document.getElementById("calcServiceType");
    if (!serviceTypeElem) return;
    updateCalcFields();
    calculatePrice();
}

function updateCalcFields() {
    const serviceTypeElem = document.getElementById("calcServiceType");
    if (!serviceTypeElem) return;
    const serviceType = serviceTypeElem.value;
    const materialSelect = document.getElementById("calcMaterial");
    const balihoSizeInputs = document.getElementById("balihoSizeInputs");
    const a3QuantityInput = document.getElementById("a3QuantityInput");

    if (!materialSelect) return;

    // Populate materials
    materialSelect.innerHTML = "";
    const materials = PRINT_MATERIALS[serviceType] || [];
    materials.forEach((mat) => {
        const opt = document.createElement("option");
        opt.value = mat.price;
        opt.setAttribute("data-name", mat.name);
        opt.setAttribute("data-unit", mat.unit);
        opt.textContent = `${mat.name} - Rp ${formatNumber(mat.price)} / ${mat.unit}`;
        materialSelect.appendChild(opt);
    });

    // Toggle input types
    if (serviceType === "a3") {
        if (balihoSizeInputs) balihoSizeInputs.classList.add("d-none");
        if (a3QuantityInput) a3QuantityInput.classList.remove("d-none");
    } else {
        if (balihoSizeInputs) balihoSizeInputs.classList.remove("d-none");
        if (a3QuantityInput) a3QuantityInput.classList.add("d-none");
    }

    calculatePrice();
}

function calculatePrice() {
    const serviceTypeElem = document.getElementById("calcServiceType");
    if (!serviceTypeElem) return;
    const serviceType = serviceTypeElem.value;
    const materialSelect = document.getElementById("calcMaterial");
    if (!materialSelect) return;

    const designFeeElem = document.getElementById("calcDesignFee");
    const designFee = designFeeElem ? (parseInt(designFeeElem.value, 10) || 0) : 0;
    const priceDisplay = document.getElementById("totalPriceDisplay");
    const detailDisplay = document.getElementById("calcSummaryDetail");

    const selectedOption = materialSelect.options[materialSelect.selectedIndex];
    if (!selectedOption) return;

    const unitPrice = parseInt(selectedOption.value, 10) || 0;
    const materialName = selectedOption.getAttribute("data-name") || "";

    let totalPrice = 0;
    let detailText = "";

    if (serviceType === "a3") {
        const qty = parseInt(document.getElementById("calcQtyA3").value, 10) || 1;
        const isKissCut = document.getElementById("calcKissCut").checked;
        const kissCutFeePerSheet = isKissCut ? 5000 : 0;
        const subtotalPrint = qty * (unitPrice + kissCutFeePerSheet);
        totalPrice = subtotalPrint + designFee;

        let extraNote = isKissCut ? " + Kiss Cut Rp 5.000/lbr" : "";
        let designNote = designFee > 0 ? ` + Jasa Desain Rp ${formatNumber(designFee)}` : " (Tanpa Jasa Desain)";
        detailText = `(${qty} lembar @ Rp ${formatNumber(unitPrice)}${extraNote}${designNote})`;
    } else {
        // Baliho atau Cetak Indoor (per m2)
        const length = parseFloat(document.getElementById("calcLength").value) || 1;
        const width = parseFloat(document.getElementById("calcWidth").value) || 1;
        const area = Math.max(0.1, length * width);
        // Cetak minimal dihitung 1 m2 jika di bawah 1 m2 untuk standar percetakan
        const billableArea = area < 1 ? 1 : area;
        const subtotalPrint = Math.round(billableArea * unitPrice);
        totalPrice = subtotalPrint + designFee;

        let designNote = designFee > 0 ? ` + Desain Rp ${formatNumber(designFee)}` : " (File Siap Cetak)";
        detailText = `(Ukuran ${length}x${width}m = ${area.toFixed(1)} m² @ Rp ${formatNumber(unitPrice)}${designNote})`;
    }

    priceDisplay.textContent = `Rp ${formatNumber(totalPrice)}`;
    detailDisplay.textContent = detailText;
}

// Kirim Order dari Kalkulator ke WhatsApp
function orderViaWhatsApp() {
    const serviceType = document.getElementById("calcServiceType").value;
    const materialSelect = document.getElementById("calcMaterial");
    const selectedOption = materialSelect.options[materialSelect.selectedIndex];
    const materialName = selectedOption.getAttribute("data-name");
    const designFee = parseInt(document.getElementById("calcDesignFee").value, 10);
    const totalPrice = document.getElementById("totalPriceDisplay").textContent;

    let designStatus = "Sudah Punya Desain Siap Cetak (Rp 0)";
    if (designFee === 20000) designStatus = "Butuh Desain Simpel (+Rp 20.000)";
    if (designFee === 40000) designStatus = "Butuh Desain Custom Promosi (+Rp 40.000)";

    let orderSpec = "";
    if (serviceType === "a3") {
        const qty = document.getElementById("calcQtyA3").value;
        const isKissCut = document.getElementById("calcKissCut").checked ? "Ya (+Kiss Cut)" : "Tidak (Potong Lurus/Lembaran)";
        orderSpec = `Jumlah: ${qty} Lembar A3+\nFinishing Potong: ${isKissCut}`;
    } else {
        const length = document.getElementById("calcLength").value;
        const width = document.getElementById("calcWidth").value;
        orderSpec = `Ukuran: ${length} meter x ${width} meter`;
    }

    const message = `Halo Sigma Printing Manado (Paal 2), saya ingin memesan cetak dengan estimasi kalkulator:\n\n` +
        `*Layanan:* ${getServiceName(serviceType)}\n` +
        `*Bahan:* ${materialName}\n` +
        `*Spesifikasi:* ${orderSpec}\n` +
        `*Layanan Desain:* ${designStatus}\n` +
        `*Total Estimasi:* ${totalPrice}\n\n` +
        `Mohon konfirmasi ketersediaan bahan dan waktu pengerjaan. Terima kasih!`;

    // Tampilkan notifikasi formalitas untuk aplikasi eksternal
    showFormalityNotice("WhatsApp", "Fitur pemesanan langsung ke WhatsApp ini dibuat hanya untuk formalitas demonstrasi project web design.");
}

function getServiceName(type) {
    if (type === "baliho") return "Baliho & Spanduk Outdoor";
    if (type === "a3") return "Digital Printing Kertas A3+";
    if (type === "indoor") return "Cetak Indoor High-Resolution";
    return "Percetakan";
}

// ==========================================================================
// 4. MODAL PEMESANAN CEPAT
// ==========================================================================
function openOrderModal(productName, priceRate, category) {
    document.getElementById("modalProductName").value = productName;
    document.getElementById("modalProductPrice").value = priceRate;
    document.getElementById("modalCustomerName").value = "";
    document.getElementById("modalOrderSpecs").value = "";
    document.getElementById("modalOrderNotes").value = "";

    const orderModal = new bootstrap.Modal(document.getElementById("orderModal"));
    orderModal.show();
}

function submitModalOrder() {
    const product = document.getElementById("modalProductName").value;
    const priceRate = document.getElementById("modalProductPrice").value;
    const customer = document.getElementById("modalCustomerName").value.trim() || "Pelanggan";
    const specs = document.getElementById("modalOrderSpecs").value.trim() || "Sesuai standar";
    const designOption = document.getElementById("modalDesignOption").value;
    const notes = document.getElementById("modalOrderNotes").value.trim() || "Tidak ada catatan tambahan";

    const message = `Halo Sigma Printing Paal 2 Manado,\n` +
        `Saya atas nama *${customer}* ingin memesan cetak:\n\n` +
        `*Produk:* ${product}\n` +
        `*Harga Referensi:* ${priceRate}\n` +
        `*Ukuran/Jumlah:* ${specs}\n` +
        `*Status Desain:* ${designOption}\n` +
        `*Catatan Khusus:* ${notes}\n\n` +
        `Mohon info total biaya dan nomor rekening untuk proses produksi. Terima kasih!`;

    const modalElement = document.getElementById("orderModal");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
        modalInstance.hide();
    }

    // Tampilkan notifikasi formalitas untuk aplikasi eksternal
    showFormalityNotice("WhatsApp", "Pengiriman form pesanan ke WhatsApp ini dibuat hanya untuk formalitas demonstrasi project web design.");
}

// ==========================================================================
// 5. FLOATING SCROLL TO TOP & NAVBAR AUTO CLOSE
// ==========================================================================
function initScrollToTop() {
    const backBtn = document.getElementById("backToTopBtn");
    if (!backBtn) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
            backBtn.style.display = "flex";
        } else {
            backBtn.style.display = "none";
        }
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function initMobileNavClose() {
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link:not(.dropdown-toggle)");
    const navbarCollapse = document.getElementById("navbarContent");

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if (navbarCollapse.classList.contains("show")) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) bsCollapse.hide();
            }
        });
    });
}

// Utility: Format Angka Ribuan
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Utility: Escape HTML sederhana untuk keamanan
function escapeHtml(string) {
    return String(string).replace(/[&<>"']/g, function(s) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[s];
    });
}

// Inisialisasi Efek Animasi Fade-in on Scroll
function initScrollReveal() {
    const revealElements = document.querySelectorAll(".reveal-scroll");
    if (!revealElements.length) return;

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: "0px 0px -30px 0px"
        });

        revealElements.forEach((el) => observer.observe(el));
    } else {
        // Fallback untuk browser lawas tanpa IntersectionObserver
        revealElements.forEach((el) => el.classList.add("is-visible"));
    }
}
