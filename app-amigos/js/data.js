/* =========================================================
   DATOS DE LA APP
   Todo lo que hay que personalizar está aquí:
   nombre, locales, menús, salones y horas de entrega.
   Los precios son aproximados (MXN) y se ajustan aquí.
   ========================================================= */

// Cambia aquí el nombre de la app (se usa en el logo, el título y los textos).
const APP = {
  nombre: "Recreo",
  lema: "Tu comida, hasta tu salón",
  dominioCorreo: "universidad.edu.mx",
  envio: 12, // costo de envío en MXN
};

const CATEGORIAS = [
  { id: "todo", nombre: "Todo" },
  { id: "cafe", nombre: "Café" },
  { id: "pokes", nombre: "Pokes" },
  { id: "saludable", nombre: "Saludable" },
  { id: "sandwiches", nombre: "Baguettes y sándwiches" },
  { id: "reposteria", nombre: "Repostería" },
];

// "icono" usa los nombres de js/iconos.js. "color" es el color del local.
const LOCALES = [
  {
    id: "sinforosa",
    nombre: "Sinforosa",
    tipo: "Café, baguettes, ensaladas y repostería",
    icono: "croissant",
    color: "#B85C38",
    tiempo: "15-20 min",
    rating: 4.8,
    ubicacion: "Cafetería central",
    horario: "7:00 - 18:00",
    abierto: true,
    categorias: ["cafe", "saludable", "sandwiches", "reposteria"],
  },
  {
    id: "luka",
    nombre: "Luka Poke",
    tipo: "Pokes y bowls",
    icono: "salad",
    color: "#1F8A80",
    tiempo: "15-25 min",
    rating: 4.7,
    ubicacion: "Zona de comida",
    horario: "11:00 - 20:00",
    abierto: true,
    categorias: ["pokes", "saludable"],
  },
  {
    id: "starbucks",
    nombre: "Starbucks",
    tipo: "Café, Frappuccino y alimentos",
    icono: "coffee",
    color: "#0B6B48",
    tiempo: "10-15 min",
    rating: 4.6,
    ubicacion: "Junto a biblioteca",
    horario: "7:00 - 21:00",
    abierto: true,
    categorias: ["cafe", "sandwiches", "reposteria"],
  },
  {
    id: "timhortons",
    nombre: "Tim Hortons",
    tipo: "Café, donas y Timbits",
    icono: "donut",
    color: "#B5121B",
    tiempo: "10-15 min",
    rating: 4.5,
    ubicacion: "Explanada",
    horario: "7:00 - 20:00",
    abierto: true,
    categorias: ["cafe", "reposteria", "sandwiches"],
  },
];

const PRODUCTOS = {
  sinforosa: [
    { id: "bag-pavo", seccion: "Baguettes", nombre: "Baguette de pavo y panela", desc: "Pechuga de pavo, panela, aguacate, jitomate y aderezo de chipotle.", precio: 115, icono: "sandwich", popular: true },
    { id: "bag-caprese", seccion: "Baguettes", nombre: "Baguette caprese", desc: "Mozzarella fresca, jitomate, albahaca y pesto.", precio: 110, icono: "sandwich" },
    { id: "bag-pollo", seccion: "Baguettes", nombre: "Baguette de pollo al pesto", desc: "Pollo a la plancha, pesto, espinaca y queso manchego.", precio: 125, icono: "sandwich" },
    { id: "cesar", seccion: "Ensaladas", nombre: "Ensalada César con pollo", desc: "Lechuga romana, pollo, crutones, parmesano y aderezo César.", precio: 125, icono: "salad", popular: true },
    { id: "frutos", seccion: "Ensaladas", nombre: "Ensalada de frutos rojos", desc: "Mix de hojas, fresa, arándano, queso de cabra, nuez y vinagreta.", precio: 135, icono: "salad" },
    { id: "americano", seccion: "Café", nombre: "Americano", desc: "12 oz. Café de especialidad de la casa.", precio: 45, icono: "coffee" },
    { id: "latte", seccion: "Café", nombre: "Latte", desc: "12 oz. Leche entera, deslactosada o de almendra.", precio: 58, icono: "coffee", popular: true },
    { id: "capuchino", seccion: "Café", nombre: "Capuchino", desc: "12 oz con espuma de leche y canela.", precio: 58, icono: "coffee" },
    { id: "chai", seccion: "Café", nombre: "Chai latte", desc: "Caliente o frío. Especiado y cremoso.", precio: 65, icono: "coffee" },
    { id: "coldbrew", seccion: "Café", nombre: "Cold brew", desc: "16 oz, infusionado en frío por 18 horas.", precio: 62, icono: "cup-soda" },
    { id: "croissant", seccion: "Repostería", nombre: "Croissant de mantequilla", desc: "Horneado cada mañana.", precio: 42, icono: "croissant" },
    { id: "rol", seccion: "Repostería", nombre: "Rol de canela", desc: "Con glaseado de queso crema.", precio: 52, icono: "croissant" },
    { id: "galleta", seccion: "Repostería", nombre: "Galleta de chispas de chocolate", desc: "Grande, suave por dentro.", precio: 35, icono: "cookie" },
    { id: "pay", seccion: "Repostería", nombre: "Pay de queso", desc: "Rebanada con mermelada de frutos rojos.", precio: 68, icono: "cake-slice" },
  ],
  luka: [
    { id: "salmon", seccion: "Pokes de la casa", nombre: "Poke de salmón clásico", desc: "Arroz de sushi, salmón, aguacate, pepino, edamame, mango y ponzu.", precio: 199, icono: "fish", popular: true },
    { id: "spicy", seccion: "Pokes de la casa", nombre: "Spicy tuna", desc: "Atún en salsa spicy, arroz, pepino, wakame, cebollín y ajonjolí.", precio: 209, icono: "fish", popular: true },
    { id: "teriyaki", seccion: "Pokes de la casa", nombre: "Poke de pollo teriyaki", desc: "Pollo teriyaki, arroz, elote, zanahoria, aguacate y cebolla crujiente.", precio: 175, icono: "salad" },
    { id: "camaron", seccion: "Pokes de la casa", nombre: "Poke de camarón", desc: "Camarón, arroz, mango, pepino, col morada y mayo sriracha.", precio: 195, icono: "salad" },
    { id: "veggie", seccion: "Pokes de la casa", nombre: "Poke veggie", desc: "Tofu, quinoa, aguacate, edamame, zanahoria y aderezo de ajonjolí.", precio: 165, icono: "leaf" },
    { id: "arma", seccion: "Arma tu poke", nombre: "Arma tu poke", desc: "Elige base, 1 proteína, 4 toppings, salsa y crunch. Dinos tu combinación en las instrucciones.", precio: 179, icono: "salad" },
    { id: "edamames", seccion: "Extras", nombre: "Edamames", desc: "Con sal de mar y limón.", precio: 55, icono: "leaf" },
    { id: "proteina", seccion: "Extras", nombre: "Proteína extra", desc: "Salmón, atún, pollo, camarón o tofu.", precio: 45, icono: "plus" },
    { id: "te", seccion: "Bebidas", nombre: "Té helado de la casa", desc: "500 ml, jazmín con maracuyá.", precio: 40, icono: "glass-water" },
    { id: "mineral", seccion: "Bebidas", nombre: "Agua mineral", desc: "355 ml.", precio: 30, icono: "glass-water" },
  ],
  starbucks: [
    { id: "cafedia", seccion: "Calientes", nombre: "Café del día", desc: "Tamaño alto (12 oz).", precio: 42, icono: "coffee" },
    { id: "americano", seccion: "Calientes", nombre: "Americano", desc: "Tamaño alto. Espresso con agua caliente.", precio: 52, icono: "coffee" },
    { id: "latte", seccion: "Calientes", nombre: "Latte", desc: "Tamaño alto. Espresso con leche vaporizada.", precio: 62, icono: "coffee", popular: true },
    { id: "cappuccino", seccion: "Calientes", nombre: "Cappuccino", desc: "Tamaño alto, con espuma abundante.", precio: 62, icono: "coffee" },
    { id: "macchiato", seccion: "Calientes", nombre: "Caramel Macchiato", desc: "Vainilla, leche, espresso y caramelo.", precio: 76, icono: "coffee" },
    { id: "chai", seccion: "Calientes", nombre: "Chai Tea Latte", desc: "Té negro con especias y leche.", precio: 70, icono: "coffee" },
    { id: "matcha", seccion: "Calientes", nombre: "Matcha Latte", desc: "Té verde matcha con leche.", precio: 74, icono: "leaf" },
    { id: "caramelfrap", seccion: "Frías", nombre: "Caramel Frappuccino", desc: "Tamaño alto, con crema batida y caramelo.", precio: 84, icono: "cup-soda", popular: true },
    { id: "mochafrap", seccion: "Frías", nombre: "Mocha Frappuccino", desc: "Tamaño alto, café con chocolate y crema batida.", precio: 84, icono: "cup-soda" },
    { id: "javachip", seccion: "Frías", nombre: "Java Chip Frappuccino", desc: "Tamaño alto, con chispas de chocolate.", precio: 89, icono: "cup-soda" },
    { id: "shaken", seccion: "Frías", nombre: "Iced Shaken Espresso", desc: "Espresso agitado con hielo y leche de avena.", precio: 72, icono: "cup-soda" },
    { id: "coldbrew", seccion: "Frías", nombre: "Cold Brew", desc: "Tamaño alto, infusionado en frío.", precio: 66, icono: "cup-soda" },
    { id: "croissant", seccion: "Alimentos", nombre: "Croissant de pavo y queso", desc: "Caliente, con pechuga de pavo y queso manchego.", precio: 79, icono: "croissant" },
    { id: "panela", seccion: "Alimentos", nombre: "Sándwich de pavo y panela", desc: "Pan multigrano, pavo, panela y espinaca.", precio: 89, icono: "sandwich" },
    { id: "baguette", seccion: "Alimentos", nombre: "Baguette clásica", desc: "Jamón, queso y aderezo de mostaza.", precio: 92, icono: "sandwich" },
    { id: "muffin", seccion: "Alimentos", nombre: "Muffin de moras", desc: "Con moras azules.", precio: 55, icono: "cake-slice" },
    { id: "brownie", seccion: "Alimentos", nombre: "Brownie", desc: "De chocolate con nuez.", precio: 52, icono: "cookie" },
  ],
  timhortons: [
    { id: "original", seccion: "Café", nombre: "Café Original Blend", desc: "Mediano (14 oz). El café clásico de la casa.", precio: 35, icono: "coffee", popular: true },
    { id: "latte", seccion: "Café", nombre: "Latte", desc: "Mediano. Espresso con leche vaporizada.", precio: 52, icono: "coffee" },
    { id: "vanilla", seccion: "Café", nombre: "French Vanilla", desc: "Mediano. Bebida cremosa sabor vainilla.", precio: 50, icono: "coffee" },
    { id: "matcha", seccion: "Café", nombre: "Matcha Latte", desc: "Mediano, caliente o frío.", precio: 62, icono: "leaf" },
    { id: "icedcapp", seccion: "Fríos", nombre: "Iced Capp", desc: "Mediano. Café frappé cremoso.", precio: 62, icono: "cup-soda", popular: true },
    { id: "icedlatte", seccion: "Fríos", nombre: "Iced Latte", desc: "Mediano, con hielo.", precio: 56, icono: "cup-soda" },
    { id: "glaseada", seccion: "Donas y Timbits", nombre: "Dona glaseada", desc: "La clásica, con glaseado de azúcar.", precio: 24, icono: "donut" },
    { id: "boston", seccion: "Donas y Timbits", nombre: "Dona Boston Cream", desc: "Rellena de crema pastelera con cobertura de chocolate.", precio: 28, icono: "donut" },
    { id: "maple", seccion: "Donas y Timbits", nombre: "Dona Maple Dip", desc: "Con cobertura de maple.", precio: 28, icono: "donut" },
    { id: "timbits", seccion: "Donas y Timbits", nombre: "Timbits (10 piezas)", desc: "Mini donas surtidas.", precio: 55, icono: "donut", popular: true },
    { id: "combo", seccion: "Donas y Timbits", nombre: "Combo café + dona", desc: "Café Original Blend mediano y dona a elegir.", precio: 65, icono: "coffee" },
    { id: "croissant", seccion: "Para comer", nombre: "Croissant de jamón, huevo y queso", desc: "Recién hecho, servido caliente.", precio: 59, icono: "croissant" },
    { id: "grilled", seccion: "Para comer", nombre: "Grilled cheese", desc: "Pan tostado con queso derretido.", precio: 72, icono: "sandwich" },
    { id: "muffin", seccion: "Para comer", nombre: "Muffin de mora azul", desc: "Esponjoso, con moras azules.", precio: 42, icono: "cake-slice" },
  ],
};

// Edificios del campus y horas en las que se puede programar una entrega.
const EDIFICIOS = ["A", "B", "C", "D", "Biblioteca"];
const HORAS_ENTREGA = ["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];
