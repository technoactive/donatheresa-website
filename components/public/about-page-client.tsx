"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, Car, Clock, MapPin, Phone, Utensils, Wine, Train, Users, Leaf } from "lucide-react"

const facts = [
  { icon: Calendar, number: "2011", label: "The year we opened" },
  { icon: Clock, number: "Tue–Sun", label: "Lunch and dinner, closed Mondays" },
  { icon: Utensils, number: "£19.95", label: "Two-course lunch & early bird" },
  { icon: Car, number: "Free", label: "Parking for guests on site" }
]

const practical = [
  {
    icon: Clock,
    title: "Opening hours",
    text: "Lunch is 12 till 3, dinner 6 till 11, Tuesday to Sunday. We take Mondays off. On Sundays the dining room fills up with families from about half twelve, so if you want a quieter lunch, come after two."
  },
  {
    icon: Utensils,
    title: "The £19.95 menu",
    text: "Two courses from a shorter version of our menu, at lunch and for early dinners. Orders need to be in by 6.45pm, and on Fridays and Saturdays we ask early-bird tables to finish by 8pm so the next booking can sit down. It isn't available for parties of more than twelve, and there's a 10% service charge."
  },
  {
    icon: Users,
    title: "Booking",
    text: "Weekday lunches you can usually walk in. Friday and Saturday nights you can't, so book — online takes a minute, or ring 020 8421 5550 and whoever answers will sort it. Big tables and birthdays: give us a day or two's notice and tell us if there's a cake coming."
  },
  {
    icon: Leaf,
    title: "Vegetarian, allergies and fussy eaters",
    text: "The menu marks vegetarian dishes with a (V) — parmigiana di melanzane, ravioli di funghi porcini, penne giardiniera and so on. Tell us about allergies when you book or when you sit down and the kitchen will tell you straight what is and isn't safe. Plain grilled fish or chicken for children is never a problem."
  },
  {
    icon: Train,
    title: "Getting here",
    text: "We're on Uxbridge Road, about five minutes' walk from Hatch End station on the London Overground (the Euston to Watford Junction line). The H12 bus stops on Uxbridge Road. Pinner Metropolitan line station is a 20-minute walk, or a short cab ride."
  },
  {
    icon: Car,
    title: "Parking",
    text: "There is free parking for guests at the restaurant, which is not something you get in Pinner village or on Hatch End Broadway. If it's full, the side roads are unrestricted in the evening."
  }
]

export default function AboutPageClient() {
  return (
    <main className="bg-white text-slate-900 min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[80vh] lg:min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-amber-50/30 pt-20">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 md:top-20 md:left-20 w-48 h-48 md:w-96 md:h-96 bg-amber-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 md:bottom-20 md:right-20 w-48 h-48 md:w-96 md:h-96 bg-slate-200/30 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="space-y-6 lg:space-y-8 text-center lg:text-left"
            >
              <div className="space-y-4 lg:space-y-6">
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                  <div className="w-8 h-px bg-gradient-to-r from-amber-500 to-yellow-500" />
                  <span className="text-xs sm:text-sm tracking-[0.3em] text-slate-600 font-medium uppercase">
                    Our Story
                  </span>
                </div>

                <h1 aria-label="About Dona Theresa" className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight tracking-tight">
                  <span className="block text-slate-900">About</span>
                  <span className="sr-only"> </span>
                  <span className="block bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                    Dona Theresa
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-slate-600 font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  We are a family-run Italian restaurant at 451 Uxbridge Road in Hatch End. We opened in 2011
                  and we still cook the way we did on the first night: proper Italian dishes, decent portions,
                  and the sort of welcome you get in a Portuguese home.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center lg:justify-start">
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-5 h-5 text-amber-500" />
                  <span className="font-medium">Hatch End, Pinner HA5 4JR</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-5 h-5 text-amber-500" />
                  <a href="tel:02084215550" className="font-medium hover:text-amber-600">020 8421 5550</a>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative order-first lg:order-last"
            >
              <div className="relative group">
                <div className="absolute -inset-4 md:-inset-8 bg-gradient-to-r from-amber-200/30 to-yellow-200/20 rounded-full blur-3xl group-hover:blur-[4rem] transition-all duration-500" />
                <div className="relative bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl border border-slate-200/50">
                  <Image
                    src="/gallery-interior.jpg"
                    alt="Inside Dona Theresa, the dining room laid for dinner"
                    width={500}
                    height={600}
                    className="rounded-xl md:rounded-2xl object-cover w-full shadow-lg"
                    priority
                  />
                  <div className="mt-6 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Italian food, Portuguese welcome</h2>
                    <p className="text-amber-600 font-semibold">Hatch End since 2011</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick facts */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 auto-rows-fr">
            {facts.map((fact, index) => (
              <motion.div
                key={fact.label}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
                  <div className="flex justify-center mb-4 md:mb-6">
                    <div className="p-3 md:p-4 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl md:rounded-2xl text-white shadow-lg">
                      <fact.icon className="w-6 h-6 md:w-8 md:h-8" />
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="text-3xl md:text-4xl font-black text-slate-900 mb-2">{fact.number}</div>
                    <div className="text-slate-600 font-semibold text-sm md:text-base">{fact.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How we do things */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-slate-50 via-white to-amber-50/20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-slate-900">
              How we do
              <span className="block bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
                things here
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              The name is Portuguese, the menu is Italian, and the customers are mostly from Hatch End, Pinner
              and Harrow. It is not a complicated formula. It just has to be done properly every night.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-stretch mb-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-slate-200/50 h-full">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">The kitchen</h3>
                <p className="text-slate-700 leading-relaxed mb-6">
                  Ours is the kind of Italian menu that is getting harder to find. Minestrone and prawn cocktail
                  to start, or Pera al Forno — a baked pear in red wine with deep-fried camembert, which sounds odd and which people drive over for. Then
                  saltimbocca di vitello, calf&apos;s liver with sage, an 11oz Filleto Rossini, spaghetti alla
                  pescatora piled with seafood, and a grilled Dover sole on the bone when we can get good ones.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  Nothing is deconstructed. Sauces are finished in the pan to order. If you want your sea bass
                  plain, your penne without the chilli or a half portion of pasta for a child, just say — the
                  kitchen has been asked for stranger things.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-3xl p-8 md:p-10 shadow-xl border border-amber-200/50 h-full">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">The welcome</h3>
                <p className="text-slate-700 leading-relaxed mb-6">
                  Dona Theresa is a Portuguese name and the hospitality is Portuguese too. In practice that means
                  we would rather you stayed for a second coffee than felt hurried out, we remember what the
                  regulars drink, and a birthday gets a proper fuss made of it whether you warned us or not.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  A good number of the people eating here on a Saturday were eating here in 2011. Their children
                  now book their own tables. That, more than any award, is the thing we are proudest of.
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/gallery-dining.jpg"
                alt="The dining room at Dona Theresa on a busy evening"
                width={1200}
                height={600}
                className="w-full h-[300px] md:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 max-w-3xl">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">Wine</h3>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    The list is mostly Italian with a few French bottles we like too much to drop. There is a
                    Barolo and a Brunello for when it matters, a Primitivo and a Montepulciano for a Tuesday,
                    a Sancerre for the fish, and a house Prosecco that does a lot of work at birthdays.
                    <Link href="/menu/wine-drinks" className="text-amber-600 font-semibold hover:underline ml-1">See the wine list</Link>.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Practical things */}
      <section className="py-20 md:py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-slate-900">
              Worth knowing
              <span className="block bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
                before you come
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              The questions we get asked most on the phone, answered once.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {practical.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-xl">
                      <item.icon className="w-6 h-6 text-amber-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed flex-grow">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Where we are */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
                  451 Uxbridge Road,
                  <span className="block bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
                    Hatch End
                  </span>
                </h2>

                <p className="text-lg sm:text-xl text-slate-700 leading-relaxed">
                  Hatch End sits between Pinner and Harrow Weald, and Uxbridge Road is its main street. We are on
                  the stretch near the station — close enough to walk from the Overground, far enough from the
                  Broadway that parking is not a fight.
                </p>

                <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                  Most of our guests come from Hatch End, Pinner, Harrow and Northwood, and a fair few from
                  Watford and Ruislip, which is a longer drive than we would expect anyone to make for dinner.
                  We are grateful that they do.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <div>
                    <p className="text-slate-900 font-semibold">451 Uxbridge Road</p>
                    <p className="text-slate-600 text-sm">Hatch End, Pinner HA5 4JR</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <div>
                    <p className="text-slate-900 font-semibold">Tuesday to Sunday</p>
                    <p className="text-slate-600 text-sm">Lunch 12:00–15:00 · Dinner 18:00–23:00 · Closed Mondays</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Train className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <div>
                    <p className="text-slate-900 font-semibold">Hatch End station (Overground)</p>
                    <p className="text-slate-600 text-sm">About five minutes on foot · H12 bus stops on Uxbridge Road</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/gallery-exterior.jpg"
                  alt="Dona Theresa from Uxbridge Road, Hatch End"
                  width={600}
                  height={400}
                  className="w-full h-[250px] md:h-[350px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4">
                    <h4 className="font-bold text-slate-900">Your local Italian</h4>
                    <p className="text-slate-600 text-sm">On Uxbridge Road since 2011</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-slate-50 via-white to-amber-50/20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-12 md:p-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                  Come and eat
                  <span className="block bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                    with us
                  </span>
                </h2>
                <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
                  Book online for any evening, or ring us if it is for tonight and we will see what we can do.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
                <Link
                  href="/reserve"
                  className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-2xl text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-2xl inline-flex items-center justify-center"
                >
                  <span>Book a table</span>
                  <Utensils className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/menu"
                  className="group w-full sm:w-auto border-2 border-slate-300 hover:border-amber-400 text-slate-700 hover:text-amber-600 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 hover:scale-105 hover:bg-amber-50 inline-flex items-center justify-center"
                >
                  <span>See the menu</span>
                  <Wine className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
}
