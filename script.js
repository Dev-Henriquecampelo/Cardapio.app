const menu = document.getElementById("menu")
const cartBtn= document.getElementById("cart-btn")
const cartModal= document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn= document.getElementById("checkout-btn")
const closeModalbtn= document.getElementById("close-modal-btn")
const cartCounter= document.getElementById("cart-count")
const addressInput= document.getElementById("address")
const addressWar= document.getElementById("address-warn")


let cart = [];

// ABRIR O MODAL DO CARRINHO
cartBtn.addEventListener("click", function() {
    updateCartModal(); 
    cartModal.style.display = "flex"
    
})

// FECHAR O MODAL QUANDO CLIAR FORA 
cartModal.addEventListener("click", function(event){ 
    if(event.target === cartModal){
        cartModal.style.display = "none" 
    }

})


closeModalbtn.addEventListener("click", function (){
    cartModal.style.display = "none"
})


menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")
    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
         addTocart(name, price)  
    }

})



// FUNÇAO PARA ADICIONAR NO CARRINHO

    function addTocart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        // se o item ja existe , aumenta apenas a quantidade +1
        existingItem.quantity += 1;
 } else{
        cart.push({

        name,
        price,
        quantity: 1,
    })
   
}


    updateCartModal();

}   

// // atualiza o carrinho

function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;



    cart.forEach(item => {
        const cartItemtElement = document.createElement("div")
        cartItemtElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemtElement.innerHTML = `
            <div class="flex items-center justify-between">
             <div>
                <p class="font-medium">${item.name}</P>
                <p>Qtd: ${item.quantity}</P>
                <p class="font-bold mt-2">R$ ${item.price.toFixed(2)}</P>
             </div>

             
             <button class="remove-from-cart-btn" data-name="${item.name}">
             Remover
             </button>
             </div>

            </div>       
        `
        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemtElement)

    })


    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

// funcao para remover o item do carrinho
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

    removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);
    
    if(index !== -1){
        const item = cart[index];
        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

        if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWar.classList.add("hidden")
        }

})

// finalizar pedido
checkoutBtn.addEventListener("click", function(){
    
    const isOpen = checkRestauranteOpen();
    if(!isOpen){
        
        Toastify({text: "Ops o restaurante está fechado!",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#ef4444",
        },
    }).showToast();

        return;
    }




    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWar.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
    }

// enviar pedido para api do whatszapp

const cartItems = cart.map((item)=> {
    return (
        ` ${item.name} Quantida: (${item.quantity}) preço: R$${item.price} |`
    )

    console.log(cartItems)

}).join("")

const message = encodeURIComponent(cartItems)
const phone = "839936185746"
window.open(`https://wa.me/${phone}?text=${message} Endereço:${addressInput.value}`, "_blank")

cart = [];
updateCartModal();

})

// ver a hora e manipular o car horario
function checkRestauranteOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 23
    ; 
    // restaurante esta aberto
}

const spamItem = document.getElementById("date-span")
const isOpen = checkRestauranteOpen();

if(isOpen){
    spamItem.classList.remove("bg-red-500")
    spamItem.classList.add("bg-green-600")    
}else{
    spamItem.classList.remove("bg-green-600")
    spamItem.classList.add("bg-red-500")
}


