"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import {
  ArrowRight,
  Bell,
  Check,
  CircleDollarSign,
  History,
  Menu,
  ShieldCheck,
  Users,
  X as XIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const features = [
  {
    icon: Users,
    title: "Création de groupes",
    description:
      "Organisez plusieurs tontines, ajoutez vos membres et définissez les règles en quelques minutes.",
  },
  {
    icon: CircleDollarSign,
    title: "Suivi des cotisations",
    description:
      "Visualisez les paiements attendus, les cotisations reçues et les soldes de chaque membre.",
  },
  {
    icon: Bell,
    title: "Notifications automatiques",
    description:
      "Envoyez des rappels clairs avant les échéances pour limiter les oublis et les retards.",
  },
  {
    icon: History,
    title: "Historique transparent",
    description:
      "Gardez une trace fiable des tours, paiements et décisions importantes de votre tontine.",
  },
]

const beforeItems = [
  "Cahiers perdus ou incomplets",
  "Oublis de paiement fréquents",
  "Conflits entre membres",
  "Manque de transparence",
]

const afterItems = [
  "Tout est centralisé",
  "Rappels automatiques",
  "Historique transparent",
  "Accessible depuis le téléphone",
]

export default function Home() {
  const [open, setOpen] = useState(false)

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <style>{`html { scroll-behavior: smooth; }`}</style>

      {/* NAVBAR */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-10 items-center justify-center overflow-hidden rounded-lg bg-white">
              <Image
                src="/logo.jpeg"
                alt="Logo TONTI-NET"
                width={40}
                height={40}
                className="size-10 object-contain"
                priority
              />
            </span>
            <span className="text-lg font-bold tracking-tight text-[#16a34a]">
              TONTI-NET
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#fonctionnalites" className="transition hover:text-[#16a34a]">
              Fonctionnalités
            </a>
            <a href="#comment-ca-marche" className="transition hover:text-[#16a34a]">
              Comment ça marche
            </a>
            <a href="#tarifs" className="transition hover:text-[#16a34a]">
              Tarifs
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              className="hidden h-10 border-slate-300 px-4 text-slate-800 sm:inline-flex"
            >
              <Link href="/login">Se connecter</Link>
            </Button>
            <Button
              asChild
              className="h-10 bg-[#16a34a] px-4 text-white hover:bg-[#15803d]"
            >
              <Link href="/register">
                Commencer
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <button
              className="ml-1 rounded-md p-1.5 text-slate-700 hover:bg-slate-100 md:hidden"
              onClick={() => setOpen(!open)}
            >
              {open ? <XIcon className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-4 text-sm font-medium text-slate-600">
              <a href="#fonctionnalites" onClick={() => setOpen(false)} className="hover:text-[#16a34a]">Fonctionnalités</a>
              <a href="#comment-ca-marche" onClick={() => setOpen(false)} className="hover:text-[#16a34a]">Comment ça marche</a>
              <a href="#tarifs" onClick={() => setOpen(false)} className="hover:text-[#16a34a]">Tarifs</a>
              <Link href="/login" onClick={() => setOpen(false)} className="hover:text-[#16a34a]">Se connecter</Link>
              <Link href="/register" onClick={() => setOpen(false)} className="font-semibold text-[#16a34a]">Commencer gratuitement</Link>
            </nav>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="px-4 pb-20 pt-32 sm:px-6 sm:pb-24 sm:pt-36 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
          <div>
            <h1
              className="text-4xl leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl"
              style={{
                fontFamily: "Sora",
                fontWeight: 700,
                color: "#0f172a",
                letterSpacing: "-0.03em",
              }}
            >
              Vos tontines,
              <br />
              <span className="italic" style={{ color: "#16a34a", fontWeight: 500 }}>
                enfin digitalisées
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Fini les cahiers et les calculs. TONTI-NET gère vos cotisations,
              vos tours et vos membres automatiquement.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="h-12 bg-[#16a34a] px-6 text-base text-white hover:bg-[#15803d]"
              >
                <Link href="/register">
                  Commencer gratuitement
                  <ArrowRight className="size-5" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 border-slate-300 px-6 text-base text-slate-800"
              >
                <Link href="/login">Se connecter</Link>
              </Button>
            </div>
            <div className="mt-10 flex gap-10 border-t border-slate-200 pt-6">
              <div>
                <p className="text-2xl font-bold text-slate-950" style={{ fontFamily: "Sora" }}>15k+</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Membres actifs</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-950" style={{ fontFamily: "Sora" }}>2.4B</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">FCFA circulés</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-950" style={{ fontFamily: "Sora" }}>100%</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Transparent</p>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute -inset-6 rounded-[2rem] bg-[#16a34a]/10 blur-3xl" />
            <Card className="relative overflow-hidden rounded-2xl border-slate-200 bg-white shadow-2xl shadow-slate-200/70">
              <CardHeader className="border-b border-slate-100 bg-slate-50/70">
                <div className="flex items-center justify-between">
                  <div>
                    <CardDescription>Tontine Famille Traore</CardDescription>
                    <CardTitle className="mt-2 text-2xl text-slate-950">
                      Tableau de bord
                    </CardTitle>
                  </div>
                  <span className="rounded-full bg-[#16a34a]/10 px-3 py-1 text-sm font-semibold text-[#16a34a]">
                    Active
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-100 bg-white p-4">
                    <p className="text-sm text-slate-500">Cotisé ce mois</p>
                    <p className="mt-2 text-3xl font-bold text-[#16a34a]">875 000</p>
                    <p className="text-sm text-slate-500">FCFA collectés</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-white p-4">
                    <p className="text-sm text-slate-500">Membres</p>
                    <p className="mt-2 text-3xl font-bold text-slate-950">24</p>
                    <p className="text-sm text-[#16a34a]">22 à jour</p>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-950 p-5 text-white">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-300">Prochain tour</p>
                    <ShieldCheck className="size-5 text-[#22c55e]" />
                  </div>
                  <p className="mt-3 text-2xl font-bold">Awa Coulibaly</p>
                  <div className="mt-4 h-3 rounded-full bg-white/15">
                    <div className="h-3 w-4/5 rounded-full bg-[#22c55e]" />
                  </div>
                  <p className="mt-3 text-sm text-slate-300">80% des cotisations confirmées</p>
                </div>

                <div className="space-y-3">
                  {["Moussa Diallo", "Fatoumata Keita", "Ibrahim Sangare"].map((name) => (
                    <div key={name} className="flex items-center justify-between rounded-xl border border-slate-100 p-4">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 items-center justify-center rounded-full bg-[#16a34a]/10 text-sm font-bold text-[#16a34a]">
                          {name.charAt(0)}
                        </span>
                        <span className="font-medium text-slate-800">{name}</span>
                      </div>
                      <span className="text-sm font-semibold text-[#16a34a]">Payé</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* PROBLÈME / SOLUTION */}
      <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <Card className="rounded-2xl border-red-100 bg-red-50 shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl text-red-950">Avant TONTI-NET</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {beforeItems.map((item) => (
                <div key={item} className="flex items-center gap-3 text-red-900">
                  <span className="size-2 rounded-full bg-red-500" />
                  <span>{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-green-100 bg-green-50 shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl text-green-950">Avec TONTI-NET</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {afterItems.map((item) => (
                <div key={item} className="flex items-center gap-3 text-green-900">
                  <Check className="size-5 text-[#16a34a]" />
                  <span>{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FONCTIONNALITÉS */}
      <section id="fonctionnalites" className="scroll-mt-24 bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Tout ce dont votre tontine a besoin
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Une gestion claire, rapide et adaptée aux tontines de Bamako et de toute l&apos;Afrique de l&apos;Ouest.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="rounded-2xl border-slate-200 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <CardHeader>
                  <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-[#16a34a]/10 text-[#16a34a]">
                    <feature.icon className="size-6" />
                  </span>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="leading-6">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section
        id="comment-ca-marche"
        className="scroll-mt-24 px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
        style={{ backgroundColor: "rgba(160, 196, 157, 0.12)" }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Lancez votre tontine en{" "}
              <em className="italic text-[#16a34a]">3 étapes.</em>
            </h2>
          </div>
          <div className="mt-16 grid gap-12 sm:grid-cols-3">
            {[
              { n: "01", t: "Créez votre groupe", d: "Nommez votre tontine, fixez le montant et la fréquence des cotisations." },
              { n: "02", t: "Invitez vos membres", d: "Partagez un lien d'invitation. Chacun rejoint en quelques clics depuis son téléphone." },
              { n: "03", t: "Suivez automatiquement", d: "Cotisations, rappels, historique : tout est géré pour vous. Vous gardez le contrôle." },
            ].map((s, i) => (
              <div key={s.n} className="relative">
                {i < 2 && (
                  <div className="absolute top-10 left-20 hidden h-px w-full bg-gradient-to-r from-green-300 to-transparent lg:block" />
                )}
                <div className="text-6xl font-bold leading-none text-green-200" style={{ fontFamily: "Sora" }}>
                  {s.n}
                </div>
                <h3 className="mt-6 text-2xl font-bold text-[#16a34a]" style={{ fontFamily: "Sora" }}>
                  {s.t}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-[#4a5b4f]">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TARIFS */}
      <section id="tarifs" className="scroll-mt-24 bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Simple et accessible
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Gratuit</CardTitle>
                <div className="pt-4">
                  <span className="text-4xl font-bold text-slate-950">0 FCFA</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {["Création de groupe", "Gestion des membres", "Suivi basique"].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <Check className="size-5 text-[#16a34a]" />
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="relative rounded-2xl border-2 border-[#16a34a] shadow-xl shadow-green-100">
              <div className="absolute right-6 top-6 rounded-full bg-[#16a34a] px-3 py-1 text-sm font-semibold text-white">
                Populaire
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Premium</CardTitle>
                <div className="pt-4">
                  <span className="text-4xl font-bold text-slate-950">2 000 FCFA</span>
                  <span className="text-slate-500">/mois</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {["Notifications automatiques", "Historique complet", "Rapports", "Sécurité renforcée"].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <Check className="size-5 text-[#16a34a]" />
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-[#16a34a] px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Rejoignez les premières tontines digitales du Mali
          </h2>
          <p className="mt-4 text-lg text-white/85">
            Gratuit pour commencer. Aucune carte bancaire requise.
          </p>
          <Button
            asChild
            className="mt-8 h-12 w-full bg-white px-6 text-base text-[#16a34a] hover:bg-slate-100 sm:w-auto"
          >
            <Link href="/register">
              Créer un compte gratuitement
              <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-10 items-center justify-center overflow-hidden rounded-lg bg-white">
                <Image
                  src="/logo.jpeg"
                  alt="Logo TONTI-NET"
                  width={40}
                  height={40}
                  className="size-10 object-contain"
                />
              </span>
              <span className="text-lg font-bold tracking-tight">TONTI-NET</span>
            </Link>
            <p className="mt-4 text-sm text-slate-400">
              © 2026 TONTI-NET — Bamako, Mali — Ingénierie Informatique
            </p>
          </div>
          <div className="flex flex-wrap gap-5 text-sm text-slate-300">
            <a href="#fonctionnalites" className="hover:text-white">Fonctionnalités</a>
            <a href="#tarifs" className="hover:text-white">Tarifs</a>
            <Link href="/login" className="hover:text-white">Se connecter</Link>
            <Link href="/register" className="hover:text-white">S&apos;inscrire</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
