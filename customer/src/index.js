const getEleId = (id) => document.getElementById(id);

const renderListProduct = (data) => {
    let content = "";

    data.forEach((product) => {
        const { imageUrl, name, description, price } = product
        content += `
            <div class="col-lg-3 col-md-6">
                <div class="single-product">
                    <div class="level-pro-new">
                        <span>new</span>
                    </div>
                    <div class="product-img">
                        <a href="#">
                            <img src="./ClientTemplate/img/25.png">
                        </a>
                    </div>
                    <div class="actions">
                        <button type="submit" class="cart-btn" title="Add to cart">add to
                            cart</button>
                        <ul class="add-to-link">
                            <li><a href="#"> <i class="fa fa-search"></i></a></li>
                            <li><a href="#"> <i class="fa-regular fa-heart"></i></a></li>
                            <li><a href="#"> <i class="fa fa-refresh"></i></a></li>
                        </ul>
                    </div>
                    <div class="product-price">
                        <div class="product-name">
                            <a href="#" title="Fusce aliquam">Fusce aliquam</a>
                        </div>
                        <div class="price-rating">
                            <span>$170.00</span>
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

const fetchListProduct = () => {
    // Pending => Block Loader
    getEleId("loader").style.display = "block";

    const promise = axios({
        url: "https://67663904410f8499965719d0.mockapi.io/api/Products",
        method: "GET"
    })

    promise
        .then((result) => {
            renderListProduct(result.data)
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

