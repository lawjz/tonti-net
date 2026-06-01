"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Banknote,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  ShieldCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Mes Groupes", href: "/groups", icon: Users },
  { name: "Créer un groupe", href: "/groups/new", icon: PlusCircle },
  { name: "Securite", href: "/security", icon: ShieldCheck },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  React.useEffect(() => {
    if (!isPending && !session) {
      toast.error("Veuillez vous connecter pour accéder à cette page.");
      router.push("/login");
    }
  }, [isPending, router, session]);

  async function handleLogout() {
    try {
      await authClient.signOut();
      toast.success("Déconnexion réussie.");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Erreur lors de la déconnexion.");
    }
  }

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">
            Chargement de votre session...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const activePage =
    navigation.find((item) => pathname === item.href)?.name ||
    (pathname.startsWith("/groups/") ? "Mes Groupes" : "Gestion de tontine");

  return (
    <div className="min-h-screen bg-muted/20 lg:flex">
      <aside className="border-b border-border bg-card lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:flex lg:w-64 lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">
              <Image
                src="/logo.jpeg"
                alt="Logo TONTI-NET"
                width={36}
                height={36}
                className="size-9 object-contain"
                priority
              />
            </span>
            <span className="text-xl font-bold tracking-tight">
              TONTI-<span className="text-green-600">NET</span>
            </span>
          </Link>
        </div>

        <nav className="flex gap-2 overflow-x-auto px-4 py-3 lg:flex-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:py-6">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden border-t border-border p-4 lg:block">
          <div className="mb-4 flex items-center gap-3 px-2">
            <div className="flex size-9 items-center justify-center rounded-full bg-green-100 font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
              {session.user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {session.user.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Déconnexion
          </Button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 shadow-sm sm:px-6 lg:px-8">
          <h1 className="text-base font-bold sm:text-lg">{activePage}</h1>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 sm:inline-flex dark:bg-green-900/30 dark:text-green-400">
              <Banknote className="size-3.5" aria-hidden="true" />
              Zone UEMOA (XOF)
            </span>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="gap-2 lg:hidden"
            >
              <LogOut className="size-4" aria-hidden="true" />
              Sortir
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
