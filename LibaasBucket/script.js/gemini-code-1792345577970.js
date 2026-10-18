// Default Sample Inventory Data for Libaas Bucket
const defaultProducts = [
    {
        id: 1,
        title: "Royal Velvet Formal Suit",
        category: "Bridal",
        price: 18500,
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        title: "Embroidered Chiffon 3-Piece",
        category: "Festive",
        price: 12500,
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        title: "Luxury Silk Printed Pret",
        category: "Pret",
        price: 8900,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80"
    }
];

let products = JSON.parse(localStorage.getItem('lb_products')) || defaultProducts;
let cart = [];

// Initialize Page
document.addEventListener("DOMContentLoaded", () => {
    displayProducts(products);
    updateCartCount();
});

// Render Products
function displayProducts(items) {
    const container = document.getElementById("product-list");
    container.innerHTML = "";

    items.forEach(product => {
        container.innerHTML += `
            <div class="product-card">
                <img src="${product.image}" alt="${product.title}">
                <div class="product-details">
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-price">PKR ${product.price.toLocaleString()}</div>
                    <button class="btn-gold block" onclick="addToCart(${product.id})">Add To Bucket</button>
                </div>
            </div>
        `;
    });
}

// Filter Logic
function filterProducts(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if(category === 'all') {
        displayProducts(products);
    } else {
        const filtered = products.filter(p => p.category === category);
        displayProducts(filtered);
    }
}

// Cart Functions
function toggleCart() {
    document.getElementById("cart-sidebar").classList.toggle("open");
}

function addToCart(productId) {
    const item = products.find(p => p.id === productId);
    cart.push(item);
    updateCartUI();
    toggleCart();
}

function updateCartUI() {
    const cartContainer = document.getElementById("cart-items");
    const totalElem = document.getElementById("cart-total-price");
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `<p class="empty-msg">Your bucket is currently empty.</p>`;
        totalElem.innerText = "PKR 0";
    } else {
        cartContainer.innerHTML = "";
        let total = 0;
        cart.forEach((item, index) => {
            total += item.price;
            cartContainer.innerHTML += `
                <div style="display:flex; justify-size:space-between; margin-bottom:10px; border-bottom:1px solid #333; padding-bottom:5px;">
                    <div>
                        <h4>${item.title}</h4>
                        <small>PKR ${item.price.toLocaleString()}</small>
                    </div>
                    <button onclick="removeFromCart(${index})" style="background:red; color:white; border:none; padding:2px 6px; cursor:pointer;">X</button>
                </div>
            `;
        });
        totalElem.innerText = `PKR ${total.toLocaleString()}`;
    }
    updateCartCount();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function updateCartCount() {
    document.getElementById("cart-count").innerText = cart.length;
}

// Checkout & WhatsApp Integration
function openCheckoutModal() {
    if (cart.length === 0) return alert("Your cart is empty!");
    document.getElementById("checkout-modal").style.display = "flex";
}

function closeCheckoutModal() {
    document.getElementById("checkout-modal").style.display = "none";
}

function handleOrderSubmit(e) {
    e.preventDefault();
    const name = document.getElementById("cust-name").value;
    const phone = document.getElementById("cust-phone").value;
    const address = document.getElementById("cust-address").value;
    const payment = document.getElementById("cust-payment").value;

    let itemsList = cart.map(i => `- ${i.title} (PKR ${i.price.toLocaleString()})`).join("%0A");
    let total = cart.reduce((sum, item) => sum + item.price, 0);

    let message = `*NEW ORDER - LIBAAS BUCKET*%0A%0A` +
                  `*Customer Details:*%0A` +
                  `Name: ${name}%0A` +
                  `Phone: ${phone}%0A` +
                  `Address: ${address}%0A` +
                  `Payment Method: ${payment}%0A%0A` +
                  `*Ordered Items:*%0A${itemsList}%0A%0A` +
                  `*Total Amount:* PKR ${total.toLocaleString()}`;

    // WhatsApp Redirect (Replace with your actual business number)
    const businessNumber = "923001234567";
    window.open(`https://wa.me/${businessNumber}?text=${message}`, '_blank');
    
    cart = [];
    updateCartUI();
    closeCheckoutModal();
}

// Admin Modal Handlers
function openAdminModal() {
    document.getElementById("admin-modal").style.display = "flex";
}

function closeAdminModal() {
    document.getElementById("admin-modal").style.display = "none";
}

function handleAdminLogin(e) {
    e.preventDefault();
    const pin = document.getElementById("admin-pin").value;
    if (pin === "1234") {
        window.location.href = "admin.html"; // Redirects to admin panel page
    } else {
        alert("Incorrect Admin PIN Code!");
    }
}