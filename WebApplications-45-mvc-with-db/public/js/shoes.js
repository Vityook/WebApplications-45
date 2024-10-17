// Utility functions
function showPopup(popupElement) {
    if (popupElement) {
        popupElement.style.display = 'block';
    }
}

function hidePopup(popupElement) {
    if (popupElement) {
        popupElement.style.display = 'none';
    }
}

// Setup navigation
function setupNavigation() {
    const navLinks = {
        'homeLink': '/',
        'aboutLink': '/about',
        'reviewLink': '/review',
        'servicesLink': '/services'
    };

    for (const [id, href] of Object.entries(navLinks)) {
        const link = document.getElementById(id);
        if (link) {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                if (id === 'homeLink') {
                    window.location.reload();
                } else {
                    window.location.href = href;
                }
            });
        }
    }
}

// Login and registration handling
function setupAuthForms() {
    const loginIcon = document.getElementById('user-icon');
    const popupContainer = document.getElementById('popupContainer');
    const closePopup = document.getElementById('closePopup');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegisterForm = document.getElementById('showRegisterForm');
    const showLoginForm = document.getElementById('showLoginForm');

    loginIcon?.addEventListener('click', () => showPopup(popupContainer));
    closePopup?.addEventListener('click', () => hidePopup(popupContainer));

    window.addEventListener('click', (event) => {
        if (event.target === popupContainer) {
            hidePopup(popupContainer);
        }
    });

    showRegisterForm?.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });

    showLoginForm?.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    loginForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        axios.post('/auth/login', { email, password })
            .then(response => {
                alert('Login successful!');
                window.location.reload();
            })
            .catch(error => {
                alert('Login failed: ' + (error.response ? error.response.data : error.message));
            });
    });

    const registerFormSubmit = document.getElementById('registerFormSubmit');
    registerFormSubmit?.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        
        axios.post('/auth/register', { username, email, password })
            .then(response => {
                alert('Registration successful! Please log in.');
                registerForm.style.display = 'none';
                loginForm.style.display = 'block';
            })
            .catch(error => {
                alert('Registration failed: ' + (error.response ? error.response.data : error.message));
            });
    });
}

// Order history
function setupOrderHistory() {
    const orderHistoryLink = document.getElementById('orderHistoryLink');
    const orderHistoryPopup = document.getElementById('orderHistoryPopup');
    const closeOrderHistoryPopup = document.getElementById('closeOrderHistoryPopup');
    const orderHistoryContainer = document.getElementById('orderHistoryContainer');

    orderHistoryLink?.addEventListener('click', (event) => {
        event.preventDefault();
        fetchAndDisplayOrderHistory();
        showPopup(orderHistoryPopup);
    });

    closeOrderHistoryPopup?.addEventListener('click', () => hidePopup(orderHistoryPopup));

    function fetchAndDisplayOrderHistory() {
        fetch('/order-history')
            .then(response => response.json())
            .then(data => {
                orderHistoryContainer.innerHTML = '';
                if (data.success) {
                    data.orders.forEach(order => {
                        const orderElement = document.createElement('div');
                        orderElement.classList.add('order-item');
                        orderElement.innerHTML = `
                            <h3>Order ID: ${order._id}</h3>
                            <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
                            <p>Total: $${order.totalAmount.toFixed(2)}</p>
                            <p>Status: ${order.status}</p>
                            <ul>
                                ${order.items.map(item => `<li>${item.shoe.name} - $${item.shoe.price}</li>`).join('')}
                            </ul>
                        `;
                        orderHistoryContainer.appendChild(orderElement);
                    });
                } else {
                    orderHistoryContainer.innerHTML = '<p>Failed to retrieve order history.</p>';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                orderHistoryContainer.innerHTML = '<p>An error occurred while retrieving the order history.</p>';
            });
    }
}

// Preferred shoes functionality
function setupPreferredShoes() {
    const heartIcon = document.getElementById('heartIcon');
    const preferredShoesPopup = document.getElementById('preferredShoesPopup');
    const closePreferredShoesPopup = document.getElementById('closepreferredPopup');
    const preferredShoesContainer = document.getElementById('preferredShoesContainer');

    // Ensure the favorites icon opens the popup
    heartIcon.addEventListener('click', () => {
        fetchFavorites();
        showPopup(preferredShoesPopup);
    });

    // Ensure the close button hides the popup
    closePreferredShoesPopup?.addEventListener('click', () => hidePopup(preferredShoesPopup));

    // Optional: Close the popup when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === preferredShoesPopup) {
            hidePopup(preferredShoesPopup);
        }
    });

    function fetchFavorites() {
        fetch('/get-favorites')
            .then(response => response.json())
            .then(data => {
                preferredShoesContainer.innerHTML = data.favorites.map(shoe => `
                    <div>
                        <img src="${shoe.imageSrc}" alt="${shoe.name}">
                        <p>${shoe.name}</p>
                        <button class="remove-shoe" data-id="${shoe._id}">Remove</button>
                    </div>`).join('');
                setupRemoveFavoriteButtons();
            });
    }

    function setupRemoveFavoriteButtons() {
        document.querySelectorAll('.remove-shoe').forEach(button => {
            button.addEventListener('click', (e) => {
                const shoeId = button.getAttribute('data-id');
                toggleFavorite(shoeId);
                button.closest('div').remove();
                updateFavoritesCount();
            });
        });
    }


    function updateFavoritesCount() {
        fetch('/get-favorites-count')
        .then(response => response.json())
        .then(data => {
            heartIcon.setAttribute('data-count', data.count);
            heartIcon.classList.toggle('with-preferred', data.count > 0);
        })
        .catch(error => console.error('Error:', error));
    }

    updateFavoritesCount();
}

// Cart functionality
function setupCart() {
    const cartIcon = document.getElementById("cartIcon");
    const cartPopup = document.getElementById("cartPopup");
    const closeCartPopup = document.getElementById("closeCartPopup");
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const addToCartBtns = document.querySelectorAll(".addToCartBtn");

    addToCartBtns.forEach(button => {
        button.addEventListener("click", function(event) {
            event.preventDefault();
            const productId = this.getAttribute("data-id");
            addToCart(productId);
        });
    });

    function addToCart(productId, quantity = 1) {
        fetch('/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, quantity })
        })
        .then(response => response.json())  // Parse the JSON from the response
        .then(data => {
            // Check if the request was successful
            if (data.success) {
                alert('Item added to cart successfully');
                
                // Update the cart icon count (ensure cartCount is returned)
                if (data.cartCount !== undefined) {
                    updateCartIcon(data.cartCount);
                } else {
                    // Fallback: fetch the cart count again if it's not returned in the response
                    initializeCartCount();
                }
            } else {
                // If success is false, log the error message
                console.error('Server error response:', data);
                alert('Failed to add item to cart: ' + (data.message || 'Unknown error'));
            }
        })
        .catch(error => {
            // Log the full error for debugging
            console.error('Error in addToCart:', error);
            alert('An error occurred while adding the item to your cart');
        });
    }

    function updateCartDisplay() {
        fetch('/cart/get-cart')
            .then(response => response.json())
            .then(data => {
                const cartItems = document.getElementById('cartItems');
                const cartTotal = document.getElementById('cartTotal');
    
                // Clear existing cart items
                cartItems.innerHTML = '';
                
                if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
                    cartItems.innerHTML = '<p>No items in cart</p>';
                    cartTotal.textContent = "$0.00"; // Reset the total amount to 0
                    return;
                }
    
                // Generate the cart items list
                let total = 0;
                data.items.forEach(item => {
                    const cartItemHTML = `
                        <div class="cart-item">
                            <img src="${item.imageSrc}" alt="${item.name}" class="cart-item-image">
                            <p>${item.name} - $${item.price.toFixed(2)}</p>
                            <p>Quantity: ${item.quantity}</p>
                            <button class="remove-item" data-id="${item._id}">Remove</button>
                        </div>
                    `;
                    cartItems.insertAdjacentHTML('beforeend', cartItemHTML);
                    total += item.price * item.quantity;
                });
    
                // Update the total price
                cartTotal.textContent = "$" + total.toFixed(2);
    
                // Setup the "Remove" buttons functionality
                setupRemoveFromCartButtons();
            })
            .catch(error => {
                console.error('Error updating cart display:', error);
                const cartItems = document.getElementById('cartItems');
                cartItems.innerHTML = '<p>Error loading cart items</p>';
            });
    }
    
    function setupRemoveFromCartButtons() {
        const removeButtons = document.querySelectorAll('.remove-item');
        removeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.getAttribute('data-id');
                removeFromCart(productId);
            });
        });
    }
    
    function removeFromCart(productId) {
        fetch('/cart/remove', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId })
        })
        .then(response => response.json())
        .then(() => {
            updateCartDisplay();  // Refresh cart display after removing an item
        });
    }

    cartIcon.onclick = () => {
        updateCartDisplay();
        showPopup(cartPopup);
    };
    closeCartPopup.onclick = () => hidePopup(cartPopup);

    window.onclick = function (event) {
        if (event.target == cartPopup) {
            hidePopup(cartPopup);
        }
    }

    updateCartDisplay();
}

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const productsContainer = document.querySelector('.products .box');
    const productCards = productsContainer.querySelectorAll('.card');

    searchInput.addEventListener('input', function() {
        const query = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        productCards.forEach(card => {
            const productName = card.querySelector('h2').textContent.toLowerCase();
            if (productName.includes(query)) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        let noResultsMsg = productsContainer.querySelector('.no-results-message');
        if (visibleCount === 0) {
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('p');
                noResultsMsg.className = 'no-results-message';
                noResultsMsg.textContent = 'No results found.';
                productsContainer.appendChild(noResultsMsg);
            }
            noResultsMsg.style.display = 'block';
        } else if (noResultsMsg) {
            noResultsMsg.style.display = 'none';
        }
    });
});

// Initialize all functionalities
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupAuthForms();
    setupPreferredShoes();
    setupCart();
    setupOrderHistory();
});

// Admin button visibility
document.addEventListener('DOMContentLoaded', function() {
    const adminButton = document.querySelector('.admin-button');
    if (adminButton) {
        const userDataElement = document.getElementById('userData');
        if (userDataElement) {
            const userData = JSON.parse(userDataElement.textContent);
            if (!userData.isAdmin) {
                adminButton.style.display = 'none';
            }
        } else {
            adminButton.style.display = 'none';
        }
    }
});
