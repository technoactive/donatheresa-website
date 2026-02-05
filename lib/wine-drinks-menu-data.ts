// Wine & Drinks Menu Data

export interface Wine {
  name: string
  origin: string
  description: string
  bottlePrice: string
  glassPrices?: {
    small?: string  // 125ml
    medium?: string // 175ml
    large?: string  // 250ml
  }
  tags?: string[]
}

export interface Drink {
  name: string
  description?: string
  price: string
}

export interface DrinkCategory {
  name: string
  price?: string
  items: Drink[] | string[]
}

// WHITE WINES
export const whiteWines: Wine[] = [
  {
    name: "Inzolia Terre Siciliane IGT",
    origin: "Italy",
    description: "Characteristic fruity bouquet of pineapple, banana and ripe white fruit. The palate is bright, vibrant, with further fruity notes and a nice green appley finish.",
    bottlePrice: "21.50",
    glassPrices: { small: "4.75", medium: "6.50", large: "7.95" }
  },
  {
    name: "Chardonnay Estate Thomson",
    origin: "Australia",
    description: "Citrus, white fleshed peach with pineapple and hints of elegant oak. It exhibits abundant peach and pineapple fruit flavours with floral notes. The subtle oak and elegant acidity provide a satisfying finish.",
    bottlePrice: "25.95",
    glassPrices: { small: "5.25", medium: "6.95", large: "8.95" }
  },
  {
    name: "Vinho Verde Escapada",
    origin: "Portugal",
    description: "Off dry, young and vibrant with a fresh pungent nose of green apples and limes. On the palate is delicate and mellow with a long finish.",
    bottlePrice: "27.95",
    glassPrices: { small: "5.45", medium: "7.25", large: "9.95" }
  },
  {
    name: "Pinot Grigio Premium DOC Delle Venezie",
    origin: "Italy",
    description: "Large and fresh bouquet with apple notes. On the palate it is clean and fresh with typical mineral taste. Ideal as an aperitif and with any fish courses.",
    bottlePrice: "29.95",
    glassPrices: { small: "5.95", medium: "7.95", large: "10.50" }
  },
  {
    name: "Sauvignon Blanc Marlborough Region",
    origin: "New Zealand",
    description: "Classic aromas of passion fruit, tomato leaf and blackcurrant. Dry and flavourful with well-balanced acidity and a pleasing texture.",
    bottlePrice: "29.95",
    glassPrices: { small: "5.95", medium: "7.95", large: "10.50" },
    tags: ["VG"]
  },
  {
    name: "Fiano del Salento Appassito DOC",
    origin: "Italy",
    description: "This wine is partly aged in wooden barrels for 3 months. Elegant aromas of fruit and almonds, citrus and tropical notes. Fresh, aromatic and slightly off dry on the palate, with a long and pleasant finish.",
    bottlePrice: "31.95",
    tags: ["Medal Winner"]
  },
  {
    name: "Trebbiano D'Abruzzo DOC Zaccagnini",
    origin: "Italy",
    description: "An intense bouquet of white fruits, honey and vanilla. This wine is light and dry on the palate with notes of green apples, white flowers, pears and citrus combined with a crisp and refreshing acidity. A good accompaniment for seafood appetizers, white fish or rice dishes.",
    bottlePrice: "32.75"
  },
  {
    name: "Gavi del Comune di Gavi DOCG",
    origin: "Italy",
    description: "Aromas of citrus and green apple – the palate is broad and structural with more apple flavours, hints of lemon and a refreshing minerality.",
    bottlePrice: "35.95"
  },
  {
    name: "Chablis AC",
    origin: "France",
    description: "Brilliant golden yellow. Aromatic nose mixing seductive pear and apricot aromas with delicate mineral notes. Fresh and lively on the palate, with a nice mineral finish. Serve with fish in sauce, seafood, white meat.",
    bottlePrice: "45.00"
  },
  {
    name: "Sancerre AC Loire",
    origin: "France",
    description: "Elegant with plenty of mouthwatering fruit and Sancerre's characteristic minerality. Pairs with smoked fish, salads, shellfish, risotto, goat's cheese, perfect as aperitif.",
    bottlePrice: "45.00"
  }
]

// ROSÉ WINES
export const roseWines: Wine[] = [
  {
    name: "Pinot Grigio Rosato Terre Siciliane IGT",
    origin: "Italy",
    description: "Light Pink in colour with a pronounced aroma of red berries. Smooth and appealing on the palate, harmonious finish.",
    bottlePrice: "25.95",
    glassPrices: { small: "5.50", medium: "6.95", large: "8.75" }
  },
  {
    name: "Vinho Verde Rosé",
    origin: "Italy",
    description: "Pretty aromas of strawberry bon bons and tangy sherbets.",
    bottlePrice: "27.50",
    glassPrices: { small: "5.50", medium: "7.50", large: "9.95" }
  }
]

// RED WINES
export const redWines: Wine[] = [
  {
    name: "Nero D'Avola Terre Siciliane IGT",
    origin: "Italy",
    description: "Bright red colour. Slightly spicy and fruity bouquet; hints of blackberries and blueberries on the nose. The taste is soft due to ripe tannins. The pleasant aftertaste gives sensations of fruit harvested when fully ripe.",
    bottlePrice: "21.50",
    glassPrices: { small: "4.75", medium: "6.50", large: "7.95" }
  },
  {
    name: "Merlot Reserva Selection",
    origin: "Chile",
    description: "Dry, with soft and rich tannins. Aged for a short period of time in french oak, the taste is full and complexed with a satisfying long, aftertaste.",
    bottlePrice: "26.95",
    glassPrices: { small: "5.50", medium: "7.25", large: "9.45" }
  },
  {
    name: "Montepulciano d'Abruzzo DOC Riserva",
    origin: "Italy",
    description: "Intense vinous bouquet with an immediate cherry flavour turning to notes of blackberries and liquorice with bottle age. Dry and herbaceous on the palate it becomes full bodied and more balanced with age.",
    bottlePrice: "27.95",
    glassPrices: { small: "5.95", medium: "7.95", large: "9.95" }
  },
  {
    name: "Malbec Mendoza Selection",
    origin: "Argentina",
    description: "Chunky and full bodied with notes of mature plums on the nose. Complexed and generous on the palate with a buoyant, prolonged finish.",
    bottlePrice: "28.95",
    glassPrices: { small: "5.95", medium: "7.95", large: "9.95" }
  },
  {
    name: "Castelo do Vinteiro Douro",
    origin: "Portugal",
    description: "A deep, dark colour with brooding aromas of mulberry and damson fruit along with juicy purple plums. A rich, voluptuous wine with pleasing, balanced tannins and a sprinkle of black pepper on the finish. Try with venison or spaghetti Bolognese.",
    bottlePrice: "29.95"
  },
  {
    name: "Passimento Rosso Juliet & Romeo IGT",
    origin: "Italy",
    description: "A beautiful style of wine made with some of the grapes sundried for some weeks and then added on during the fermentation. Rich and alcoholic with soft, raisiny tannins!",
    bottlePrice: "33.50"
  },
  {
    name: "Rioja Reserva Special Selection",
    origin: "Spain",
    description: "Dark Ruby red with a complexed aroma of spice and chocolate, aged in wood for a minimum of three years. The palate is aristocratic and fulfilling, the aftertaste is long and generous.",
    bottlePrice: "33.95"
  },
  {
    name: "Primitivo Di Manduria DOCG Selezione Speciale",
    origin: "Italy",
    description: "A jewel of a wine, primitivo has definetely made his presence in the UK in the last few years. Soft and mellow with a distinctive flavour of stewed plums, rich and satisfying.",
    bottlePrice: "35.75"
  },
  {
    name: "Chianti Classico DOCG",
    origin: "Italy",
    description: "Aged in oak barrels for at least 12 months. Deep ruby red colour, intense and persistent. This wine is characterized by fruity notes of cherry, followed by delicate spicy notes of black pepper.",
    bottlePrice: "36.95"
  },
  {
    name: "Barolo DOCG Piemonte",
    origin: "Italy",
    description: "Barolo, also known as the King of the wines. Almost garnet in colour, on the nose you can detect violet and plums scent, and brown spice. Truly a wine of great presence and history.",
    bottlePrice: "45.00"
  },
  {
    name: "Amarone della Valpolicella Classico DOCG",
    origin: "Italy",
    description: "Intense red in colour with shades of garnet. Aromas of red fruit jam. Full, velvety body and hints of spice on the finish. Pleasant accompaniment for roasted or white grilled meats. Ideal with braise, salami and aged game.",
    bottlePrice: "59.50"
  },
  {
    name: "Brunello di Montalcino DOCG Toscana",
    origin: "Italy",
    description: "Probably the most prestigious and internationally acclaimed wines from Italy, Tuscany region. Sangiovese grape at its very best, this wine is only made when the vintages garantee the quality which is known for.",
    bottlePrice: "89.00"
  }
]

// SPARKLING & CHAMPAGNE
export const sparklingWines: Wine[] = [
  {
    name: "Prosecco Extra Dry DOC",
    origin: "Italy",
    description: "Fresh and zesty with refreshing bubbles. Soft and delicate, lovely Prosecco!",
    bottlePrice: "30.95",
    glassPrices: { small: "6.50", medium: "8.95" }
  },
  {
    name: "Prosecco Spumante Rosé Extra Dry",
    origin: "Italy",
    description: "Just off dry with aromas of honeysuckle, strawberries and cherries. The taste is fresh and vibrant.",
    bottlePrice: "29.95",
    glassPrices: { small: "6.50", medium: "8.95" }
  },
  {
    name: "Champagne Jules Feraud Brut NV",
    origin: "France",
    description: "Excellent so called House Champagne! Made with Chardonnay and Pinot Meunier grapes, it has aroma of toast and marmite, elegant and complexed with a lingering finish.",
    bottlePrice: "59.00"
  },
  {
    name: "Champagne Jules Feraud Brut Rosé",
    origin: "France",
    description: "Beautiful deep pink, almost ruby colour, encircled by a silky ribbon of fine bubbles. Rich, intensely fruity nose, dominated at first by apricots and peaches then raspberries and finally black cherries. This fruitiness follows on the palate.",
    bottlePrice: "65.00"
  },
  {
    name: "Champagne Laurent Perrier Cuvée Rosé Brut",
    origin: "France",
    description: "A sumptuous and beautifully crafted pink champagne! By far the best selling style in England, fresh and vivacious with an elegant structure and captivating taste with a lovely aftertaste.",
    bottlePrice: "99.00"
  }
]

// SOFT DRINKS
export const softDrinks = {
  price: "3.95",
  items: [
    "Fanta", "Bitter Lemon", "Coke/Diet Coke", "Orange Juice", "Lemonade", "Cranberry Juice",
    "Tonic Water", "Pineapple Juice", "Soda Water", "Tomato Juice", "Ginger Ale", "Apple Juice",
    "J20 275ml (All flavours)"
  ]
}

// BEER & CIDER
export const beerAndCider: Drink[] = [
  { name: "Peroni, Nastro Azzuro (Italian Beer)", description: "5.1% alcohol by volume pale lager", price: "5.15" },
  { name: "Moretti (Italian Beer)", description: "4.6% alcohol by volume pale lager", price: "4.95" },
  { name: "Peroni Nastro Azzurro 0% (Italian Beer)", description: "0.0% alcohol by volume pale lager", price: "4.95" },
  { name: "Moretti Sale Di Mare (Italian Beer)", description: "4.8% alcohol by volume pale lager", price: "5.25" },
  { name: "Draught Peroni", description: "½ Pint £4.25 | Pint £6.95", price: "" },
  { name: "Shandy", description: "½ Pint £3.95 | Pint £5.75", price: "" },
  { name: "Magners Cider Original", description: "500ml", price: "5.25" },
  { name: "Kopparberg Cider", description: "Mixed Fruits / Strawberry & Lime 500ml", price: "5.45" }
]

// BOTTLED WATER & SPARKLING JUICES
export const bottledWater: Drink[] = [
  { name: "San Pellegrino Sparkling Water", description: "500ml £4.15 | 750ml £5.45", price: "" },
  { name: "Aqua Panna Still Water", description: "500ml £4.15 | 750ml £5.45", price: "" },
  { name: "San Pellegrino Sparkling Lemon/Blood Orange Juice", description: "300ml can", price: "3.95" }
]

// LIQUEURS
export const liqueurs = {
  size: "25ml",
  price: "4.95",
  items: ["Amaretto", "Limoncello (Italian Liqueur)", "Grand Marnier", "Sambuca", "Tia Maria", "Strega", "Cointreau", "Baileys", "Frangelico"]
}

// HOUSE SPIRITS
export const houseSpirits = {
  size: "25ml",
  price: "4.50",
  items: ["Bells Whiskey", "Gordon's Gin", "Jameson Whiskey", "Silver Tequila", "Smirnoff Vodka", "E&J Brandy"],
  extras: ["Rum: Bacardi, Malibu, Captain Morgan"]
}

// PREMIUM SPIRITS
export const premiumSpirits = {
  size: "25ml",
  price: "6.75",
  items: ["Courvoisier Cognac VSOP", "Armagnac VSOP", "Grey Goose Vodka", "Black Label", "Remy Martin VSOP", "Single Malt Whiskey Glenfiddich 18 Years Old £9.00", "Johnnie Walker", "Chivas Regal", "Hendricks Gin"]
}

// APERITIF
export const aperitifs: Drink[] = [
  { name: "Pimms", price: "4.95" },
  { name: "Sherry (All types)", price: "3.95" },
  { name: "Martini", price: "3.95" },
  { name: "Campari", price: "4.95" },
  { name: "Punt & Mes", price: "3.95" },
  { name: "Pernod", price: "4.95" },
  { name: "Port Ruby", price: "5.25" },
  { name: "Port Special Reserve", price: "6.25" }
]

// OTHER WORLD SPIRITS
export const otherSpirits = {
  size: "25ml",
  price: "5.25",
  items: ["Jack Daniels Whiskey", "Bombay Sapphire Gin", "Havana Club Rum", "Vecchia Romagna Brandy", "Southern Comfort"]
}

// MIXERS
export const mixers = {
  price: "2.25"
}

// SPECIAL COCKTAILS
export const specialCocktails: Drink[] = [
  { name: "Mojito", description: "White rum, sugar, soda water garnished with fresh mint", price: "10.50" },
  { name: "Porn Star Martini", description: "A dash of vanilla vodka, lime juice and sparkling wine", price: "10.50" },
  { name: "Strawberry Daiquiri", description: "Fresh squeezed strawberries with sparkling lime juice and a dash of rum", price: "10.50" },
  { name: "Espresso Martini", description: "Vodka and fresh brewed coffee with a tipple of coffee liqueur garnished with coffee beans", price: "10.50" },
  { name: "Cosmopolitan", description: "Vodka shaken with cointreau, fresh squeezed lime juice and cranberry juice. Served straight up", price: "10.50" },
  { name: "Tom Collins", description: "Bombay Saphire, fin and lemon juice, topped with soda. Served all over cubed ice", price: "10.50" },
  { name: "Margherita", description: "Tequila, triple sec, fresh lime juice", price: "10.50" },
  { name: "Brazil", description: "Vodka, Malibu, Mint Liqueur, lime juice, orange juice", price: "10.50" },
  { name: "Negroni", description: "Gin, Sweet Martini and Campari. Served over crushed ice", price: "10.50" },
  { name: "Americano", description: "Campari, Martini Rosso and a splash of soda. Served over crushed ice", price: "10.50" },
  { name: "Pina Colada", description: "White Rum, Coconut cream, Pineapple juice", price: "10.50" },
  { name: "Pimm's Cocktail", description: "Fresh fruit, cucumber, mint, Pimm's and chilled lemonade", price: "10.50" },
  { name: "Tequila Sunrise", description: "Tequila, orange juice and grenadine", price: "10.50" },
  { name: "Sex on the Beach", description: "Vodka, peach liqueur, cranberry juice and orange juice", price: "10.50" },
  { name: "White Russian", description: "Vodka, Kahlua and double cream", price: "10.50" },
  { name: "Mai Tai", description: "Dark Rum, Tequila, Tiple Sec, Amaretto and Orange Juice", price: "10.50" },
  { name: "Cardinale", description: "1/3 Each of dry vermouth, gin and Campari served in a ice filled glass", price: "10.50" },
  { name: "Angelo Azzurro (Blu Angel)", description: "Equal parts of gin and Cointreau with a dash of blue curacao served with on ice", price: "10.50" },
  { name: "Godfather", description: "Equal measures of Amaretto di Saronno and Scotch whisky well stirred, ice cubes optional", price: "10.50" },
  { name: "Godmother", description: "Equal measures of Amaretto di Saronno and Vodka well stirred, ice cubes optional", price: "10.50" },
  { name: "Sorrento", description: "A generous measure of Limoncello added to Prosecco topped with Lemon peelings, no ice", price: "10.50" }
]

// OTHER COCKTAILS
export const otherCocktails: Drink[] = [
  { name: "Gin Fizz", description: "Gin, Lemon juice and Soda", price: "7.50" },
  { name: "Bloody Mary", description: "Vodka and Tomato juice", price: "7.50" },
  { name: "Screwdriver", description: "Vodka and Orange Juice", price: "7.50" }
]

// PROSECCO COCKTAILS
export const proseccoCocktails: Drink[] = [
  { name: "Kir Royale", description: "Prosecco and créme de cassis", price: "9.95" },
  { name: "Bucks Fizz", description: "Prosecco and orange juice", price: "9.95" },
  { name: "Prosecco Special Cocktail", description: "Prosecco with a dash of Brandy and Grand Marnier", price: "9.95" },
  { name: "Prosecco Spritzer", description: "Prosecco with Aperol on the rocks", price: "9.95" }
]

// MOCKTAILS
export const mocktails: Drink[] = [
  { name: "Pink Lemonade", description: "Strawberries, lemon and sugar muddled, then shaken over and topped with soda water, Classically Pink", price: "6.95" },
  { name: "Pineapple Punch", description: "Pineapple juice, lemon and sugar muddled then shaken over ice, cream and grenadine", price: "6.95" },
  { name: "Sugar & Spice", description: "Orange and lemon juice shaken with grenadine, topped with ginger ale", price: "6.95" },
  { name: "Virgin Mary", description: "Tomato juice, lemon, Worcestershire sauce, Tobasco, salt and pepper", price: "6.95" },
  { name: "Passion Fruit", description: "Carbonated water with a mixture of tropical fruits", price: "6.95" }
]
