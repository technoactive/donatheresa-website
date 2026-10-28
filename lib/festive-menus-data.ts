// Christmas Day and New Year menus — transcribed from the printed menus.
// Both are a single three-course price per person, plus 10% service.

import type { ChristmasMenuItem } from "./christmas-menu-data"

export interface FestiveMenu {
  slug: "christmas-day" | "new-year"
  scriptTitle: string      // big script word(s) in the hero
  subTitle: string         // small caps line under it
  pageTitle: string        // <title>
  date: string             // human-readable date line
  dateISO: string          // for sorting / schema
  showUntil: Date          // popup, banner and /menu card retire after this
  price: string
  serviceCharge: string
  tone: "red" | "green"
  intro: string
  bookingNote: string
  starters: ChristmasMenuItem[]
  mains: ChristmasMenuItem[]
  desserts: ChristmasMenuItem[]
  notes: string[]
}

export const christmasDayMenu: FestiveMenu = {
  slug: "christmas-day",
  scriptTitle: "Christmas Day",
  subTitle: "Menu",
  pageTitle: "Christmas Day Menu 2026",
  date: "Friday 25th December 2026",
  dateISO: "2026-12-25",
  showUntil: new Date("2026-12-25T23:59:59"),
  price: "82.95",
  serviceCharge: "10%",
  tone: "red",
  intro:
    "Three courses on Christmas Day itself, with Norfolk turkey and all the trimmings for the traditionalists and a proper Italian menu for everyone who would rather have the lamb shank, the sea bass or a fillet steak in Barolo. Nobody cooks, nobody washes up.",
  bookingNote:
    "Christmas Day is one sitting and it sells out every year. Book early, and tell us about children, highchairs and allergies when you do.",
  starters: [
    { name: "Minestrone", description: "Homemade vegetable soup", dietary: ["V"] },
    { name: "Zuppa del Giorno", description: "Soup of the day" },
    { name: "Polpettine della Casa", description: "Meatballs on a bed of mashed potato with tomato and cheese" },
    { name: "Gamberoni Piccanti", description: "Peeled prawns in a tomato, chilli and garlic sauce with toasted bread" },
    { name: "Fritto Misto di Pesce", description: "Mixed fried fish" },
    { name: "Avocado e Salmone Affumicato", description: "Avocado and smoked salmon salad" },
    { name: "Frittura di Bianchetti", description: "Deep fried whitebait" },
    { name: "Insalata Tricolore", description: "Tomato, avocado and mozzarella", dietary: ["V"] },
    { name: "Melanzane alla Parmigiana", description: "Aubergine, tomato, oregano and parmesan", dietary: ["V"] },
    { name: "Funghi alla Milanese", description: "Mushrooms in breadcrumbs", dietary: ["V"] },
    { name: "Insalata di Granchio", description: "Avocado and crab salad" },
    { name: "Prosciutto di Parma e Mozzarella di Bufala", description: "Parma ham and buffalo mozzarella" },
  ],
  mains: [
    { name: "Norfolk Roast Turkey", description: "Roast turkey served with all the trimmings" },
    { name: "Filetti di Branzino", description: "Grilled fillet of sea bass on a bed of spinach" },
    { name: "Salmone Dona Theresa", description: "Fresh Scotch salmon in a cream and prosecco sauce" },
    { name: "Tibia d'Agnello", description: "Lamb shank braised in red wine, garlic and rosemary" },
    { name: "Fegato di Vitello Lionese", description: "Calf's liver with sautéed onions" },
    { name: "Vitello alla Milanese", description: "Veal escalope in breadcrumbs" },
    { name: "Filleto al Barolo", description: "Fillet steak in a red wine sauce" },
    { name: "Medaglioni Diane", description: "Fillet steak with onions, mushrooms, mustard and brandy sauce" },
    { name: "Pollo al Pepe", description: "Chicken breast in a pepper sauce" },
    { name: "Penne Romana", description: "Penne with onions, peppers, jalapeños, garlic, tomato and chilli sauce", dietary: ["V"] },
    { name: "Spaghetti Aglio, Olio e Peperoncino con Gamberi", description: "Spaghetti with prawns, chilli oil and garlic sauce" },
    { name: "Penne Arrabiata", description: "Penne with tomato and chilli sauce", dietary: ["V"] },
    { name: "Lasagna", description: "Vegetarian or meat lasagna", dietary: ["V option"] },
  ],
  desserts: [
    { name: "Christmas Pudding", description: "" },
    { name: "Panettone Butter Pudding", description: "" },
    { name: "Pecan Pie", description: "", dietary: ["Contains nuts"] },
    { name: "Tiramisu", description: "" },
    { name: "Apple Pie", description: "" },
    { name: "Cheesecake", description: "" },
    { name: "Crème Caramel", description: "" },
    { name: "Profiteroles", description: "" },
    { name: "Mixed Ice Cream", description: "" },
  ],
  notes: [
    "V = Vegetarian",
    "Gluten-free pasta is available",
    "Please tell us about any allergies when booking",
    "A 10% service charge is added to the bill",
  ],
}

export const newYearMenu: FestiveMenu = {
  slug: "new-year",
  scriptTitle: "New Year",
  subTitle: "Menu",
  pageTitle: "New Year's Eve Menu 2026",
  date: "Thursday 31st December 2026",
  dateISO: "2026-12-31",
  showUntil: new Date("2026-12-31T23:59:59"),
  price: "82.95",
  serviceCharge: "10%",
  tone: "green",
  intro:
    "See the year out with three courses and a glass of something cold. Half a duck in orange sauce, fillet steak with gorgonzola, king prawns in Cointreau, Sicilian arancini — the menu leans a little more celebratory than usual, which seems right for the night.",
  bookingNote:
    "New Year's Eve is by reservation only and tables go quickly. Book online or ring us, and let us know if you are a party of eight or more so we can seat you together.",
  starters: [
    { name: "Minestrone", description: "Homemade vegetable soup", dietary: ["V"] },
    { name: "Zuppa del Giorno", description: "Soup of the day", dietary: ["V"] },
    { name: "Frittura di Calamari", description: "Fried squid rings" },
    { name: "Coppa di Gamberetti", description: "Prawn cocktail" },
    { name: "Gamberoni alla Fontana", description: "King prawns with Cointreau, citrus, cream and tomato sauce" },
    { name: "Paté della Casa", description: "Homemade chicken liver pâté" },
    { name: "Avocado e Salmone Affumicato", description: "Avocado and smoked salmon salad" },
    { name: "Insalata Tricolore", description: "Tomato, avocado and mozzarella", dietary: ["V"] },
    { name: "Melanzane alla Parmigiana", description: "Aubergine, tomato, oregano and parmesan", dietary: ["V"] },
    { name: "Arancini Siciliani", description: "Three Sicilian rice balls filled with mozzarella and spinach, in tomato sauce" },
    { name: "Funghi alla Milanese", description: "Mushrooms in breadcrumbs", dietary: ["V"] },
    { name: "Prosciutto di Parma e Mozzarella di Bufala", description: "Parma ham and buffalo mozzarella" },
  ],
  mains: [
    { name: "Filetti di Branzino", description: "Grilled fillet of sea bass on a bed of spinach" },
    { name: "Salmone Royale", description: "Fillet of salmon with prawns, spring onion, garlic, white wine and cream sauce" },
    { name: "Scampi Provinciale", description: "Scampi in a tomato, wine and garlic sauce, served with rice" },
    { name: "Tibia d'Agnello", description: "Lamb shank" },
    { name: "Fegato di Vitello Lionese", description: "Calf's liver with sautéed onions" },
    { name: "Vitello alla Milanese", description: "Veal escalope in breadcrumbs" },
    { name: "Pollo al Pepe", description: "Chicken breast in a pepper sauce" },
    { name: "Spaghetti alla Pescatora", description: "Seafood spaghetti" },
    { name: "Filleto di Manzo al Gorgonzola", description: "Fillet steak with gorgonzola sauce" },
    { name: "Mezza Anatra in Salsa di Arancia", description: "Half duck in orange sauce" },
    { name: "Penne Arrabiata", description: "Penne with tomato and chilli sauce", dietary: ["V"] },
    { name: "Lasagna", description: "Vegetarian or meat lasagna", dietary: ["V option"] },
  ],
  desserts: [
    { name: "Tiramisu", description: "" },
    { name: "Apple Pie", description: "" },
    { name: "Cheesecake", description: "" },
    { name: "Crème Caramel", description: "" },
    { name: "Profiteroles", description: "" },
    { name: "Chocolate Fudge Cake", description: "" },
    { name: "Mixed Ice Cream", description: "" },
  ],
  notes: [
    "V = Vegetarian",
    "Gluten-free pasta is available",
    "Please tell us about any allergies when booking",
    "A 10% service charge is added to the bill",
  ],
}

export const festiveMenus = [christmasDayMenu, newYearMenu]
