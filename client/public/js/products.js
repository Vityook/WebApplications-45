$(document).ready(function() {
    let currentPage = 1;
    const productsPerPage = 10;

    function loadProducts(page) {
        $.ajax({
            url: `/api/products?page=${page}&limit=${productsPerPage}`,
            method: 'GET',
            success: function(response) {
                const products = response.products;
                const totalPages = response.totalPages;

                const productList = products.map(product => `
                    <div class="product">
                        <h3 class="product-name">${product.name}</h3>
                        <p>Price: $${product.price}</p>
                        <p>Category: ${product.category}</p>
                        <button class="add-to-cart rounded-button" data-id="${product._id}">Add to Cart</button>
                    </div>
                `).join('');

                $('#product-list').html(productList);
                updatePagination(page, totalPages);
            },
            error: function(err) {
                console.error('Error loading products:', err);
            }
        });
    }

    function updatePagination(currentPage, totalPages) {
        let paginationHtml = '';
        for (let i = 1; i <= totalPages; i++) {
            paginationHtml += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
        $('#pagination').html(paginationHtml);
    }

    $(document).on('click', '.page-btn', function() {
        currentPage = parseInt($(this).data('page'));
        loadProducts(currentPage);
    });

    $(document).on('click', '.add-to-cart', function() {
        const productId = $(this).data('id');
        $.ajax({
            url: '/api/cart/add',
            method: 'POST',
            data: JSON.stringify({ productId: productId }),
            contentType: 'application/json',
            success: function(response) {
                alert('Product added to cart!');
                updateCartCount();
            },
            error: function(err) {
                console.error('Error adding product to cart:', err);
            }
        });
    });

    function updateCartCount() {
        $.ajax({
            url: '/api/cart/count',
            method: 'GET',
            success: function(response) {
                $('#cart-count').text(response.count);
            },
            error: function(err) {
                console.error('Error updating cart count:', err);
            }
        });
    }

    // Initial load
    loadProducts(currentPage);
    updateCartCount();
});