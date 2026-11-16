import type { OptionChoice, OptionGroup, Product } from "@/lib/types";

// Menús de Starbucks, Luka Poke, Tim Hortons y Vete a la Burger.
// Precios de referencia en MXN; se confirman con cada local al firmar el convenio.

const c = (name: string, price = 0): OptionChoice => ({
  id: name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, ""),
  name,
  price,
});

const single = (id: string, name: string, choices: OptionChoice[], required = true): OptionGroup => ({
  id,
  name,
  type: "single",
  required,
  choices,
});

const multi = (
  id: string,
  name: string,
  choices: OptionChoice[],
  extra: { included?: number; extraPrice?: number } = {},
): OptionGroup => ({ id, name, type: "multi", required: false, choices, ...extra });

/** La leche es entera; la deslactosada cuesta $15 más. */
const LECHE = single("leche", "Leche", [c("Entera"), c("Deslactosada", 15)]);

// ── Starbucks ───────────────────────────────────────────────
// Todas las bebidas cuestan lo mismo por tamaño: Short $80, Alto $95, Grande $104 y Venti $120.
const TAMANO_SBX = single("tamano", "Tamaño", [c("Short"), c("Alto", 15), c("Grande", 24), c("Venti", 40)]);
const EXTRAS_SBX = multi("extras", "Agrégale", [c("Shot extra de espresso", 15), c("Jarabe de vainilla", 12), c("Jarabe de caramelo", 12), c("Crema batida", 10)]);

const sbxBebida = (id: string, name: string, description: string, image: string, conLeche = true, popular = false): Product => ({
  id: `sbx-${id}`,
  vendorId: "starbucks",
  name,
  description,
  price: 80,
  emoji: "☕",
  image,
  section: "Bebidas",
  popular,
  options: conLeche ? [TAMANO_SBX, LECHE, EXTRAS_SBX] : [TAMANO_SBX, EXTRAS_SBX],
});

const sbxBaguette = (id: string, name: string, description: string, price: number): Product => ({
  id: `sbx-${id}`,
  vendorId: "starbucks",
  name,
  description,
  price,
  emoji: "🥖",
  image: "/menu/baguette.jpg",
  section: "Baguettes",
  options: [single("temperatura", "¿Cómo lo quieres?", [c("Caliente"), c("Sin calentar")])],
});

const STARBUCKS: Product[] = [
  sbxBebida("latte", "Latte", "Espresso con leche al vapor y una capa ligera de espuma.", "/menu/latte.jpg", true, true),
  sbxBebida("cappuccino", "Cappuccino", "Espresso con mucha espuma de leche.", "/menu/latte.jpg"),
  sbxBebida("caramel-macchiato", "Caramel Macchiato", "Leche con vainilla, espresso y salsa de caramelo.", "/menu/macchiato.jpg", true, true),
  sbxBebida("mocha", "Mocha", "Espresso con chocolate, leche al vapor y crema batida.", "/menu/chocolate.jpg"),
  sbxBebida("americano", "Americano", "Espresso con agua caliente.", "/menu/americano.jpg", false),
  sbxBebida("chai", "Chai Latte", "Té negro con especias y leche al vapor.", "/menu/latte.jpg"),
  sbxBebida("matcha", "Matcha Latte", "Té verde matcha con leche.", "/menu/matcha.jpg"),
  sbxBebida("frappuccino", "Frappuccino Caramelo", "Café, leche y hielo licuados con caramelo y crema batida.", "/menu/frappe.jpg", true, true),
  {
    id: "sbx-cake-pop",
    vendorId: "starbucks",
    name: "Cake Pop",
    description: "Paletita de pastel cubierta de chocolate.",
    price: 59,
    emoji: "🍭",
    image: "/menu/cakepop.jpg",
    section: "Cake Pops",
    popular: true,
    options: [single("sabor", "Sabor", [c("Birthday Cake"), c("Chocolate"), c("Cookies & Cream")])],
  },
  sbxBaguette("baguette-pavo", "Baguette de pavo y panela", "Pechuga de pavo, queso panela, jitomate y espinaca.", 115),
  sbxBaguette("baguette-serrano", "Baguette de jamón serrano", "Jamón serrano, queso manchego y aceite de oliva.", 129),
  sbxBaguette("baguette-caprese", "Baguette caprese", "Mozzarella, jitomate, albahaca y pesto.", 110),
];

// ── Luka Poke ───────────────────────────────────────────────
const BASE = single("base", "Base", [c("Arroz blanco"), c("Arroz integral")]);
const PROTEINA = single("proteina", "Proteína", [
  c("Atún"),
  c("Spicy tuna"),
  c("Salmón"),
  c("Kanikama"),
  c("Pasta tampico"),
  c("Camarón empanizado"),
  c("Pollo empanizado"),
  c("Spicy lemon chicken"),
  c("Orange chicken"),
  c("Arrachera"),
  c("Tofu (vegetariano)"),
]);
/** Cinco guarniciones incluidas; cada una adicional cuesta $25. */
const GUARNICIONES = multi(
  "guarniciones",
  "Guarniciones",
  [
    c("Aguacate"),
    c("Pepino"),
    c("Zanahoria"),
    c("Edamame"),
    c("Elote"),
    c("Brócoli"),
    c("Cebollín"),
    c("Jícama"),
    c("Aceitunas"),
    c("Spicy cauli"),
    c("Mango"),
    c("Piña"),
    c("Queso crema"),
    c("Camote frito"),
    c("Cebolla caramelizada"),
    c("Cebolla frita"),
    c("Tiras de wonton"),
    c("Alga nori"),
    c("Cilantro"),
    c("Ajonjolí"),
  ],
  { included: 5, extraPrice: 25 },
);
const ADEREZOS = multi("aderezos", "Aderezos y salsas", [
  c("Spicy mayo"),
  c("Chipotle vegano"),
  c("Salsa de anguila"),
  c("Teriyaki"),
  c("Ponzu"),
  c("Salsa miso"),
  c("Salsa de la casa"),
]);
const PROTEINA_EXTRA = multi("proteina-extra", "Proteína extra", [c("Atún", 45), c("Salmón", 45), c("Pollo empanizado", 35), c("Camarón empanizado", 45), c("Arrachera", 45), c("Tofu", 30)]);

const poke = (id: string, name: string, description: string, price: number, image: string, popular = false, antes: OptionGroup[] = []): Product => ({
  id: `luka-${id}`,
  vendorId: "luka",
  name,
  description,
  price,
  emoji: "🥗",
  image,
  section: "Bowls de la casa",
  popular,
  options: [BASE, ...antes, GUARNICIONES, ADEREZOS, PROTEINA_EXTRA],
});

const LUKA: Product[] = [
  poke("spicy-tuna", "Spicy Tuna", "Arroz, atún fresco y aderezo picante, con cinco guarniciones a elegir.", 185, "/menu/poke_tuna.jpg", true),
  poke("spicy-salmon", "Spicy Salmon", "Salmón fresco marinado con un toque picante, con cinco guarniciones a elegir.", 189, "/menu/poke_salmon.jpg", true),
  poke("kamoa-crunchy", "Kamoa Crunchy", "Combinación de la casa con toppings crujientes y cinco guarniciones.", 185, "/menu/poke_tuna.jpg"),
  poke("popcorn", "Popcorn Poke", "Bowl con proteína empanizada estilo palomitas.", 179, "/menu/poke_chicken.jpg", false, [
    single("palomitas", "Palomitas de", [c("Pollo"), c("Camarón", 15), c("Salmón", 15)]),
  ]),
  poke("chicken-miso", "Chicken Miso", "Pollo sazonado con salsa miso.", 169, "/menu/poke_chicken.jpg"),
  poke("orange-chicken", "Orange Chicken", "Pollo bañado en salsa de naranja estilo asiático.", 169, "/menu/poke_chicken.jpg", true),
  poke("cilantro-steak", "Cilantro Steak", "Res con cilantro sobre arroz.", 189, "/menu/poke_steak.jpg"),
  {
    id: "luka-arma-tu-bowl",
    vendorId: "luka",
    name: "Arma tu bowl",
    description: "Empieza de cero: elige base, proteína, cinco guarniciones y aderezos.",
    price: 179,
    emoji: "🥣",
    image: "/menu/poke_salmon.jpg",
    section: "Arma tu bowl",
    popular: true,
    options: [BASE, PROTEINA, GUARNICIONES, ADEREZOS, PROTEINA_EXTRA],
  },
];

// ── Tim Hortons ─────────────────────────────────────────────
const TAMANO_TIM = single("tamano", "Tamaño", [c("Chico"), c("Mediano", 10), c("Grande", 20)]);

const tim = (id: string, name: string, description: string, price: number, section: string, image: string, o: { leche?: boolean; popular?: boolean } = {}): Product => ({
  id: `tim-${id}`,
  vendorId: "tim-hortons",
  name,
  description,
  price,
  emoji: section === "Bebidas frías" ? "🧋" : "☕",
  image,
  section,
  popular: o.popular,
  options: o.leche ? [TAMANO_TIM, LECHE] : [TAMANO_TIM],
});

const timPan = (id: string, name: string, description: string, price: number, section: string, image: string, emoji: string, options?: OptionGroup[], popular = false): Product => ({
  id: `tim-${id}`,
  vendorId: "tim-hortons",
  name,
  description,
  price,
  emoji,
  image,
  section,
  popular,
  options,
});

const TIM: Product[] = [
  tim("cafe-original", "Café Original", "Mezcla clásica de tostado medio con notas de chocolate y nuez.", 39, "Bebidas calientes", "/menu/tim_cafe.jpg", { popular: true }),
  tim("french-vanilla", "French Vanilla", "Bebida caliente, dulce y cremosa, con vainilla francesa, café y cocoa.", 59, "Bebidas calientes", "/menu/latte.jpg", { leche: true }),
  tim("caramel-macchiato", "Caramel Macchiato", "Espresso con leche espumada, un toque de vainilla y salsa de caramelo.", 69, "Bebidas calientes", "/menu/macchiato.jpg", { leche: true }),
  tim("chocolate-mexicano", "Chocolate Mexicano", "Espumoso y suave, preparado con leche y chocolate tradicional mexicano.", 59, "Bebidas calientes", "/menu/chocolate.jpg", { leche: true }),
  tim("iced-capp", "Iced Capp Original", "El frappé insignia de la casa: café mezclado con crema.", 69, "Bebidas frías", "/menu/icedcapp.jpg", { popular: true }),
  tim("cold-brew-vanilla", "Cold Brew Vanilla", "Café infusionado en frío durante 16 horas con un ligero toque de vainilla.", 65, "Bebidas frías", "/menu/coldbrew.jpg"),
  tim("iced-caramel-macchiato", "Iced Caramel Macchiato", "Bebida helada de leche, espresso, vainilla y caramelo.", 75, "Bebidas frías", "/menu/icedcoffee.jpg", { leche: true }),
  timPan("timbits", "Timbits (caja de 10)", "La clásica bolita de dona recién horneada.", 55, "Panadería y dulces", "/menu/timbits.jpg", "🍩", [
    single("sabor", "Sabor", [c("Surtidos"), c("Glaseado"), c("Chocolate"), c("Fresa"), c("Cajeta")]),
  ], true),
  timPan("dona", "Dona", "Dona recién horneada.", 25, "Panadería y dulces", "/menu/dona.jpg", "🍩", [single("sabor", "Sabor", [c("Maple"), c("Glaseada")])]),
  timPan("apple-fritter", "Apple Fritter", "Pan trenzado y glaseado con trocitos de manzana, azúcar y canela.", 39, "Panadería y dulces", "/menu/fritter.jpg", "🍎"),
  timPan("croissant", "Croissant de tocino y huevo", "Croissant con tocino, huevo y queso.", 69, "Desayunos", "/menu/croissant.jpg", "🥐", [
    multi("quitar", "Quítale", [c("Sin tocino"), c("Sin queso")]),
  ]),
  timPan("pizza-panini", "Pizza Panini", "Panini caliente con salsa de jitomate, queso y pepperoni.", 79, "Desayunos", "/menu/panini.jpg", "🥪"),
];

// ── Vete a la Burger ────────────────────────────────────────
const AGREGAR = multi("agregar", "Agrégale", [c("Tocino extra", 20), c("Queso extra", 15), c("Carne extra", 45), c("Guacamole", 20), c("Papas a la francesa", 39)]);
const quitar = (...cosas: string[]) => multi("quitar", "Quítale", cosas.map((x) => c(`Sin ${x}`)));

const burger = (id: string, name: string, description: string, price: number, image: string, quita: string[], popular = false): Product => ({
  id: `vb-${id}`,
  vendorId: "vete-a-la-burger",
  name,
  description,
  price,
  emoji: "🍔",
  image,
  section: "Hamburguesas",
  popular,
  options: [single("termino", "Término de la carne", [c("Tres cuartos"), c("Medio"), c("Bien cocida")]), quitar(...quita), AGREGAR],
});

const vb = (id: string, name: string, description: string, price: number, section: string, image: string, emoji: string, options?: OptionGroup[]): Product => ({
  id: `vb-${id}`,
  vendorId: "vete-a-la-burger",
  name,
  description,
  price,
  emoji,
  image,
  section,
  options,
});

const BURGER: Product[] = [
  burger("cheeseburger", "Cheeseburger sencilla", "Pan brioche, 200 g de res, queso cheddar, tocino, cebolla asada y jalapeño.", 129, "/menu/burger.jpg", ["tocino", "cebolla", "jalapeño", "queso"], true),
  burger("valiente", "Valiente", "200 g de res con queso suizo, aros de cebolla y lechuga italiana.", 149, "/menu/burger2.jpg", ["aros de cebolla", "lechuga", "queso"]),
  burger("corregidora", "Corregidora", "Pan brioche, cama de guacamole, 300 g de picaña fileteada, cebolla asada y chimichurri argentino.", 189, "/menu/burger2.jpg", ["guacamole", "cebolla", "chimichurri"], true),
  burger("mamalona", "Mamalona", "Especialidad de la casa.", 179, "/menu/burger.jpg", ["cebolla", "jitomate", "queso"], true),
  burger("pastora", "Pastora", "Hamburguesa inspirada en el pastor, con piña, cebolla y cilantro.", 159, "/menu/burger2.jpg", ["piña", "cebolla", "cilantro"]),
  vb("hotdog-gallardo", "Hot dog Gallardo", "El hot dog de la casa.", 99, "Hot dogs", "/menu/hotdog.jpg", "🌭", [quitar("cebolla", "jitomate", "jalapeño"), AGREGAR]),
  vb("hotdog-padrino", "Hot dog Padrino", "Hot dog estilo gourmet.", 119, "Hot dogs", "/menu/hotdog.jpg", "🌭", [quitar("cebolla", "jitomate", "jalapeño"), AGREGAR]),
  vb("papas", "Papas a la francesa", "Papas recién fritas.", 59, "Para acompañar", "/menu/papas.jpg", "🍟", [
    single("tamano", "Tamaño", [c("Chica"), c("Grande", 20)]),
    multi("agregar", "Agrégale", [c("Queso cheddar", 15), c("Tocino", 20)]),
  ]),
  vb("a-la-madre", "A la madre", "Alitas preparadas, servidas con papas fritas.", 149, "Para acompañar", "/menu/alitas.jpg", "🍗", [
    single("salsa", "Salsa", [c("BBQ"), c("Búfalo"), c("Mango habanero")]),
  ]),
  vb("pizza", "Pizza individual", "Pizza individual recién horneada.", 119, "Pizzas", "/menu/pizza.jpg", "🍕", [
    single("sabor", "Sabor", [c("Pepperoni"), c("Hawaiana"), c("Cuatro quesos")]),
    multi("agregar", "Agrégale", [c("Queso extra", 15), c("Pepperoni extra", 20)]),
  ]),
];

export const NUEVOS_MENUS: Product[] = [...STARBUCKS, ...LUKA, ...TIM, ...BURGER];
