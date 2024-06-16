document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-item');
    const extraItems = document.querySelectorAll('.extra-item');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout');
    // Remove the order form element
    const orderForm = document.getElementById('order-form');
    const deliveryOption = document.getElementById('delivery-option');
    
    let cart = [];
    let total = 0;
    let deliveryCost = 0;

    menuItems.forEach(item => {
        item.querySelector('.add-to-cart').addEventListener('click', () => {
            const itemName = item.querySelector('h3').innerText;
            const itemPrice = parseFloat(item.querySelector('span').innerText.replace('R$', '').replace(',', '.'));

            cart.push({ name: itemName, price: itemPrice, type: 'burger' });
            updateCart();
        });
    });

    extraItems.forEach(item => {
        const addButton = item.querySelector('.add-extra');
        const removeButton = item.querySelector('.remove-extra');
        const itemName = item.querySelector('h3').innerText;
        const itemPrice = parseFloat(item.querySelector('span').innerText.replace('R$', '').replace(',', '.'));

        addButton.addEventListener('click', () => {
            cart.push({ name: itemName, price: itemPrice, type: 'extra' });
            addButton.style.display = 'none';
            removeButton.style.display = 'inline-block';
            updateCart();
        });

        removeButton.addEventListener('click', () => {
            const index = cart.findIndex(cartItem => cartItem.name === itemName && cartItem.type === 'extra');
            if (index > -1) {
                cart.splice(index, 1);
                addButton.style.display = 'inline-block';
                removeButton.style.display = 'none';
                updateCart();
            }
        });
    });

    checkoutButton.addEventListener('click', () => {
        alert('Pedido finalizado com sucesso!');
        cart = [];
        total = 0;
        updateCart();
    });

    deliveryOption.addEventListener('change', () => {
        if (deliveryOption.value === 'delivery') {
            deliveryCost = 3.00;
        } else {
            deliveryCost = 0;
        }
        updateCart();
    });

    function updateCart() {
        cartItems.innerHTML = '';
        total = 0;

        cart.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `<span>${item.name}</span><span>R$${item.price.toFixed(2).replace('.', ',')}</span>
                                 <button class="remove-from-cart" data-index="${index}">Remover</button>`;
            cartItems.appendChild(itemDiv);
            total += item.price;
        });

        total += deliveryCost;
        cartTotal.innerText = total.toFixed(2).replace('.', ',');

        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                cart.splice(index, 1);
                updateCart();
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-item');
    const extraItems = document.querySelectorAll('.extra-item');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout');
    const deliveryOption = document.getElementById('delivery-option');
    const copyPixButton = document.getElementById('copy-pix');
    const locationInput = document.getElementById('location');
    const customerNameInput = document.getElementById('customer-name');

    let cart = [];
    let total = 0;
    let deliveryCost = 0;
    let deliveryMethod = '';

    customerNameInput.addEventListener('blur', () => {
        if (customerNameInput.value.trim() !== '') {
            customerNameInput.disabled = true;
        }
    });

    const addItemToCart = (itemName, itemPrice, itemType, button) => {
        cart.push({ name: itemName, price: itemPrice, type: itemType });
        button.textContent = 'Adicionado';
        button.disabled = true;
        updateCart();
    };

    const removeItemFromCart = (itemName, itemType) => {
        const index = cart.findIndex(cartItem => cartItem.name === itemName && cartItem.type === itemType);
        if (index > -1) {
            cart.splice(index, 1);
            updateCart();
        }
    };

    menuItems.forEach(item => {
        const addButton = item.querySelector('.add-to-cart');
        addButton.addEventListener('click', () => {
            const itemName = item.querySelector('h3').innerText;
            const itemPrice = parseFloat(item.querySelector('span').innerText.replace('R$', '').replace(',', '.'));
            addItemToCart(itemName, itemPrice, 'burger', addButton);
        });
    });

    extraItems.forEach(item => {
        const addButton = item.querySelector('.add-extra');
        const removeButton = item.querySelector('.remove-extra');
        const itemName = item.querySelector('h3').innerText;
        const itemPrice = parseFloat(item.querySelector('span').innerText.replace('R$', '').replace(',', '.'));

        addButton.addEventListener('click', () => {
            addItemToCart(itemName, itemPrice, 'extra', addButton);
            removeButton.style.display = 'inline-block';
        });

        removeButton.addEventListener('click', () => {
            removeItemFromCart(itemName, 'extra');
            addButton.textContent = 'Adicionar';
            addButton.disabled = false;
            removeButton.style.display = 'none';
        });
    });

    deliveryOption.addEventListener('change', () => {
        if (deliveryOption.value === 'delivery') {
            deliveryCost = 3.00;
            deliveryMethod = 'Tele Entrega';
        } else {
            deliveryCost = 0;
            deliveryMethod = 'Retirar no Local';
        }
        updateCart();
    });

    checkoutButton.addEventListener('click', () => {
        const customerName = customerNameInput.value.trim();
        if (!customerName) {
            alert('Por favor, insira seu nome.');
            return;
        }

        const whatsappNumber = '55984250248';
        const cartSummary = cart.map(item => `${item.name}: R$${item.price.toFixed(2).replace('.', ',')}`).join('\n');
        const totalAmount = total.toFixed(2).replace('.', ',');
        const deliveryFeeMessage = deliveryMethod === 'Tele Entrega' ? 'Entrega: Tele Entrega (R$3,00)' : 'Entrega: Retirar no Local (Grátis)';

        let message = `Pedido finalizado!\n\nNome do Cliente: ${customerName}\n\nItens:\n${cartSummary}\n\nTotal: R$${totalAmount}\n\n${deliveryFeeMessage}`;

        if (deliveryMethod === 'Tele Entrega') {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    const location = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
                    locationInput.value = location;

                    message += `\n\nLocalização: ${location}`;
                    sendMessageViaWhatsApp(whatsappNumber, message);
                }, error => {
                    alert('Erro ao obter localização. Por favor, insira manualmente sua localização.');
                    const location = prompt('Digite sua localização (endereço, ponto de referência, etc.):');
                    if (location) {
                        locationInput.value = location;
                        message += `\n\nLocalização: ${location}`;
                        sendMessageViaWhatsApp(whatsappNumber, message);
                    } else {
                        alert('Localização é necessária para entrega. Tente novamente.');
                    }
                });
            } else {
                alert('Geolocalização não é suportada pelo seu navegador. Por favor, insira manualmente sua localização.');
                const location = prompt('Digite sua localização (endereço, ponto de referência, etc.):');
                if (location) {
                    locationInput.value = location;
                    message += `\n\nLocalização: ${location}`;
                    sendMessageViaWhatsApp(whatsappNumber, message);
                } else {
                    alert('Localização é necessária para entrega. Tente novamente.');
                }
            }
        } else {
            sendMessageViaWhatsApp(whatsappNumber, message);
        }
    });

    const sendMessageViaWhatsApp = (whatsappNumber, message) => {
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');

        alert('Pedido finalizado com sucesso!');
        cart = [];
        total = 0;
        updateCart();
    };

    copyPixButton.addEventListener('click', () => {
        const pixKey = document.getElementById('pix-key').innerText;
        navigator.clipboard.writeText(pixKey).then(() => {
            alert('Chave PIX copiada com sucesso!');
        }).catch(err => {
            console.error('Erro ao copiar a chave PIX:', err);
        });
    });

    function updateCart() {
        cartItems.innerHTML = '';
        total = 0;

        cart.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `<span>${item.name}</span><span>R$${item.price.toFixed(2).replace('.', ',')}</span>
                                 <button class="remove-from-cart" data-index="${index}">Remover</button>`;
            cartItems.appendChild(itemDiv);
            total += item.price;
        });

        total += deliveryCost;
        cartTotal.innerText = total.toFixed(2).replace('.', ',');

        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                cart.splice(index, 1);
                updateCart();
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const logo = document.getElementById('logo');

    setInterval(() => {
        logo.classList.add('vibrate');
        setTimeout(() => {
            logo.classList.remove('vibrate');
        }, 1000); // Remove a classe 'vibrate' após 1 segundo
    }, 2000); // Adiciona a classe 'vibrate' a cada 2 segundos
});
