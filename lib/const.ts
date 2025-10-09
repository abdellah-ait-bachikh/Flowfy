import restaurant_logo from "@/assets/images/icons/restaurant.png";
import supermarket_logo from "@/assets/images/icons/supermarket.png";
import custom_logo from "@/assets/images/icons/custom.png";

export const fonts = {
  "Montserrat-Black": "Montserrat-Black",
  "Montserrat-Bold": "Montserrat-Bold",
  "Montserrat-ExtraBold": "Montserrat-ExtraBold",
  "Montserrat-ExtraLight": "Montserrat-ExtraLight",
  "Montserrat-Light": "Montserrat-Light",
  "Montserrat-Medium": "Montserrat-Medium",
  Montserrat: "Montserrat",
  "Montserrat-SemiBold": "Montserrat-SemiBold",
  "Montserrat-Thin": "Montserrat-Thin",
};



export const user = null;

export const categories: {
    id: number;
    name: string;
    image: any;
    href: "restaurants" | "supermarket" | "custom";
}[] = [
  {
    id: 1,
    name: "restaurant",
    image: restaurant_logo,
    href: "restaurants",
  },
  {
    id: 2,
    name: "supermarket",
    image: supermarket_logo,
    href: "supermarket",
  },
  {
    id: 3,
    name: "custom",
    image: custom_logo,
    href: "custom",
  },
] as const;

export const restaurantSliderData = [
  {
    id: 1,
    name: "pokemone",
    logo: null,
    offers_count: 2,
    adress: "rue hassan 2 hay elmasira ",
    rating: 4.6,
    products_count: 30,
  },
  {
    id: 2,
    name: "snack darna",
    logo: null,
    offers_count: 10,
    adress: "rue hassan 2 hay elmasira ",
    rating: 2.0,
    products_count: 15,
  },
  {
    id: 3,
    name: "snack aboanasse",
    logo: null,
    offers_count: 4,
    adress: "rue hassan 2 hay elmasira ",
    rating: 3.5,
    products_count: 12,
  },
  {
    id: 4,
    name: "snak flan flani dhd h dhhdhdd",
    logo: null,
    offers_count: 1,
    adress: "rue hassan 2 hay elmasira ",
    rating: 5,
    products_count: 23,
  },
  {
    id: 5,
    name: "Pokemone",
    logo: null,
    offers_count: 12,
    adress: "rue hassan 2 hay elmasira ",
    rating: 2.4,
    products_count: 41,
  },
  {
    id: 6,
    name: "Pokemone",
    logo: null,
    offers_count: 6,
    adress: "rue hassan 2 hay elmasira ",
    rating: 3.5,
    products_count: 17,
  },
  {
    id: 7,
    name: "Pokemone",
    logo: null,
    offers_count: 10,
    adress: "rue hassan 2 hay elmasira ",
    rating: 4.6,
    products_count: 14,
  },
];

export const topSnacks = [
  { id: 1, name: "snack 1", image: null, restaurant: { name: "Pokemone" } },
  { id: 2, name: "snack 2", image: null, restaurant: { name: "Pokemone" } },
  { id: 3, name: "snack 3", image: null, restaurant: { name: "Pokemone" } },
  { id: 4, name: "snack 4", image: null, restaurant: { name: "Pokemone" } },
  { id: 5, name: "snack 5", image: null, restaurant: { name: "Pokemone" } },
  { id: 6, name: "snack 6", image: null, restaurant: { name: "Pokemone" } },
];
