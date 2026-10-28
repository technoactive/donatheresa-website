"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Phone, Calendar, Clock, MapPin, Users, Gift, Wine, UtensilsCrossed, Star, Sparkles, PartyPopper, TreePine, ArrowRight } from "lucide-react"
import type { ChristmasMenuItem } from "@/lib/christmas-menu-data"
import { christmasDayMenu, newYearMenu, type FestiveMenu } from "@/lib/festive-menus-data"
import { ChristmasStyles, Snowfall, FairyLights, Holly, Bauble, GoldDivider, christmasScript, XMAS } from "@/components/public/christmas-theme"

function CourseHeading({ title, note }: { title: string; note?: string }) {
  return (
    <div className="text-center mb-8 sm:mb-10 relative">
      <Holly size={44} className="mx-auto -mb-3 opacity-90" />
      <h3 className={`${christmasScript.className} text-5xl sm:text-6xl leading-[1.3]`} style={{ color: XMAS.burgundy }}>
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

/* Single gift-tag price card for a one-price menu */
function PriceTag({ menu }: { menu: FestiveMenu }) {
  const bg = menu.tone === "red" ? XMAS.burgundy : XMAS.green
  const ribbon = menu.tone === "red" ? "#c1121f" : "#1f6b45"
  const Icon = menu.tone === "red" ? TreePine : PartyPopper
  return (
    <div className="relative max-w-md mx-auto">
      <div className="absolute left-1/2 -top-10 h-10 w-px bg-[#e3b458]/70 -translate-x-1/2" aria-hidden />
      <div className="relative rounded-3xl p-[2px] xmas-glow" style={{ background: `linear-gradient(135deg, ${XMAS.gold}, ${XMAS.goldLight}, ${XMAS.gold})` }}>
        <div className="relative rounded-[22px] p-7 sm:p-8 overflow-hidden" style={{ backgroundColor: bg }}>
          <div className="absolute left-1/2 top-3 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-[#e3b458] bg-[#fbf6ea]" aria-hidden />
          <div className="absolute -right-10 top-6 rotate-45 text-[10px] tracking-[0.2em] uppercase font-bold text-white px-12 py-1 shadow" style={{ backgroundColor: ribbon }}>
            Set menu
          </div>
          <Snowfall count={14} className="opacity-60" />

          <div className="relative pt-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center border border-[#e3b458]/60 text-[#f6dfa4] bg-white/5 mb-4">
              <Icon className="w-5 h-5" />
            </div>
            <div className={`${christmasScript.className} text-4xl xmas-gold-text !block mx-auto`}>Three courses</div>
            <div className="text-[11px] uppercase tracking-[0.25em] text-[#f6dfa4]/70 mt-1 mb-5">{menu.date}</div>
            <div className="font-playfair text-6xl sm:text-7xl font-semibold text-[#f6dfa4] leading-none">£{menu.price}</div>
            <p className="text-xs text-[#f7edd8]/60 mt-4">per person, plus {menu.serviceCharge} service</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* Cross-link to the other festive menus */
function OtherFestiveMenus({ current }: { current: FestiveMenu["slug"] }) {
  const links = [
    { href: "/menu/christmas", title: "Christmas Carte", sub: "Throughout December · from £25.95", show: true },
    { href: "/menu/christmas-day", title: "Christmas Day", sub: `${christmasDayMenu.date} · £${christmasDayMenu.price}`, show: current !== "christmas-day" },
    { href: "/menu/new-year", title: "New Year's Eve", sub: `${newYearMenu.date} · £${newYearMenu.price}`, show: current !== "new-year" },
  ].filter((l) => l.show)
  return (
    <div className="max-w-4xl mx-auto px-6 pb-20 md:pb-28">
      <p className="text-center text-xs uppercase tracking-[0.3em] text-stone-500 mb-6">Also this season</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="group flex items-center justify-between gap-4 rounded-2xl border border-[#e3b458]/50 bg-white px-5 py-4 hover:border-[#e3b458] hover:shadow-lg hover:shadow-amber-200/40 transition-all">
            <div>
              <div className="font-playfair text-lg font-semibold" style={{ color: XMAS.burgundy }}>{l.title}</div>
              <div className="text-sm text-stone-500">{l.sub}</div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#e3b458] group-hover:translate-x-1 transition-transform" />
          </Link>
        ))}
      </div>
    </div>
  )
}

export function FestiveMenuPage({ menu }: { menu: FestiveMenu }) {
  const isNY = menu.slug === "new-year"
  const heroBg = isNY
    ? `radial-gradient(ellipse at top, ${XMAS.green} 0%, ${XMAS.greenDeep} 70%)`
    : `radial-gradient(ellipse at top, ${XMAS.burgundy} 0%, ${XMAS.burgundyDeep} 70%)`
  const ctaBg = isNY
    ? `radial-gradient(ellipse at bottom, ${XMAS.burgundy} 0%, ${XMAS.burgundyDeep} 70%)`
    : `radial-gradient(ellipse at bottom, ${XMAS.green} 0%, ${XMAS.greenDeep} 70%)`
  const heroBtnText = isNY ? XMAS.greenDeep : XMAS.burgundyDeep
  const ctaBtnText = isNY ? XMAS.burgundyDeep : XMAS.greenDeep
  const BadgeIcon = isNY ? Sparkles : TreePine
  const [scriptWord, ...restWords] = menu.scriptTitle.split(" ")
  const secondLine = restWords.join(" ")

  return (
    <div className="min-h-screen text-stone-900" style={{ backgroundColor: "#fbf6ea" }}>
      <ChristmasStyles />

      {/* Hero */}
      <section className="relative overflow-hidden pt-44 md:pt-48 pb-28 md:pb-36" style={{ background: heroBg }}>
        <FairyLights className="top-[104px] md:top-[112px] z-20" />
        <Snowfall count={60} />
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-[#e3b458]/10 blur-[120px]" aria-hidden />
        <Bauble colour="#c1121f" className="absolute left-[6%] top-36 hidden md:block" size={44} />
        <Bauble colour="#e3b458" className="absolute left-[14%] top-24 hidden lg:block" size={32} delay={1.2} />
        <Bauble colour={isNY ? "#f6dfa4" : "#1f6b45"} className="absolute right-[7%] top-32 hidden md:block" size={48} delay={0.6} />
        <Bauble colour={isNY ? "#c1121f" : "#f6dfa4"} className="absolute right-[16%] top-24 hidden lg:block" size={30} delay={2} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 border border-[#e3b458]/50 bg-black/20 backdrop-blur-sm px-5 py-2.5 rounded-full mb-8">
            <BadgeIcon className="w-4 h-4 text-[#f6dfa4]" />
            <span className="text-[#f6dfa4] font-medium tracking-[0.25em] text-xs sm:text-sm uppercase">{menu.date}</span>
          </div>

          <h1 aria-label={`${menu.scriptTitle} ${menu.subTitle}`} className="mb-6">
            <span className={`${christmasScript.className} !block text-7xl sm:text-8xl md:text-9xl xmas-gold-text mx-auto`}>{scriptWord}</span>
            {secondLine && (
              <span className={`${christmasScript.className} !block text-6xl sm:text-7xl md:text-8xl xmas-gold-text mx-auto`} style={{ marginTop: "-0.6em" }}>{secondLine}</span>
            )}
            <span className="block font-playfair text-3xl sm:text-4xl md:text-5xl font-light tracking-[0.3em] uppercase mt-2" style={{ color: XMAS.cream }}>{menu.subTitle}</span>
          </h1>

          <Holly size={64} className="mx-auto mb-6" />

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light" style={{ color: "rgba(247,237,216,0.85)" }}>
            {menu.intro}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-10 py-6 rounded-full font-semibold shadow-2xl hover:brightness-110 xmas-glow" style={{ background: `linear-gradient(135deg, ${XMAS.gold}, ${XMAS.goldLight})`, color: heroBtnText }}>
              <Link href="/reserve"><Gift className="w-5 h-5 mr-2" />Book your table</Link>
            </Button>
            <Button asChild size="lg" className="bg-transparent border-2 border-[#e3b458]/60 hover:bg-white/10 text-[#f7edd8] text-lg px-10 py-6 rounded-full">
              <a href="tel:02084215550"><Phone className="w-5 h-5 mr-2" />020 8421 5550</a>
            </Button>
          </div>
        </div>

        <svg className="absolute bottom-0 left-0 right-0 w-full h-16 text-[#fbf6ea]" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden>
          <path fill="currentColor" d="M0 60 C 180 20 300 80 480 50 C 660 20 780 70 960 45 C 1140 20 1260 70 1440 40 L1440 80 L0 80 Z" />
        </svg>
      </section>

      {/* Price */}
      <section className="relative pt-16 pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-xs uppercase tracking-[0.3em] text-stone-500">One price, three courses</span>
          </div>
          <PriceTag menu={menu} />
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
              <p className={`${christmasScript.className} text-4xl sm:text-5xl xmas-gold-text !block`}>{isNY ? "Raise a glass" : "The table is set"}</p>
              <p className="text-white/85 text-sm mt-1">451 Uxbridge Road, Hatch End — free parking for guests</p>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <h2 className={`${christmasScript.className} text-6xl leading-[1.3]`} style={{ color: XMAS.green }}>{isNY ? "Out with the old" : "Leave the cooking to us"}</h2>
            <p className="text-stone-600 leading-relaxed">{menu.bookingNote}</p>
            <ul className="space-y-3 text-stone-700">
              <li className="flex items-start gap-3"><Users className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: XMAS.burgundy }} /><span>{isNY ? "Couples, groups of friends, big family tables — the room is yours for the evening." : "Families large and small, grandparents to toddlers, all at one table."}</span></li>
              <li className="flex items-start gap-3"><UtensilsCrossed className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: XMAS.burgundy }} /><span>{isNY ? "Half duck in orange, fillet steak with gorgonzola, seafood spaghetti and the classics." : "Norfolk turkey with all the trimmings, or lamb shank, sea bass and fillet steak in Barolo."}</span></li>
              <li className="flex items-start gap-3"><Wine className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: XMAS.burgundy }} /><span>{isNY ? "Prosecco, Italian wines and something stronger to see in midnight." : "Christmas pudding and panettone butter pudding to finish — then a long walk home."}</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section className="relative py-20 md:py-28 overflow-hidden" style={{ backgroundColor: XMAS.cream }}>
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 24 24' fill='none' stroke='%235c0f1a' stroke-width='1'%3E%3Cpath d='M12 2v20M2 12h20M5 5l14 14M19 5L5 19'/%3E%3C/svg%3E\")", backgroundSize: "80px 80px" }} aria-hidden />
        <Holly size={120} className="absolute -top-6 -left-6 opacity-70 rotate-[-20deg]" />
        <Holly size={120} className="absolute -bottom-8 -right-6 opacity-70 rotate-[160deg]" />

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 sm:mb-20">
            <GoldDivider className="mb-6" />
            <h2 className={`${christmasScript.className} text-7xl sm:text-8xl leading-[1.3]`} style={{ color: XMAS.burgundy }}>The Menu</h2>
            <p className="text-stone-600 mt-3">Choose a starter, a main course and a dessert</p>
          </div>

          <div className="mb-16 sm:mb-20">
            <CourseHeading title="Starters" />
            <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
              {menu.starters.map((item) => <MenuItemCard key={item.name} item={item} />)}
            </div>
          </div>

          <div className="mb-16 sm:mb-20">
            <CourseHeading title="Main Course" />
            <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
              {menu.mains.map((item) => <MenuItemCard key={item.name} item={item} />)}
            </div>
          </div>

          <div className="mb-12">
            <CourseHeading title="Dessert" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {menu.desserts.map((item) => (
                <div key={item.name} className="relative bg-white border border-[#e3b458]/40 rounded-2xl px-4 py-5 text-center hover:border-[#e3b458] hover:shadow-lg hover:shadow-amber-200/40 transition-all duration-300">
                  <h4 className="font-semibold text-stone-900 text-sm sm:text-base">{item.name}</h4>
                  {item.dietary?.includes("Contains nuts") && <span className="text-xs text-amber-700">Contains nuts</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-6 text-center border border-[#e3b458]/50 bg-white/70">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-stone-600">
              {menu.notes.map((note) => <span key={note}>{note}</span>)}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28 md:py-36 overflow-hidden" style={{ background: ctaBg }}>
        <FairyLights className="z-20" count={16} />
        <Snowfall count={50} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(227,180,88,0.15)_0%,transparent_55%)]" aria-hidden />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center pt-8">
          <Holly size={72} className="mx-auto mb-4" />
          <h2 className={`${christmasScript.className} text-6xl sm:text-7xl md:text-8xl xmas-gold-text !block mx-auto`}>
            {isNY ? "See the year out with us" : "Book Christmas Day"}
          </h2>
          <p className="text-lg mb-3 max-w-xl mx-auto" style={{ color: "rgba(247,237,216,0.85)" }}>
            {menu.bookingNote}
          </p>
          <p className="text-[#f6dfa4] mb-10">
            Three courses <span className="font-semibold">£{menu.price}</span> per person · plus {menu.serviceCharge} service
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Button asChild size="lg" className="text-lg px-10 py-6 rounded-full font-semibold shadow-2xl hover:brightness-110 xmas-glow" style={{ background: `linear-gradient(135deg, ${XMAS.gold}, ${XMAS.goldLight})`, color: ctaBtnText }}>
              <Link href="/reserve"><Calendar className="w-5 h-5 mr-2" />Book online</Link>
            </Button>
            <Button asChild size="lg" className="bg-transparent border-2 border-[#e3b458]/60 hover:bg-white/10 text-[#f7edd8] text-lg px-10 py-6 rounded-full font-semibold">
              <a href="tel:02084215550"><Phone className="w-5 h-5 mr-2" />020 8421 5550</a>
            </Button>
          </div>
          <div className="flex items-center justify-center gap-6 text-sm flex-wrap" style={{ color: "rgba(247,237,216,0.7)" }}>
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" />451 Uxbridge Road, Hatch End HA5 4JR</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{menu.date}</span>
          </div>
        </div>
      </section>

      <div className="pt-16">
        <OtherFestiveMenus current={menu.slug} />
      </div>
    </div>
  )
}
