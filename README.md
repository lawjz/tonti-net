# 🏦 TONTI-NET

> La fintech malienne qui digitalise vos tontines traditionnelles.

TONTI-NET est une application web de gestion de tontines développée par des étudiants en ingénierie informatique de Bamako, Mali. Elle permet d'organiser facilement les cotisations, suivre les tours de distribution et gérer les membres — sans cahiers ni calculs manuels.

---

## ✨ Fonctionnalités

- 🔐 Authentification sécurisée (Better Auth)
- 👥 Création et gestion de groupes de tontine
- 💰 Suivi des cotisations en temps réel
- 📅 Calendrier automatique des tours de distribution
- 🔔 Notifications et rappels
- 📊 Historique transparent des transactions
- 📱 Interface responsive mobile & desktop

---

## 🛠 Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | Next.js 15, React, Tailwind CSS, shadcn/ui |
| Auth | Better Auth |
| ORM | Prisma 7 |
| Base de données | Supabase (PostgreSQL) |
| Déploiement | Vercel |

---

## 🚀 Installation

### Prérequis
- Node.js 18+
- Un projet Supabase

### Étapes

```bash
# Cloner le repo
git clone https://github.com/tonusername/tonti-net.git
cd tonti-net

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
```

Remplir le `.env` :

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
BETTER_AUTH_SECRET="votre-secret"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
```

```bash
# Appliquer les migrations
npx prisma migrate dev

# Lancer le serveur
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## 👥 Équipe

| Nom | Rôle |
|-----|------|
| TOUNKARA Mamadou | Promoteur — Développement & Gestion de projet |
| EKLO Mawuena Peter | Actionnaire — Programmation web & mobile |
| DICKO Aboubacar Abdoulaye | Actionnaire — Sécurité & Administration systèmes |
| DIAKITE Kadidiatou | Assistante PDG — Gestion administrative |
| KEITA Fatoumata | Actionnaire — Gestion de projet & Relation client |
| DEMBELE Djibril | Actionnaire — Réseaux & Support technique |

---

## 📍 Localisation

**Sotuba ACI, Commune 1, Bamako, Mali**

---

© 2026 TONTI-NET — Ingénierie Informatique