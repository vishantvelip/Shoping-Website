document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const sidebar = document.getElementById("sidebar");
  const openSidebar = document.getElementById("openSidebar");
  const closeSidebar = document.getElementById("closeSidebar");
  const cartModal = document.getElementById("cartModal");
  const wishlistModal = document.getElementById("wishlistModal");
  const orderModal = document.getElementById("orderModal");
  const signupModal = document.getElementById("signupModal");
  const loginModal = document.getElementById("loginModal");
  const closeCart = document.getElementById("closeCart");
  const closeWishlist = document.getElementById("closeWishlist");
  const closeOrder = document.getElementById("closeOrder");
  const closeSignup = document.getElementById("closeSignup");
  const closeLogin = document.getElementById("closeLogin");
  const productContainer = document.getElementById("productContainer");
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");
  const buyBtn = document.getElementById("buyBtn");
  const viewModal = document.getElementById("viewModal");
  const closeView = document.getElementById("closeView");
  const addToCartBtn = document.getElementById("addToCartBtn");
  const addToWishlistBtn = document.getElementById("addToWishlistBtn");
  const viewQty = document.getElementById("viewQty");
  const submitReview = document.getElementById("submitReview");
  const reviewsList = document.getElementById("reviewsList");

  // App State
  let cart = [];
  let wishlist = [];
  let orders = [];
  let currentUser = null;
  const allProducts = [
    {
      id: 1,
      name: "Leather Bag",
      description: "High-quality leather bag with multiple compartments.",
      image: "https://via.placeholder.com/400x300?text=Leather+Bag",
      price: 300,
      rating: 4.5,
      reviews: [
        { text: "Great quality!", user: "user1" },
        { text: "Love this bag!", user: "user2" }
      ]
    },
    {
      id: 2,
      name: "Casual Backpack",
      description: "Durable and stylish backpack for everyday use.",
      image: "https://via.placeholder.com/400x300?text=Casual+Backpack",
      price: 250,
      rating: 4.0,
      reviews: [{ text: "Perfect for school!", user: "user3" }]
    },
    {
      id: 3,
      name: "Travel Duffel",
      description: "Spacious and lightweight travel duffel bag.",
      image: "https://via.placeholder.com/400x300?text=Travel+Duffel",
      price: 400,
      rating: 4.7,
      reviews: [
        { text: "Holds everything!", user: "user4" },
        { text: "Great for trips!", user: "user5" }
      ]
    },
    {
      id: 4,
      name: "Business Briefcase",
      description: "Elegant and premium quality business briefcase.",
      image: "https://via.placeholder.com/400x300?text=Business+Briefcase",
      price: 500,
      rating: 4.8,
      reviews: [
        { text: "Professional look!", user: "user6" },
        { text: "Perfect for meetings", user: "user7" }
      ]
    },
    {
      id: 5,
      name: "Weekender Bag",
      description: "Perfect for weekend trips and short getaways.",
      image: "https://via.placeholder.com/400x300?text=Weekender+Bag",
      price: 350,
      rating: 4.2,
      reviews: [{ text: "Great size!", user: "user8" }]
    },
    {
      id: 6,
      name: "Shopping Tote",
      description: "Stylish and spacious tote for everyday shopping.",
      image: "https://via.placeholder.com/400x300?text=Shopping+Tote",
      price: 200,
      rating: 4.0,
      reviews: [
        { text: "Holds everything!", user: "user9" },
        { text: "Love the design!", user: "user10" }
      ]
    }
  ];

  // Event Listeners
  if (openSidebar) openSidebar.addEventListener("click", () => sidebar.classList.add("active"));
  if (closeSidebar) closeSidebar.addEventListener("click", () => sidebar.classList.remove("active"));
  if (closeCart) closeCart.addEventListener("click", () => cartModal.classList.remove("active"));
  if (closeWishlist) closeWishlist.addEventListener("click", () => wishlistModal.classList.remove("active"));
  if (closeOrder) closeOrder.addEventListener("click", () => orderModal.classList.remove("active"));
  if (closeSignup) closeSignup.addEventListener("click", () => signupModal.classList.remove("active"));
  if (closeLogin) closeLogin.addEventListener("click", () => loginModal.classList.remove("active"));
  if (closeView) closeView.addEventListener("click", () => viewModal.classList.remove("active"));

  document.querySelectorAll(".close-modal").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.closest(".modal")) btn.closest(".modal").classList.remove("active");
    });
  });

  // Product Rendering
  function renderProducts(products) {
    if (!productContainer) return;

    productContainer.innerHTML = "";
    products.forEach(product => {
      const productElement = document.createElement("li");
      productElement.className = "product";
      productElement.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <h1>${product.name}</h1>
        <p>${product.description}</p>
        <h3>₹${product.price}</h3>
        <div class="product-actions">
          <input type="number" min="1" value="1" class="qty" />
          <button class="add-cart-btn">Add to Cart</button>
          <button class="wishlist-btn">${isInWishlist(product) ? "In Wishlist" : "Add to Wishlist"}</button>
        </div>
      `;
      
      const addCartBtn = productElement.querySelector(".add-cart-btn");
      const wishlistBtn = productElement.querySelector(".wishlist-btn");

      if (addCartBtn) {
        addCartBtn.addEventListener("click", () => {
          const quantity = parseInt(productElement.querySelector(".qty").value);
          addToCart(product, quantity);
        });
      }

      if (wishlistBtn) {
        wishlistBtn.addEventListener("click", () => {
          toggleWishlist(product);
          renderProducts(getFilteredProducts());
        });
      }

      productElement.addEventListener("click", (e) => {
        if (!e.target.classList.contains("add-cart-btn") && 
            !e.target.classList.contains("qty") && 
            !e.target.classList.contains("wishlist-btn")) {
          showProductDetails(product);
        }
      });
      
      productContainer.appendChild(productElement);
    });
  }

  // Product Details Modal
  function showProductDetails(product) {
    if (!viewModal) return;

    document.getElementById("viewImage").src = product.image;
    document.getElementById("viewTitle").textContent = product.name;
    document.getElementById("viewDesc").textContent = product.description;
    document.getElementById("viewPrice").textContent = `₹${product.price}`;
    viewQty.value = 1;
    
    // Render reviews
    reviewsList.innerHTML = "";
    product.reviews.forEach(review => {
      const reviewElement = document.createElement("div");
      reviewElement.className = "review";
      reviewElement.innerHTML = `
        <p><strong>${review.user}:</strong> ${review.text}</p>
      `;
      reviewsList.appendChild(reviewElement);
    });
    
    if (addToCartBtn) {
      addToCartBtn.onclick = () => {
        addToCart(product, parseInt(viewQty.value));
        if (viewModal) viewModal.classList.remove("active");
      };
    }
    
    if (addToWishlistBtn) {
      addToWishlistBtn.onclick = () => {
        toggleWishlist(product);
        if (viewModal) viewModal.classList.remove("active");
        renderProducts(getFilteredProducts());
      };
    }
    
    if (submitReview) {
      submitReview.onclick = () => {
        const reviewText = document.getElementById("reviewText").value;
        if (reviewText && currentUser) {
          product.reviews.push({ text: reviewText, user: currentUser.name });
          showProductDetails(product);
        }
      };
    }
    
    if (viewModal) viewModal.classList.add("active");
  }

  // Cart Functionality
  function addToCart(product, quantity) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    renderCart();
  }

  function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
  }

  function updateCartItemQuantity(index, quantity) {
    if (quantity > 0) {
      cart[index].quantity = quantity;
    } else {
      removeFromCart(index);
    }
    renderCart();
  }

  function renderCart() {
    const cartList = document.getElementById("cartList");
    const cartTotal = document.getElementById("cartTotal");
    
    if (!cartList || !cartTotal) return;
    
    cartList.innerHTML = "";
    let total = 0;
    
    cart.forEach((product, index) => {
      const cartItem = document.createElement("div");
      cartItem.className = "product";
      cartItem.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>₹${product.price} × ${product.quantity}</p>
        </div>
        <div class="product-actions">
          <input type="number" min="1" value="${product.quantity}" class="qty" />
          <button class="remove-btn">Remove</button>
        </div>
      `;
      
      const qtyInput = cartItem.querySelector(".qty");
      const removeBtn = cartItem.querySelector(".remove-btn");
      
      if (qtyInput) {
        qtyInput.addEventListener("change", (e) => {
          updateCartItemQuantity(index, parseInt(e.target.value));
        });
      }
      
      if (removeBtn) {
        removeBtn.addEventListener("click", () => {
          removeFromCart(index);
        });
      }
      
      cartList.appendChild(cartItem);
      
      total += product.price * product.quantity;
    });
    
    cartTotal.textContent = `₹${total}`;
  }

  // Wishlist Functionality
  function toggleWishlist(product) {
    const index = wishlist.findIndex(item => item.id === product.id);
    if (index === -1) {
      wishlist.push(product);
    } else {
      wishlist.splice(index, 1);
    }
  }

  function isInWishlist(product) {
    return wishlist.some(item => item.id === product.id);
  }

  function renderWishlist() {
    const wishlistList = document.getElementById("wishlistList");
    if (!wishlistList) return;
    
    wishlistList.innerHTML = "";
    
    wishlist.forEach(product => {
      const wishlistItem = document.createElement("li");
      wishlistItem.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>₹${product.price}</p>
        </div>
        <button class="remove-btn">Remove</button>
      `;
      
      const removeBtn = wishlistItem.querySelector(".remove-btn");
      if (removeBtn) {
        removeBtn.addEventListener("click", () => {
          toggleWishlist(product);
          renderWishlist();
        });
      }
      
      wishlistList.appendChild(wishlistItem);
    });
  }

  // Order Functionality
  function placeOrder() {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }
    
    if (!currentUser) {
      alert("Please login to place an order");
      const loginModal = document.getElementById("loginModal");
      if (loginModal) loginModal.classList.add("active");
      return;
    }
    
    const order = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      products: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    };
    
    orders.push(order);
    cart = [];
    renderCart();
    alert("Order placed successfully!");
  }

  function renderOrders() {
    const orderList = document.getElementById("orderList");
    if (!orderList) return;
    
    orderList.innerHTML = "";
    
    orders.forEach(order => {
      const orderElement = document.createElement("div");
      orderElement.className = "order-item";
      orderElement.innerHTML = `
        <div class="order-header">
          <h3>Order #${order.id}</h3>
          <p>Date: ${order.date}</p>
        </div>
        <div class="order-products">
          ${order.products.map(product => `
            <div class="order-product">
              <img src="https://via.placeholder.com/50x50" alt="${product.name}" />
              <div>
                <p>${product.name}</p>
                <p>₹${product.price} × ${product.quantity}</p>
              </div>
            </div>
          `).join("")}
        </div>
        <div class="order-total">
          <p>Total: ₹${order.total}</p>
        </div>
      `;
      orderList.appendChild(orderElement);
    });
  }

  // Authentication
  function signup(e) {
    if (e) e.preventDefault();
    // Handle signup logic here
    alert("Signup successful!");
    const signupModal = document.getElementById("signupModal");
    if (signupModal) signupModal.classList.remove("active");
  }

  function login(e) {
    if (e) e.preventDefault();
    // Handle login logic here
    currentUser = { name: "John Doe" };
    alert("Login successful!");
    const loginModal = document.getElementById("loginModal");
    if (loginModal) loginModal.classList.remove("active");
  }

  // Search and Filter
  function getFilteredProducts() {
    const query = searchInput.value.toLowerCase();
    const sort = sortSelect.value;
    
    let filteredProducts = allProducts.filter(product => 
      product.name.toLowerCase().includes(query) || 
      product.description.toLowerCase().includes(query)
    );
    
    if (sort === "price-low") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sort === "name") {
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return filteredProducts;
  }

  // Event Handlers
  if (searchInput) searchInput.addEventListener("input", () => renderProducts(getFilteredProducts()));
  if (sortSelect) sortSelect.addEventListener("change", () => renderProducts(getFilteredProducts()));
  if (buyBtn) buyBtn.addEventListener("click", placeOrder);
  
  const openCartBtn = document.getElementById("openCart");
  if (openCartBtn) openCartBtn.addEventListener("click", () => {
    if (cartModal) cartModal.classList.add("active");
  });
  
  const openWishlistBtn = document.getElementById("openWishlist");
  if (openWishlistBtn) openWishlistBtn.addEventListener("click", () => {
    renderWishlist();
    if (wishlistModal) wishlistModal.classList.add("active");
  });
  
  const openOrderBtn = document.getElementById("openOrder");
  if (openOrderBtn) openOrderBtn.addEventListener("click", () => {
    renderOrders();
    if (orderModal) orderModal.classList.add("active");
  });
  
  const signupBtn = document.getElementById("signupBtn");
  if (signupBtn) signupBtn.addEventListener("click", () => {
    if (signupModal) signupModal.classList.add("active");
  });
  
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) loginBtn.addEventListener("click", () => {
    if (loginModal) loginModal.classList.add("active");
  });
  
  const signupForm = document.getElementById("signupForm");
  if (signupForm) signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    signup(e);
  });
  
  const loginForm = document.getElementById("loginForm");
  if (loginForm) loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    login(e);
  });

  // Initial Render
  renderProducts(allProducts);
});
