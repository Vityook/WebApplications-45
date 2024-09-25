// client/public/js/main.js
$(document).ready(function() {
    // Load products
    $.ajax({
      url: '/api/products',
      method: 'GET',
      success: function(products) {
        const productList = products.map(product => `
          <div class="product">
            <h3 class="product-name">${product.name}</h3>
            <p>Price: $${product.price}</p>
            <button class="add-to-cart rounded-button" data-id="${product._id}">Add to Cart</button>
          </div>
        `).join('');
        $('#app').html(productList);
      },
      error: function(err) {
        console.error('Error fetching products:', err);
      }
    });
  
    // Weather widget
    $.ajax({
      url: '/api/weather?city=New York',
      method: 'GET',
      success: function(data) {
        $('#weather-widget').html(`
          <h4>Weather in ${data.name}</h4>
          <p>Temperature: ${data.main.temp}°C</p>
          <p>Condition: ${data.weather[0].description}</p>
        `);
      },
      error: function(err) {
        console.error('Error fetching weather data:', err);
      }
    });
  
    // Google Maps
    function initMap() {
      const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.7128, lng: -74.0060 },
        zoom: 12
      });
  
      // Add markers for store locations
      const stores = [
        { lat: 40.7128, lng: -74.0060, name: 'NYC Store' },
        { lat: 40.7484, lng: -73.9857, name: 'Midtown Store' }
      ];
  
      stores.forEach(store => {
        new google.maps.Marker({
          position: { lat: store.lat, lng: store.lng },
          map: map,
          title: store.name
        });
      });
    }
  
    // Initialize map
    initMap();
  
    // Search functionality
    $('#search-form').submit(function(e) {
      e.preventDefault();
      const searchQuery = $('#search-input').val();
      $.ajax({
        url: `/api/products/search?name=${searchQuery}`,
        method: 'GET',
        success: function(products) {
          const productList = products.map(product => `
            <div class="product">
              <h3 class="product-name">${product.name}</h3>
              <p>Price: $${product.price}</p>
              <button class="add-to-cart rounded-button" data-id="${product._id}">Add to Cart</button>
            </div>
          `).join('');
          $('#app').html(productList);
        },
        error: function(err) {
          console.error('Error searching products:', err);
        }
      });
    });
  
    // Add to cart functionality
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
  
    // Update cart count
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
  
    // Initialize cart count
    updateCartCount();
  
    // D3.js chart for sales data
    function createSalesChart() {
      $.ajax({
        url: '/api/sales/monthly',
        method: 'GET',
        success: function(data) {
          const margin = {top: 20, right: 20, bottom: 30, left: 50};
          const width = 600 - margin.left - margin.right;
          const height = 400 - margin.top - margin.bottom;
  
          const svg = d3.select("#sales-chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
  
          const x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
          const y = d3.scaleLinear().rangeRound([height, 0]);
  
          x.domain(data.map(d => d.month));
          y.domain([0, d3.max(data, d => d.sales)]);
  
          svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));
  
          svg.append("g")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Sales ($)");
  
          svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.month))
            .attr("y", d => y(d.sales))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.sales));
        },
        error: function(err) {
          console.error('Error fetching sales data:', err);
        }
      });
    }
  
    // Create sales chart
    createSalesChart();
  
    // Facebook share button
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  
    // Twitter share button
    window.twttr = (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0],
        t = window.twttr || {};
      if (d.getElementById(id)) return t;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://platform.twitter.com/widgets.js";
      fjs.parentNode.insertBefore(js, fjs);
  
      t._e = [];
      t.ready = function(f) {
        t._e.push(f);
      };
  
      return t;
    }(document, "script", "twitter-wjs"));
  });