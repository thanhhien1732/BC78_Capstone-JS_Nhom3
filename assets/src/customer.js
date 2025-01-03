const getEleId = (id) => document.getElementById(id);

// Render List Product
const renderListProduct = (data) => {
    let content = "";

    // Loop Products
    data.forEach((product) => {
        const { imageUrl, name, price } = product
        content += `
            <div class="col-lg-3 col-md-6">
                <div class="single-product">
                    <div class="level-pro-new">
                        <span>new</span>
                    </div>
                    <div class="product-img">
                        <a href="#">
                            <img src="./assets/img/${imageUrl}">
                        </a>
                    </div>
                    <div class="actions">
                        <button onclick="addItem('${name}', ${price}, './assets/img/${imageUrl}')" class="cart-btn add-btn">Add to Cart</button>
                        <ul class="add-to-link">
                            <li><a href="#"> <i class="fa fa-search"></i></a></li>
                            <li><a href="#"> <i class="fa-regular fa-heart"></i></a></li>
                            <li><a href="#"> <i class="fa fa-refresh"></i></a></li>
                        </ul>
                    </div>
                    <div class="product-price">
                        <div class="product-name">
                            <a href="#">${name}</a>
                        </div>
                        <div class="price-rating">
                            <span>$${price}</span>
                            <div class="ratings">
                                <i class="fa fa-star"></i>
                                <i class="fa fa-star"></i>
                                <i class="fa fa-star"></i>
                                <i class="fa fa-star"></i>
                                <i class="fa-regular fa-star-half-stroke"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    })

    // Show Products to UI
    getEleId("mainProduct").innerHTML = content;
}

// Fetch List Product
const fetchListProduct = () => {
    // Pending => Block Loader
    getEleId("loader").style.display = "block";

    // Call API
    const promise = axios({
        url: "https://6766c856410f84999658928f.mockapi.io/api/Products",
        method: "GET"
    })

    promise
        .then((result) => {
            originalProductList = result.data;
            renderListProduct(originalProductList);
            // Resolved => Hide Loader
            getEleId("loader").style.display = "none";
        })
        .catch((error) => {
            console.log(error)
            // Resolved => Hide Loader
            getEleId("loader").style.display = "none";
        })
}

fetchListProduct();

// ================== Tính năng giỏ hàng ==================
let cartDetails = [];

// Thêm sản phẩm vào giỏ hàng
window.addItem = (name, price, imgSrc) => {
    const existingProduct = cartDetails.find(item => item.name === name);

    if (existingProduct) {
        existingProduct.qty += 1;
    } else {
        cartDetails.push({ name, price, imgSrc, qty: 1 });
    }

    renderCart();
    updateCartSummary();
};

// Xóa sản phẩm khỏi giỏ hàng
window.removeItem = name => {
    cartDetails = cartDetails.filter(item => item.name !== name);
    renderCart();
    updateCartSummary();
};

// Cập nhật số lượng sản phẩm
window.qtyChange = (name, action) => {
    const product = cartDetails.find(item => item.name === name);

    if (product) {
        if (action === "add") product.qty += 1;
        if (action === "sub") product.qty -= 1;

        if (product.qty <= 0) removeItem(name);
    }

    renderCart();
    updateCartSummary();
};


// Hiển thị sản phẩm trong giỏ hàng
const renderCart = () => {
    const cartItemsContainer = document.querySelector(".cart-items");
    cartItemsContainer.innerHTML = "";

    if (cartDetails.length === 0) {
        cartItemsContainer.innerHTML = "<span span class='empty-cart'> You Haven't Added Any Product In The Cart!</span>";
        return;
    }

    cartDetails.forEach(item => {
        const { name, price, imgSrc, qty } = item;
        const cartItem = `
            <div class="row cart-item">
                <div class="col-md-3">
                    <div class="cart-img">
                        <img src="${imgSrc}" alt="${name}">
                    </div>
                </div>
                <div class="col-md-2">
                    <strong class="name">${name}</strong>
                </div>
                <div class="col-md-3">
                    <span class="qty-change">
                        <div style="display: flex">
                            <button class="btn-qty" onclick="qtyChange('${name}', 'sub')">
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            <p class="qty">${qty}</p>
                            <button class="btn-qty" onclick="qtyChange('${name}', 'add')">
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </span>
                <div class="col-md-2">
                    <p class="price">$${(price * qty).toFixed(2)}</p>
                </div>
                <div class="col-md-2">
                    <button onclick="removeItem('${name}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        cartItemsContainer.innerHTML += cartItem;
    });
};

// Cập nhật tổng giá và số lượng trong giỏ hàng
const updateCartSummary = () => {
    const totalQty = cartDetails.reduce((acc, item) => acc + item.qty, 0);
    const totalPrice = cartDetails.reduce((acc, item) => acc + item.price * item.qty, 0);

    document.querySelector(".total-qty").innerText = totalQty;
    document.querySelector(".total").innerText = totalPrice.toFixed(2);
};

// Hiển thị/ẩn thanh điều hướng bên phải
// Hiển thị/ẩn thanh điều hướng bên phải
window.sideNav = action => {
    const sideNavElement = document.querySelector(".side-nav");
    const coverElement = document.querySelector(".cover");
    const cartElement = document.querySelector(".cart");

    if (action) {
        // Hiển thị side-nav với hiệu ứng fade-in từ phải
        sideNavElement.classList.remove("animate__fadeInLeft");
        sideNavElement.classList.add("animate__fadeInRight");
        sideNavElement.style.right = "0";
        coverElement.style.display = "block";
        cartElement.style.display = "block";
        document.body.classList.add("no-scroll");
    } else {
        // Ẩn side-nav với hiệu ứng fade-in từ trái
        sideNavElement.classList.remove("animate__fadeInRight");
        sideNavElement.style.right = "-100%";

        // Đợi hiệu ứng hoàn tất trước khi ẩn cart
        setTimeout(() => {
            sideNavElement.classList.add("animate__fadeInLeft");
            coverElement.style.display = "none";
            cartElement.style.display = "none";
            document.body.classList.remove("no-scroll");
        }, 500);
    }
};


// Xóa toàn bộ giỏ hàng
window.clearCart = () => {
    cartDetails = [];
    renderCart();
    updateCartSummary();
};

// Mua hàng
window.buy = () => {
    if (cartDetails.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    alert("Thank you for your purchase!");
    clearCart();
};

renderCart();
updateCartSummary();

// ================== Lọc sản phẩm ==================
let originalProductList = [];

// Lọc và render danh sách sản phẩm dựa trên loại giày
const filterProducts = () => {
    const filterValue = getEleId("filterName").value.toLowerCase();
    let filteredProducts;

    if (filterValue === "all") {
        // Hiển thị tất cả sản phẩm nếu chọn "Tất cả giày"
        filteredProducts = originalProductList;
    } else {
        // Lọc sản phẩm dựa trên loại được chọn
        filteredProducts = originalProductList.filter(product =>
            product.name.toLowerCase().includes(filterValue)
        );
    }

    renderListProduct(filteredProducts);
};

getEleId("filterName").addEventListener("change", filterProducts);
