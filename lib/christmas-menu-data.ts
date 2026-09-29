// Christmas Carte — transcribed from the printed menu (menu_christmas_final.pdf).
// Edit `christmasMenuDetails.dates` once the restaurant confirms the run.

export interface ChristmasMenuItem {
  name: string
  description: string
  dietary?: string[]
}

export const christmasMenuPricing = {
  lunch: { twoCourse: "25.95", threeCourse: "29.95" },
  dinner: { twoCourse: "29.95", threeCourse: "33.95" },
  serviceCharge: "10%",
}

export const christmasMenuDetails = {
  title: "Christmas Carte",
  dates: "Throughout December",
  // Popup, banner and the /menu card stop showing themselves after this.
  showUntil: new Date("2026-12-24T23:59:59"),
  lunchTimes: "12:00 – 15:00",
  dinnerTimes: "18:00 – 23:00",
  note: "Ideal for office parties, family gatherings and festive catch-ups. Larger groups welcome — please book ahead.",
}

export const christmasMenuData = {
  starters: [
    { name: "Minestrone", description: "Homemade vegetable soup", dietary: ["V"] },
    { name: "Zuppa del Giorno", description: "Soup of the day" },
    { name: "Avocado e Salmone Affumicato", description: "Avocado and smoked salmon salad" },
    { name: "Coppa di Gamberetti", description: "Prawn cocktail" },
    { name: "Spiedini di Gamberi alla Griglia", description: "Grilled shrimp skewers" },
    { name: "Frittura di Calamari", description: "Fried squid rings" },
    { name: "Frittura di Bianchetti", description: "Deep fried whitebait" },
    { name: "Insalata Tricolore", description: "Tomato, avocado and mozzarella", dietary: ["V"] },
    { name: "Melanzane alla Parmigiana", description: "Aubergine, tomato, oregano and parmesan", dietary: ["V"] },
    { name: "Funghi alla Milanese", description: "Mushrooms in breadcrumbs", dietary: ["V"] },
    { name: "Bruschetta al Pomodoro", description: "Garlic toast topped with mozzarella, tomatoes, olive oil, garlic and basil", dietary: ["V"] },
    { name: "Prosciutto e Melone", description: "Parma ham with melon" },
  ] satisfies ChristmasMenuItem[],

  mains: [
    { name: "Norfolk Roast Turkey", description: "Roast turkey served with all the trimmings" },
    { name: "Filetti di Branzino", description: "Grilled fillet of sea bass on a bed of spinach" },
    { name: "Salmone Dona Theresa", description: "Fresh Scotch salmon in a cream and prosecco sauce" },
    { name: "Eglefino Goujons", description: "Fillet of haddock in breadcrumbs" },
    { name: "Tibia d'Agnello", description: "Lamb shank braised in red wine, garlic and rosemary, served on a bed of mashed potato" },
    { name: "Fegato di Vitello Lionese", description: "Calf's liver with sautéed onions" },
    { name: "Vitello alla Milanese", description: "Veal escalope in breadcrumbs" },
    { name: "Pollo Picante", description: "Chicken breast in wine, chilli and tomato sauce" },
    { name: "Penne Romana", description: "Penne with onions, peppers, jalapeños, garlic, tomato and chilli sauce", dietary: ["V"] },
    { name: "Spaghetti Aglio, Olio e Peperoncino con Gamberi", description: "Spaghetti with prawns, chilli oil and garlic sauce" },
    { name: "Penne Arrabiata", description: "Penne with tomato and chilli sauce", dietary: ["V"] },
    { name: "Mamma Mia", description: "Ravioli filled with ricotta cheese", dietary: ["V"] },
    { name: "Lasagna", description: "Vegetarian or meat lasagna", dietary: ["V option"] },
  ] satisfies ChristmasMenuItem[],

  desserts: [
    { name: "Christmas Pudding", description: "" },
    { name: "Panettone Butter Pudding", description: "" },
    { name: "Tiramisu", description: "" },
    { name: "Pecan Pie", description: "", dietary: ["Contains nuts"] },
    { name: "Apple Pie", description: "" },
    { name: "Cheesecake", description: "" },
    { name: "Crème Caramel", description: "" },
    { name: "Profiteroles", description: "" },
    { name: "Mixed Ice Cream", description: "" },
  ] satisfies ChristmasMenuItem[],
}

export const christmasMenuNotes = [
  "V = Vegetarian",
  "Gluten-free pasta is available",
  "Please tell us about any allergies when booking",
  `A ${christmasMenuPricing.serviceCharge} service charge is added to the bill`,
]
