$(document).ready(function() {
    function loadCart() {
        $.ajax({
            url: '/api/cart',
            method: 'GET',
            success: function(cart) {
                if (cart.items.length === 0) {
                    $('#cart-items').html('<p>Your cart is empty.</p>');
                    $('#cart-total').text('$0.00');
                    $('#checkout-button').prop('disabled', true);
                } else {
                    const cartItemsHtml = cart.items.map(item => `
                        <div class="cart-item">
                            <h3>${item.product.name}</h3>
                            <p>Price: $${item.product.price.toFixed(2)}</p>
                            <p>Quantity: 
                                <button class="quantity-change" data-id="${item.product._id}" data-action="decrease">-</button>
                                <span class="item-quantity">${item.quantity}</span>
                                <button class="quantity-change" data-id="${item.product._id}" data-action="increase">+</button>
                            </p>
                            <p>Subtotal: $${(item.product.price * item.quantity).toFixed(2)}</p>
                            <button class="remove-item" data-id="${item.product._id}">Remove</button>
                        </div>
                    `).join('');

                    $('#cart-items').html(cartItemsHtml);
                    $('#cart-total').text(`$${cart.total.toFixed(2)}`);
                    $('#checkout-button').prop('disabled', false);
                }
            },
            error: function(err) {
                console.error('Error loading cart:', err);
            }
        });
    }

    $(document).on('click', '.quantity-change', function() {
        const productId = $(this).data('id');
        const action = $(this).data('action');
        
        $.ajax({
            url: '/api/cart/update',
            method: 'POST',
            data: JSON.stringify({ productId, action }),
            contentType: 'application/json',
            success: function(response) {
                loadCart();
            },
            error: function(err) {
                console.error('Error updating cart:', err);
            }
        });
    });

    $(document).on('click', '.remove-item', function() {
        const productId = $(this).data('id');
        
        $.ajax({
            url: '/api/cart/remove',
            method: 'POST',
            data: JSON.stringify({ productId }),
            contentType: 'application/json',
            success: function(response) {
                loadCart();
            },
            error: function(err) {
                console.error('Error removing item from cart:', err);
            }
        });
    });

    $('#checkout-button').click(function() {
        $.ajax({
            url: '/api/orders/create',
            method: 'POST',
            success: function(response) {
                alert('Order placed successfully!');
                loadCart();
            },
            error: function(err) {
                console.error('Error placing order:', err);
                alert('There was an error placing your order. Please try again.');
            }
        });
    });

    // Load cart on page load
    loadCart();
});