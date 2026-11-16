/* =========================================================
   DATOS DE LA APP
   Todo lo que hay que personalizar está aquí:
   nombre, colores de marca, locales, menús y salones.
   ========================================================= */

// Cambia aquí el nombre de la app (se usa en el logo, el título y los textos).
const APP = {
  nombre: "Recreo",
  lema: "Tu comida, hasta tu salón",
  dominioCorreo: "universidad.edu.mx",
  envio: 12, // costo de envío en MXN
};

const CATEGORIAS = [
  { id: "todo", nombre: "Todo", emoji: "🍽️" },
  { id: "desayunos", nombre: "Desayunos", emoji: "🍳" },
  { id: "comida", nombre: "Comida", emoji: "🍔" },
  { id: "saludable", nombre: "Saludable", emoji: "🥗" },
  { id: "cafe", nombre: "Café", emoji: "☕" },
  { id: "snacks", nombre: "Snacks", emoji: "🍿" },
];

const LOCALES = [
  {
    id: "cafeteria",
    nombre: "Cafetería Central",
    tipo: "Desayunos y comida corrida",
    emoji: "🍳",
    color: "#FFE8D6",
    tiempo: "15-25 min",
    rating: 4.6,
    ubicacion: "Planta baja, edificio A",
    horario: "7:00 - 17:00",
    abierto: true,
    categorias: ["desayunos", "comida"],
  },
  {
    id: "tortas",
    nombre: "Tortas Don Beto",
    tipo: "Tortas, sándwiches y aguas",
    emoji: "🥪",
    color: "#FFF4CC",
    tiempo: "10-20 min",
    rating: 4.4,
    ubicacion: "Explanada principal",
    horario: "8:00 - 16:00",
    abierto: true,
    categorias: ["comida", "snacks"],
  },
  {
    id: "sushi",
    nombre: "Sushi Roll",
    tipo: "Sushi, bowls y ramen",
    emoji: "🍣",
    color: "#FFE1E1",
    tiempo: "20-30 min",
    rating: 4.7,
    ubicacion: "Food court, edificio C",
    horario: "11:00 - 19:00",
    abierto: true,
    categorias: ["comida", "saludable"],
  },
  {
    id: "cafe",
    nombre: "Café Punto",
    tipo: "Café, frappés y postres",
    emoji: "☕",
    color: "#EFE4DA",
    tiempo: "5-15 min",
    rating: 4.8,
    ubicacion: "Biblioteca",
    horario: "7:00 - 20:00",
    abierto: true,
    categorias: ["cafe", "desayunos", "snacks"],
  },
  {
    id: "green",
    nombre: "Green Box",
    tipo: "Ensaladas, wraps y jugos",
    emoji: "🥗",
    color: "#DDF5E3",
    tiempo: "15-20 min",
    rating: 4.3,
    ubicacion: "Gimnasio",
    horario: "9:00 - 15:00",
    abierto: false,
    categorias: ["saludable"],
  },
];

const PRODUCTOS = {
  cafeteria: [
    { id: "chilaquiles", seccion: "Desayunos", nombre: "Chilaquiles rojos o verdes", desc: "Con pollo, crema, queso y cebolla. Incluye frijoles.", precio: 75, emoji: "🥘", popular: true },
    { id: "molletes", seccion: "Desayunos", nombre: "Molletes", desc: "3 piezas con frijol, queso gratinado y pico de gallo.", precio: 55, emoji: "🍞" },
    { id: "huevos", seccion: "Desayunos", nombre: "Huevos al gusto", desc: "Revueltos, a la mexicana o con jamón. Con tortillas.", precio: 60, emoji: "🍳" },
    { id: "corrida", seccion: "Comida", nombre: "Comida corrida del día", desc: "Sopa, guisado, arroz y agua del día.", precio: 95, emoji: "🍲", popular: true },
    { id: "enchiladas", seccion: "Comida", nombre: "Enchiladas suizas", desc: "4 enchiladas de pollo gratinadas con salsa verde.", precio: 85, emoji: "🌯" },
    { id: "agua", seccion: "Bebidas", nombre: "Agua fresca 500 ml", desc: "Jamaica, horchata o limón.", precio: 25, emoji: "🥤" },
  ],
  tortas: [
    { id: "cubana", seccion: "Tortas", nombre: "Torta cubana", desc: "Milanesa, jamón, salchicha, queso amarillo y pierna.", precio: 85, emoji: "🥖", popular: true },
    { id: "milanesa", seccion: "Tortas", nombre: "Torta de milanesa", desc: "Milanesa de res, aguacate, jitomate y frijoles.", precio: 70, emoji: "🥪" },
    { id: "pierna", seccion: "Tortas", nombre: "Torta de pierna", desc: "Pierna adobada, cebolla morada y chipotle.", precio: 70, emoji: "🥪" },
    { id: "club", seccion: "Sándwiches", nombre: "Club sándwich", desc: "Pollo, tocino, jamón, lechuga y papas.", precio: 80, emoji: "🥓" },
    { id: "papas", seccion: "Extras", nombre: "Papas a la francesa", desc: "Porción mediana con catsup.", precio: 35, emoji: "🍟" },
    { id: "refresco", seccion: "Extras", nombre: "Refresco 600 ml", desc: "Coca-Cola, Sprite o Fanta.", precio: 25, emoji: "🥤" },
  ],
  sushi: [
    { id: "california", seccion: "Rollos", nombre: "California roll", desc: "Surimi, pepino, aguacate y queso crema. 10 piezas.", precio: 95, emoji: "🍣", popular: true },
    { id: "empanizado", seccion: "Rollos", nombre: "Rollo empanizado", desc: "Camarón, queso crema y aguacate, bañado en anguila.", precio: 115, emoji: "🍤" },
    { id: "bowl", seccion: "Bowls", nombre: "Poke bowl de salmón", desc: "Arroz, salmón, edamame, mango y aderezo de soya.", precio: 135, emoji: "🥗", popular: true },
    { id: "ramen", seccion: "Calientes", nombre: "Ramen tonkotsu", desc: "Caldo de cerdo, huevo marinado y cebollín.", precio: 125, emoji: "🍜" },
    { id: "gyozas", seccion: "Calientes", nombre: "Gyozas (6 pzas)", desc: "Rellenas de cerdo y verdura, con salsa ponzu.", precio: 70, emoji: "🥟" },
    { id: "te", seccion: "Bebidas", nombre: "Té verde frío", desc: "500 ml, sin azúcar.", precio: 30, emoji: "🍵" },
  ],
  cafe: [
    { id: "americano", seccion: "Café", nombre: "Americano", desc: "12 oz. Grano de Veracruz.", precio: 35, emoji: "☕" },
    { id: "latte", seccion: "Café", nombre: "Latte", desc: "12 oz. Leche entera, deslactosada o de almendra.", precio: 50, emoji: "☕", popular: true },
    { id: "frappe", seccion: "Fríos", nombre: "Frappé moka", desc: "16 oz con crema batida.", precio: 65, emoji: "🧋", popular: true },
    { id: "chai", seccion: "Fríos", nombre: "Chai latte frío", desc: "16 oz. Especiado y cremoso.", precio: 60, emoji: "🥤" },
    { id: "croissant", seccion: "Para acompañar", nombre: "Croissant de jamón y queso", desc: "Recién horneado.", precio: 55, emoji: "🥐" },
    { id: "brownie", seccion: "Para acompañar", nombre: "Brownie", desc: "Con nuez.", precio: 40, emoji: "🍫" },
  ],
  green: [
    { id: "cesar", seccion: "Ensaladas", nombre: "Ensalada César con pollo", desc: "Lechuga romana, crutones, parmesano y aderezo César.", precio: 95, emoji: "🥗", popular: true },
    { id: "wrap", seccion: "Wraps", nombre: "Wrap de pollo", desc: "Pollo a la plancha, espinaca, jitomate y hummus.", precio: 85, emoji: "🌯" },
    { id: "jugo", seccion: "Jugos", nombre: "Jugo verde", desc: "Nopal, piña, pepino, apio y naranja. 500 ml.", precio: 45, emoji: "🧃" },
    { id: "fruta", seccion: "Snacks", nombre: "Vaso de fruta", desc: "Con limón y chile en polvo.", precio: 35, emoji: "🍉" },
  ],
};

// Edificios del campus y horas en las que se puede programar una entrega.
const EDIFICIOS = ["A", "B", "C", "D", "Biblioteca"];
const HORAS_ENTREGA = ["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];
