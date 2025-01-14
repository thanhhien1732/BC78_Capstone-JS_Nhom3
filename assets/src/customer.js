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
                        <div>
                            <img src="./assets/img/${imageUrl}">
                        </div>
                    </div>
                    <div class="actions">
                        <button onclick="addItem('${name}', ${price}, './assets/img/${imageUrl}')" class="cart-btn add-btn">Add to Cart</button>
                        <ul class="add-to-link">
                            <li><a href="#"> <i class="fa fa-search"></i></a></li>
                            <li><a href="#"> <i class="fa-regular fa-heart"></i></a></li>
                            <li><a href="#" class="btn-refresh"> <i class="fa fa-refresh"></i></a></li>
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


// ==================== Tính năng giỏ hàng ======================
let cartDetails = [];

// Lưu giỏ hàng vào localStorage
const saveCartToLocalStorage = () => {
    localStorage.setItem("cartDetails", JSON.stringify(cartDetails));
};

// Tải giỏ hàng từ localStorage
const loadCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem("cartDetails");
    if (savedCart) {
        cartDetails = JSON.parse(savedCart);
        renderCart();
        updateCartSummary();
    }
};

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
    saveCartToLocalStorage();
};

// Xóa sản phẩm khỏi giỏ hàng
window.removeItem = name => {
    cartDetails = cartDetails.filter(item => item.name !== name);
    renderCart();
    updateCartSummary();
    saveCartToLocalStorage();
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
    saveCartToLocalStorage();
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
    // Tính tổng số lượng sản phẩm
    const totalQty = cartDetails.reduce((acc, item) => acc + item.qty, 0);

    // Tính tổng giá trị
    const totalPrice = cartDetails.reduce((acc, item) => acc + item.price * item.qty, 0);

    // Cập nhật số lượng sản phẩm hiển thị trong các phần tử có class "cart-count"
    const cartCountElements = document.querySelectorAll(".total-qty");
    cartCountElements.forEach((element) => {
        element.innerText = totalQty;
    });

    // Cập nhật tổng giá trị sản phẩm trong phần tử có class "total"
    const totalElement = document.querySelector(".total");
    if (totalElement) {
        totalElement.innerText = totalPrice.toFixed(2); // Hiển thị với 2 chữ số thập phân
    }
};

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
    saveCartToLocalStorage();
};

// Mua hàng
window.buy = () => {
    if (cartDetails.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    showOrder();
};

renderCart();
updateCartSummary();

// Tải giỏ hàng khi trang được tải
document.addEventListener("DOMContentLoaded", loadCartFromLocalStorage);

// ======================== Lọc sản phẩm ============================
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


// ======================== Tính năng Order ============================
// Hiển thị giao diện Order
const showOrder = () => {
    const orderNowElement = document.querySelector(".order-now");
    const invoiceElement = document.querySelector(".invoice");

    // Kiểm tra nếu phần tử tồn tại
    if (!orderNowElement || !invoiceElement) {
        console.error("Element '.order-now' or '.invoice' not found");
        return;
    }

    // Tạo nội dung hóa đơn
    let orderItems = cartDetails.map(item => `
        <span>${item.qty} x ${item.name}</span>
    `).join("");

    let orderPrices = cartDetails.map(item => `
        <span>$ ${(item.price * item.qty).toFixed(2)}</span>
    `).join("");

    const totalAmount = cartDetails.reduce((acc, item) => acc + item.price * item.qty, 0);

    // Cập nhật nội dung hóa đơn
    invoiceElement.innerHTML = `
        <div class="shipping-items">
            <div class="item-names">${orderItems}</div>
            <div class="items-price">${orderPrices}</div>
        </div>
        <hr>
        <div class="payment">
            <em>Payment</em>
            <div>
                <p>Total amount to be paid: </p>
                <span class="pay">$ ${totalAmount.toFixed(2)}</span>
            </div>
        </div>
        <div class="order">
            <button onclick="orderComplete()" class="btn-order btn">Order Now</button>
            <button onclick="cancelOrder()" class="btn-cancel btn">Cancel</button>
        </div>
    `;

    // Hiển thị Order và ẩn Cart
    document.querySelector(".cart").style.display = "none";
    orderNowElement.style.display = "flex"; // Sử dụng 'flex' để hiển thị
};

// Hoàn tất đơn hàng
window.orderComplete = () => {
    // Hiển thị giao diện "Cảm ơn"
    const orderNowElement = document.querySelector(".invoice");
    orderNowElement.innerHTML = `
        <div class="order-details animate__animated animate__fadeIn">
            <em class="thanks">Thank you for shopping!</em>
            <button onclick="okay(event)" class="btn-ok">Continue</button>
        </div>
    `;
};

// Kết thúc mua sắm
window.okay = (event) => {
    document.querySelector(".order-now").style.display = "none";
    clearCart();
    document.body.classList.remove("no-scroll");
};

// Hủy đơn hàng
window.cancelOrder = () => {
    document.querySelector(".order-now").style.display = "none";
    sideNav(1); // Hiển thị lại giỏ hàng
};