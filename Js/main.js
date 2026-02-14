/* ===== MENU DATA ===== */
const menuData = [
  {
    id:1,
    name:"Classic Burger",
    category:"main",
    price:12,
    desc:"Juicy beef burger with cheese",
    img:"Images/burger.jpg"
  },
  {
    id: 2,
    name: "Burger Taleb",
    category: "main",
    price: 14,
    desc: "Signature beef burger made with juicy grilled meat, melted cheddar cheese, fresh lettuce, tomatoes, caramelized onions, and our special Taleb sauce.",
    img: "Images/burger-taleb.jpeg"
  },
  {
    id: 3,
  name: "Chicken Taleb Burger",
  category: "main",
  price: 11,
  desc: "Crispy spicy chicken fillet with fresh vegetables, melted cheese, and our bold Taleb spicy sauce.",
  img: "Images/chicken-burger.jpeg"
  },
  {
    id: 4,
  name: "Spicy Chicken Burger",
  category: "main",
  price: 12,
  desc: "Crispy spicy chicken fillet with fresh lettuce, melted cheese, pickles, and Taleb spicy sauce in a toasted bun.",
  img: "Images/spicy-chicken-burger.jpeg"
  },
  {
    id: 5,
  name: "Chicken Shawarma",
  category: "shawarma",
  price: 9,
  desc: "Tender marinated chicken shawarma wrapped in fresh bread with garlic sauce, pickles, and crispy fries.",
  img: "Images/chicken-shawarma.jpeg"
  },
  {
    id: 6,
  name: "Beef Shawarma",
  category: "shawarma",
  price: 11,
  desc: "Slow-roasted beef shawarma served with tahini sauce, fresh vegetables, and pickles in warm bread.",
  img: "Images/beef-shawarma.jpg"
  },
  {
    id: 7,
  name: "Taleb Special Pizza",
  category: "pizza",
  desc: "Oven-baked pizza topped with rich tomato sauce, mozzarella cheese, pepperoni, fresh mushrooms, olives, and a touch of oregano.",
  img: "Images/pizza-taleb.jpeg",
  sizes:{
    small:14,
    medium:17,
    large:20,
  }
  },
  {
    id: 8,
  name: "Chicken Pizza",
  category: "pizza",
  desc: "Grilled chicken pieces with mozzarella cheese, mushrooms, olives, and creamy sauce on a crispy crust.",
  img: "Images/chicken-pizza.jpeg",
  sizes:{
    small:10,
    medium:14,
    large:17,
  }
  },
  {
    id:9,
    name:"Pizza Margherita",
    category:"pizza",
    desc:"Italian pizza with basil",
    img:"Images/pizza.jpg",
    sizes:{
    small:8,
    medium:12,
    large:15,
  }
  },
  {
    id:10,
    name:"Salad",
    category:"starters",
    price:8,
    desc:"Salad Lebanon",
    img:"Images/salad.jpg"
  },
  {
    id:11,
    name:"Chocolate Cake",
    category:"desserts",
    price:6,
    desc:"Rich dark chocolate cake",
    img:"Images/cake.jpg"
  },
  {
    id:12,
    name:"Fresh Juice",
    category:"drinks",
    price:5,
    desc:"Natural mixed fruits",
    img:"Images/juice.jpg"
  },
];

let cartCount = 0;

/* ===== RENDER MENU ===== */
function displayMenu(items){
  const container = document.getElementById("menuItems");
  container.innerHTML = "";

  items.forEach(item => {

    let sizesHTML = "";
    let priceHTML = "";

    if(item.sizes){
      sizesHTML = `
        <div class="sizes">
          <button class="active" data-size="small">S</button>
          <button data-size="medium">M</button>
          <button data-size="large">L</button>
        </div>
      `;
      priceHTML = `<div class="price">$${item.sizes.small}</div>`;
    }else{
      priceHTML = `<div class="price">$${item.price}</div>`;
    }

    container.innerHTML += `
      <div class="menu-card">
        <div class="menu-img">
          <img src="${item.img}">
        </div>
        <div class="info">
          <h3>${item.name}</h3>
          <p>${item.desc}</p>

          ${sizesHTML}
          ${priceHTML}

          <button class="btn addCart" data-id="${item.id}">
            Add to Cart
          </button>
        </div>
      </div>
    `;
  });
}

$(document).on("click",".sizes button",function(){
  const size = $(this).data("size");
  const card = $(this).closest(".menu-card");
  const id = card.find(".addCart").data("id");
  const item = menuData.find(p => p.id === id);

  card.find(".sizes button").removeClass("active");
  $(this).addClass("active");

  card.find(".price").text(`$${item.sizes[size]}`);
});
/* ===== FILTER ===== */
$(document).on("click", ".filter", function(){
  $(".filter").removeClass("active");
  $(this).addClass("active");

  const category = $(this).data("category");
  if(category === "all"){
    displayMenu(menuData);
  }else{
    const filtered = menuData.filter(item => item.category === category);
    displayMenu(filtered);
  }
});

// ===== DARK MODE WITH LOCALSTORAGE =====
const themeBtn = document.getElementById("themeToggle");

if(localStorage.getItem("theme") === "dark"){
  document.body.classList.add("dark");
  themeBtn.textContent = "☀️";
}

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if(document.body.classList.contains("dark")){
    localStorage.setItem("theme","dark");
    themeBtn.textContent = "☀️";
  }else{
    localStorage.setItem("theme","light");
    themeBtn.textContent = "🌙";
  }
});


// ================= CART DATA =================
let cart = [];

// ================= ADD TO CART =================
$(document).on("click",".addCart",function(){

  const id = $(this).data("id");
  const item = menuData.find(p => p.id === id);

  let size = null;
  let price = 0;

  if(item.sizes){
    size = $(this).closest(".menu-card")
      .find(".sizes .active")
      .data("size");

    price = Number(item.sizes[size]);
  }else{
    price = Number(item.price);
  }

  if(isNaN(price)) return;

  const existing = cart.find(i => i.id === id && i.size === size);

  if(existing){
    existing.qty++;
  }else{
    cart.push({
      id:item.id,
      name:item.name,
      img:item.img,
      size:size,
      price:price,
      qty:1
    });
  }

  updateCart();
});

// ================= UPDATE CART =================
function updateCart(){
  $("#cartItems").html("");
  let total = 0;
  let count = 0;

  cart.forEach((item,index)=>{
    total += item.price * item.qty;
    count += item.qty;

    $("#cartItems").append(`
      <div class="cart-item">
        <img src="${item.img}">
        <div class="cart-info">
          <h4>${item.name}</h4>
          <span>${item.size ? item.size : ""}</span>

          <div class="qty">
            <button onclick="changeQty(${index},-1)">−</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${index},1)">+</button>
          </div>
        </div>

        <div class="cart-price">$${item.price * item.qty}</div>
        <div class="remove" onclick="removeItem(${index})">✕</div>
      </div>
    `);
  });

  $("#totalPrice").text(total);
  $("#cartCount").text(count);
}

// ================= QTY =================
function changeQty(index,change){
  cart[index].qty += change;
  if(cart[index].qty <= 0) cart.splice(index,1);
  updateCart();
}

// ================= REMOVE =================
function removeItem(index){
  cart.splice(index,1);
  updateCart();
}

// ================= OPEN / CLOSE CART =================
$(document).on("click",".cart",()=>$("#cartModal").fadeIn());
$(document).on("click","#closeCart",()=>$("#cartModal").fadeOut());
$(document).on("click","#cartModal",()=>$("#cartModal").fadeOut());
$(document).on("click",".cart-box",e=>e.stopPropagation());

// ================= WHATSAPP ORDER =================
$(document).on("click",".whatsapp",function(){

  if(cart.length === 0){
    alert("Your cart is empty 🛒");
    return;
  }
  const now = new Date();

const date = now.toLocaleDateString("en-GB"); 
const time = now.toLocaleTimeString("en-LB", { 
  hour: '2-digit', 
  minute: '2-digit' 
});

  let message = "🛒 *New Order*%0A%0A";
  message += `📅 Date: ${date}%0A`;
  message += `⏰ Time: ${time}%0A%0A`;
  let total = 0;

  cart.forEach(item=>{
    message += `• ${item.name}`;
    if(item.size) message += ` (${item.size})`;
    message += `%0A  Qty: ${item.qty}`;
    message += `%0A  Price: $${item.price * item.qty}%0A%0A`;
    total += item.price * item.qty;
  });

  message += `💰 Total: $${total}%0A%0A`;
  message += `📍 Address:%0A`;

  const phone = "96170565771";
  window.open(`https://wa.me/${phone}?text=${message}`,"_blank");
});



// ===== BURGER MENU =====
$("#burger").on("click",function(){
  $(".nav-links").toggleClass("active");
});
$(".nav-links a").on("click",function(){
  $(".nav-links").removeClass("active");
});

document.querySelector(".contact-form").addEventListener("submit", e => {
  e.preventDefault();
  alert("Message sent successfully!");
});
$(document).on("click",".checkout",function(){

  if(cart.length === 0){
    $(".cart-items").html("<p>Your cart is empty 🛒</p>");
    return;
  }

  $(".cart-items").html("<h3 style='text-align:center'>Thank you for your order! ❤️</h3>");
  $("#totalPrice").text(0);
  $("#cartCount").text(0);
  cart = [];
});

/* ===== INIT ===== */
displayMenu(menuData);
