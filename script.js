document.addEventListener("DOMContentLoaded", () => {
    const itemsContainer = document.getElementById("items");
    const cartItemsContainer = document.getElementById("cart-items");
    const totalSpan = document.getElementById("total");
    const checkoutBtn = document.getElementById("checkoutBtn");
    const checkoutSection = document.getElementById("checkout");
    const msgSection = document.getElementById("msg");
    const nameInput = document.getElementById("name");
    const phoneInput = document.getElementById("phone");
    const addressInput = document.getElementById("address");
    const checkoutTotalSpan = document.getElementById("checkout-total");
    const placeOrderBtn = document.getElementById("placeOrderBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    let cart = [];

    const menuItems = [
        { id: 1, name: "RICE", price: 148, image:  "images/rice.jpg" },
        { id: 2, name: "ONION", price: 60, image: "images/onion.jpg" },
        { id: 3, name: "BREAD", price: 39, image: "images/bread.jpg" },
        { id: 4, name: "CURD", price: 64, image: "images/curd.jpg" },
        { id: 5, name: "MILK", price: 59, image: "images/milk.jpg" },
        { id: 6, name: "KREMOM", price: 54, image: "images/coco.jpg" },
        { id: 7, name: "CIGRARETTE MINT", price: 237, image: "images/mint.jpg" },
        { id: 9, name: "COLA", price: 128, image: "images/cola.jpg" },
        { id: 10, name: "EGG", price: 100, image: "images/egg.jpg" },
    ];

    function renderMenuItems() {
        itemsContainer.innerHTML = menuItems.map(item => `
            <div class="item">
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>₽${item.price}</p>
                <button data-id="${item.id}">Add to Cart</button>
            </div>
        `).join("");

        itemsContainer.querySelectorAll(".item button").forEach(button => {
            button.addEventListener("click", (e) => {
                const id = parseInt(e.target.dataset.id);
                addToCart(id);
            });
        });
    }

    function addToCart(id) {
        const item = menuItems.find(i => i.id === id);
        if (item) {
            const existingItem = cart.find(cartItem => cartItem.id === id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ ...item, quantity: 1 });
            }
            renderCart();
        }
    }

    function renderCart() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = "Cart is empty";
            totalSpan.textContent = "0";
            checkoutBtn.disabled = true;
            return;
        }

        cartItemsContainer.innerHTML = cart.map(item => `
            <div>
                ${item.name} x ${item.quantity} - ₽${item.price * item.quantity}
            </div>
        `).join("");

        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        totalSpan.textContent = total;
        checkoutBtn.disabled = false;
    }

    checkoutBtn.addEventListener("click", () => {
        document.getElementById("menu").classList.add("hidden");
        document.getElementById("cart").classList.add("hidden");
        checkoutSection.classList.remove("hidden");
        checkoutTotalSpan.textContent = `₽${totalSpan.textContent}`;
    });

    placeOrderBtn.addEventListener("click", () => {
        const orderDetails = {
            name: nameInput.value,
            phone: phoneInput.value,
            address: addressInput.value,
            items: cart,
            total: parseFloat(checkoutTotalSpan.textContent.replace("₽", ""))
        };

        console.log("Order Placed:", orderDetails);

        // 🔥 Backend ko order bhejne ka code (mail trigger ke liye)
        fetch('/place-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderDetails)
        })
        .then(res => res.json())
        .then(data => {
            console.log("Server Response:", data);
            msgSection.textContent = "Order placed successfully! Confirmation mail sent.";
            msgSection.classList.remove("hidden");
        })
        .catch(err => {
            console.error("Error placing order:", err);
            msgSection.textContent = "Something went wrong while placing your order.";
            msgSection.classList.remove("hidden");
        });

        checkoutSection.classList.add("hidden");
        cart = [];
        renderCart();
        renderMenuItems();
    });

    cancelBtn.addEventListener("click", () => {
        msgSection.textContent = "Order cancelled.";
        msgSection.classList.remove("hidden");
        checkoutSection.classList.add("hidden");
        document.getElementById("menu").classList.remove("hidden");
        document.getElementById("cart").classList.remove("hidden");
        cart = [];
        renderCart();
    });

    renderMenuItems();
    renderCart();
});
