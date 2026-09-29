"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Phone, Calendar, Clock, MapPin, Users, Gift, Wine, UtensilsCrossed, Star, TreePine } from "lucide-react"
import {
  christmasMenuData,
  christmasMenuDetails,
  christmasMenuNotes,
  christmasMenuPricing,
  type ChristmasMenuItem,
} from "@/lib/christmas-menu-data"
import { ChristmasStyles, Snowfall, FairyLights, Holly, Bauble, GoldDivider, christmasScript, XMAS } from "@/components/public/christmas-theme"

function CourseHeading({ title, note }: { title: string; note?: string }) {
  return (
    <div className="text-center mb-8 sm:mb-10 relative">
      <Holly size={44} className="mx-auto -mb-3 opacity-90" />
      <h3 className={`${christmasScript.className} text-5xl sm:text-6xl leading-none`} style={{ color: XMAS.burgundy }}>
        {title}
      </h3>
      {note && <p className="text-sm text-stone-500 mt-2 italic">{note}</p>}
      <GoldDivider className="mt-4" />
    </div>
  )
}

function MenuItemCard({ item }: { item: ChristmasMenuItem }) {
  return (
    <div className="group relative bg-white border border-[#e3b458]/40 rounded-2xl px-5 py-4 hover:border-[#e3b458] hover:shadow-lg hover:shadow-amber-200/40 transition-all duration-300 overflow-hidden">
      <span className="absolute -right-3 -top-3 w-10 h-10 rounded-full bg-[#e3b458]/10 group-hover:bg-[#e3b458]/25 transition-colors" aria-hidden />
      <h4 className="font-semibold text-stone-900 leading-snug flex items-start gap-2">
        <Star className="w-3.5 h-3.5 mt-1.5 text-[#e3b458] fill-[#e3b458] flex-shrink-0" aria-hidden />
        <span>
          {item.name}
          {item.dietary && item.dietary.length > 0 && (
            <span className="ml-2 text-xs font-medium text-green-800 bg-green-100 rounded-full px-2 py-0.5">{item.dietary.join(", ")}</span>
          )}
        </span>
      </h4>
      {item.description && <p className="text-stone-500 text-sm italic mt-1 ml-[22px]">{item.description}</p>}
    </div>
  )
}

/* Gift-tag price card */
function PriceTag({
  label, times, two, three, icon: Icon, tone,
}: {
  label: string; times: string; two: string; three: string; icon: typeof Clock; tone: "red" | "green"
}) {
  const bg = tone === "red" ? XMAS.burgundy : XMAS.green
  const ribbon = tone === "red" ? "#c1121f" : "#1f6b45"
  return (
    <div className="relative">
      {/* string */}
      <div className="absolute left-1/2 -top-10 h-10 w-px bg-[#e3b458]/70 -translate-x-1/2" aria-hidden />
      <div className="relative rounded-3xl p-[2px] xmas-glow" style={{ background: `linear-gradient(135deg, ${XMAS.gold}, ${XMAS.goldLight}, ${XMAS.gold})` }}>
        <div className="relative rounded-[22px] p-7 sm:p-8 overflow-hidden" style={{ backgroundColor: bg }}>
          {/* punched hole */}
          <div className="absolute left-1/2 top-3 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-[#e3b458] bg-[#fbf6ea]" aria-hidden />
          {/* ribbon corner */}
          <div className="absolute -right-10 top-6 rotate-45 text-[10px] tracking-[0.2em] uppercase font-bold text-white px-12 py-1 shadow" style={{ backgroundColor: ribbon }}>
            {label}
          </div>
          <Snowfall count={14} className="opacity-60" />

          <div className="relative pt-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center border border-[#e3b458]/60 text-[#f6dfa4] bg-white/5">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className={`${christmasScript.className} text-4xl leading-none xmas-gold-text`}>{label}</div>
                <div className="text-[11px] uppercase tracking-[0.25em] text-[#f6dfa4]/70 mt-1">{times}</div>
              </div>
            </div>
            <dl className="space-y-4">
              <div className="flex items-baseline justify-between border-b border-[#e3b458]/30 pb-3">
                <dt className="text-[#f7edd8]/90">Two courses</dt>
                <dd className="font-playfair text-4xl font-semibold text-[#f6dfa4]">£{two}</dd>
              </div>
              <div className="flex items-baseline justify-between">
                <dt className="text-[#f7edd8]/90">Three courses</dt>
                <dd className="font-playfair text-4xl font-semibold text-[#f6dfa4]">£{three}</dd>
              </div>
            </dl>
            <p className="text-xs text-[#f7edd8]/60 mt-5">per person, plus {christmasMenuPricing.serviceCharge} service</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ChristmasMenuPage() {
  const { lunch, dinner } = christmasMenuPricing

  return (
    <div className="min-h-screen text-stone-900" style={{ backgroundColor: "#fbf6ea" }}>
      <ChristmasStyles />

      {/* Hero */}
      <section className="relative overflow-hidden pt-44 md:pt-48 pb-28 md:pb-36" style={{ background: `radial-gradient(ellipse at top, ${XMAS.burgundy} 0%, ${XMAS.burgundyDeep} 70%)` }}>
        <FairyLights className="top-[104px] md:top-[112px] z-20" />
        <Snowfall count={60} />
        {/* soft candle glow */}
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-[#e3b458]/10 blur-[120px]" aria-hidden />
        {/* baubles */}
        <Bauble colour="#c1121f" className="absolute left-[6%] top-36 hidden md:block" size={44} />
        <Bauble colour="#e3b458" className="absolute left-[14%] top-24 hidden lg:block" size={32} delay={1.2} />
        <Bauble colour="#1f6b45" className="absolute right-[7%] top-32 hidden md:block" size={48} delay={0.6} />
        <Bauble colour="#f6dfa4" className="absolute right-[16%] top-24 hidden lg:block" size={30} delay={2} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 border border-[#e3b458]/50 bg-black/20 backdrop-blur-sm px-5 py-2.5 rounded-full mb-8">
            <TreePine className="w-4 h-4 text-[#7bd88f]" />
            <span className="text-[#f6dfa4] font-medium tracking-[0.25em] text-xs sm:text-sm uppercase">{christmasMenuDetails.dates}</span>
          </div>

          <h1 aria-label="Christmas Carte" className="leading-none mb-6">
            <span className={`${christmasScript.className} block text-7xl sm:text-8xl md:text-9xl xmas-gold-text pb-4`}>Christmas</span>
            <span className="block font-playfair text-3xl sm:text-4xl md:text-5xl font-light tracking-[0.3em] uppercase" style={{ color: XMAS.cream }}>Carte</span>
          </h1>

          <Holly size={64} className="mx-auto mb-6" />

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light" style={{ color: "rgba(247,237,216,0.85)" }}>
            Norfolk roast turkey with all the trimmings, sitting alongside the Italian dishes we cook all year.
            Two or three courses, at lunch or dinner, through December in Hatch End.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-10 py-6 rounded-full font-semibold shadow-2xl hover:brightness-110 xmas-glow" style={{ background: `linear-gradient(135deg, ${XMAS.gold}, ${XMAS.goldLight})`, color: XMAS.burgundyDeep }}>
              <Link href="/reserve"><Gift className="w-5 h-5 mr-2" />Book your Christmas table</Link>
            </Button>
            <Button asChild size="lg" className="bg-transparent border-2 border-[#e3b458]/60 hover:bg-white/10 text-[#f7edd8] text-lg px-10 py-6 rounded-full">
              <a href="tel:02084215550"><Phone className="w-5 h-5 mr-2" />020 8421 5550</a>
            </Button>
          </div>
        </div>

        {/* snow drift edge */}
        <svg className="absolute bottom-0 left-0 right-0 w-full h-16 text-[#fbf6ea]" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden>
          <path fill="currentColor" d="M0 60 C 180 20 300 80 480 50 C 660 20 780 70 960 45 C 1140 20 1260 70 1440 40 L1440 80 L0 80 Z" />
        </svg>
      </section>

      {/* Prices as gift tags */}
      <section className="relative pt-16 pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-xs uppercase tracking-[0.3em] text-stone-500">Choose your sitting</span>
          </div>
          <div className="grid md:grid-cols-2 gap-8 md:gap-10">
            <PriceTag label="Lunch" times={christmasMenuDetails.lunchTimes} two={lunch.twoCourse} three={lunch.threeCourse} icon={Clock} tone="red" />
            <PriceTag label="Dinner" times={christmasMenuDetails.dinnerTimes} two={dinner.twoCourse} three={dinner.threeCourse} icon={Wine} tone="green" />
          </div>
        </div>
      </section>

      {/* Image + occasion */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-5 gap-10 items-center">
          <div className="lg:col-span-3 relative rounded-3xl overflow-hidden shadow-2xl ring-4 ring-[#e3b458]/40">
            <Image src="/christmas-dinner.jpg" alt="A table laid for dinner at Dona Theresa with red wine" width={1200} height={800} className="w-full h-[280px] sm:h-[400px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3f0a12]/80 via-transparent to-transparent" />
            <Snowfall count={20} className="opacity-70" />
            <Holly size={72} className="absolute top-3 left-3 drop-shadow" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className={`${christmasScript.className} text-4xl sm:text-5xl xmas-gold-text`}>The table is set</p>
              <p className="text-white/85 text-sm mt-1">451 Uxbridge Road, Hatch End — free parking for guests</p>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <h2 className={`${christmasScript.className} text-6xl leading-none`} style={{ color: XMAS.green }}>Made for a party</h2>
            <p className="text-stone-600 leading-relaxed">{christmasMenuDetails.note}</p>
            <ul className="space-y-3 text-stone-700">
              <li className="flex items-start gap-3"><Users className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: XMAS.burgundy }} /><span>Office lunches, family Sundays, friends who only manage to meet once a year.</span></li>
              <li className="flex items-start gap-3"><UtensilsCrossed className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: XMAS.burgundy }} /><span>Turkey for the traditionalists; sea bass, lamb shank and pasta for everyone else.</span></li>
              <li className="flex items-start gap-3"><Gift className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: XMAS.burgundy }} /><span>Bring a cake, crackers or Secret Santa — we&apos;ll make room.</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section className="relative py-20 md:py-28 overflow-hidden" style={{ backgroundColor: XMAS.cream }}>
        {/* subtle snowflake pattern */}
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 24 24' fill='none' stroke='%235c0f1a' stroke-width='1'%3E%3Cpath d='M12 2v20M2 12h20M5 5l14 14M19 5L5 19'/%3E%3C/svg%3E\")", backgroundSize: "80px 80px" }} aria-hidden />
        <Holly size={120} className="absolute -top-6 -left-6 opacity-70 rotate-[-20deg]" />
        <Holly size={120} className="absolute -bottom-8 -right-6 opacity-70 rotate-[160deg]" />

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 sm:mb-20">
            <GoldDivider className="mb-6" />
            <h2 className={`${christmasScript.className} text-7xl sm:text-8xl leading-none`} style={{ color: XMAS.burgundy }}>The Menu</h2>
            <p className="text-stone-600 mt-3">Choose a starter and a main, or add a dessert for three courses</p>
          </div>

          <div className="mb-16 sm:mb-20">
            <CourseHeading title="Starters" />
            <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
              {christmasMenuData.starters.map((item) => <MenuItemCard key={item.name} item={item} />)}
            </div>
          </div>

          <div className="mb-16 sm:mb-20">
            <CourseHeading title="Main Course" />
            <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
              {christmasMenuData.mains.map((item) => <MenuItemCard key={item.name} item={item} />)}
            </div>
          </div>

          <div className="mb-12">
            <CourseHeading title="Dessert" note="Included with the three-course price" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {christmasMenuData.desserts.map((item) => (
                <div key={item.name} className="relative bg-white border border-[#e3b458]/40 rounded-2xl px-4 py-5 text-center hover:border-[#e3b458] hover:shadow-lg hover:shadow-amber-200/40 transition-all duration-300">
                  <h4 className="font-semibold text-stone-900 text-sm sm:text-base">{item.name}</h4>
                  {item.dietary?.includes("Contains nuts") && <span className="text-xs text-amber-700">Contains nuts</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-6 text-center border border-[#e3b458]/50 bg-white/70">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-stone-600">
              {christmasMenuNotes.map((note) => <span key={note}>{note}</span>)}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28 md:py-36 overflow-hidden" style={{ background: `radial-gradient(ellipse at bottom, ${XMAS.green} 0%, ${XMAS.greenDeep} 70%)` }}>
        <FairyLights className="z-20" count={16} />
        <Snowfall count={50} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(227,180,88,0.15)_0%,transparent_55%)]" aria-hidden />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center pt-8">
          <Holly size={72} className="mx-auto mb-4" />
          <h2 className={`${christmasScript.className} text-6xl sm:text-7xl md:text-8xl xmas-gold-text leading-none pb-4`}>Book your Christmas table</h2>
          <p className="text-lg mb-3 max-w-xl mx-auto" style={{ color: "rgba(247,237,216,0.85)" }}>
            December fills up quickly, especially Friday and Saturday evenings and the week before Christmas.
            Groups of eight or more, please ring us so we can seat you together.
          </p>
          <p className="text-[#f6dfa4] mb-10">
            Lunch from <span className="font-semibold">£{lunch.twoCourse}</span> · Dinner from <span className="font-semibold">£{dinner.twoCourse}</span> · plus {christmasMenuPricing.serviceCharge} service
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Button asChild size="lg" className="text-lg px-10 py-6 rounded-full font-semibold shadow-2xl hover:brightness-110 xmas-glow" style={{ background: `linear-gradient(135deg, ${XMAS.gold}, ${XMAS.goldLight})`, color: XMAS.greenDeep }}>
              <Link href="/reserve"><Calendar className="w-5 h-5 mr-2" />Book online</Link>
            </Button>
            <Button asChild size="lg" className="bg-transparent border-2 border-[#e3b458]/60 hover:bg-white/10 text-[#f7edd8] text-lg px-10 py-6 rounded-full font-semibold">
              <a href="tel:02084215550"><Phone className="w-5 h-5 mr-2" />020 8421 5550</a>
            </Button>
          </div>
          <div className="flex items-center justify-center gap-6 text-sm flex-wrap" style={{ color: "rgba(247,237,216,0.7)" }}>
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" />451 Uxbridge Road, Hatch End HA5 4JR</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" />Tue–Sun · Lunch {christmasMenuDetails.lunchTimes} · Dinner {christmasMenuDetails.dinnerTimes}</span>
          </div>
        </div>
      </section>
    </div>
  )
}
