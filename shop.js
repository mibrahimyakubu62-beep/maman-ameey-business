let cart = [];

document.addEventListener("DOMContentLoaded", () => {
    const addButtons = document.querySelectorAll(".add-btn");
    const viewButtons = document.querySelectorAll(".view-btn");
    const cartList = document.getElementById("cart-list");
    const cartTotal = document.getElementById("cart-total");
    const sendWhatsApp = document.getElementById("sendWhatsApp");
    const themeToggle = document.getElementById("themeToggle");

    // 🌙 Theme Toggle (with memory)
    if (themeToggle) {
        // Load saved theme
        if (localStorage.getItem("theme") === "dark") {
            document.body.classList.add("dark-mode");
            themeToggle.textContent = "☀️ Light";
        }

        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            if (document.body.classList.contains("dark-mode")) {
                themeToggle.textContent = "☀️ Light";
                localStorage.setItem("theme", "dark");
            } else {
                themeToggle.textContent = "🌙 Dark";
                localStorage.setItem("theme", "light");
            }
        });
    }

    // 🔍 Product View Modal
    const modal = new bootstrap.Modal(document.getElementById("productModal"));
    const modalTitle = document.getElementById("modalTitle");
    const modalImg = document.getElementById("modalImg");
    const modalDesc = document.getElementById("modalDesc");
    const modalPrice = document.getElementById("modalPrice");

    viewButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            modalTitle.textContent = btn.dataset.name;
            modalImg.src = btn.dataset.img;
            modalDesc.textContent = btn.dataset.desc;
            modalPrice.textContent = btn.dataset.price;
            modal.show();
        });
    });

    // ➕ Add to Cart
    addButtons.forEach(btn => {
        btn.addEventListener("click", e => {
            const card = e.target.closest(".card");
            const name = card.querySelector(".card-title").innerText;
            const price = parseInt(card.querySelector(".price").innerText.replace(/₦|,/g, ''));
            const qty = parseInt(card.querySelector(".qty").value);

            const existing = cart.find(i => i.name === name);
            if (existing) existing.qty += qty;
            else cart.push({ name, price, qty });

            updateCart();

            // ✅ Small popup confirmation
            const alertBox = document.createElement("div");
            alertBox.className = "added-alert";
            alertBox.textContent = `${name} added to cart ✅`;
            document.body.appendChild(alertBox);
            setTimeout(() => alertBox.remove(), 1500);
        });
    });

    // 🛒 Update Cart Display
    function updateCart() {
        cartList.innerHTML = "";
        let total = 0;

        cart.forEach(item => {
            const subtotal = item.price * item.qty;
            total += subtotal;

            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            li.innerHTML = `${item.name} <span>₦${subtotal.toLocaleString()}</span>`;
            cartList.appendChild(li);
        });

        cartTotal.textContent = `Total: ₦${total.toLocaleString()}`;
    }

    // 💬 Send Order via WhatsApp
    sendWhatsApp?.addEventListener("click", () => {
        const name = document.getElementById("customerName").value.trim();
        const phone = document.getElementById("customerPhone").value.trim();
        const address = document.getElementById("customerAddress").value.trim();

        if (!name || !phone || !address) {
            alert("Please fill in all customer details.");
            return;
        }

        if (cart.length === 0) {
            alert("Please add items to your cart first!");
            return;
        }

        let total = 0;
        let message = `🛍️ New Order from ${name}\n📞 ${phone}\n🏠 ${address}\n\nItems:\n`;

        cart.forEach(item => {
            const subtotal = item.price * item.qty;
            total += subtotal;
            message += `• ${item.name} × ${item.qty} = ₦${subtotal.toLocaleString()}\n`;
        });

        message += `\n💰 Total: ₦${total.toLocaleString()}\n\nPayment Info:\nOpay\nAccount: 7067079028\nName: Mohammed Maryam Ibrahim`;

        const whatsappNumber = "2347067079028";
        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    });
});
