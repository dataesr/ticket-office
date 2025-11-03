# 🚀 Mise à Jour Racine - concurrently v9.2.1

### 1. Préparation

```bash
git checkout -b upgrade/root-dependencies
```

### 2. Mise à jour

```bash
bun add concurrently@9.2.1
cat package.json | grep concurrently
```

**Scripts ajoutés :**

"clean": "rm -rf node_modules client/node_modules server/node_modules",
"fresh-install": "npm run clean && npm install",
"check-outdated": "npm outdated && cd client && npm outdated && cd ../server && bun outdated",
"lint-all": "cd client && npm run lint",

- `clean` : Supprime tous les node_modules
- `fresh-install` : Réinstalle proprement tout
- `check-outdated` : Vérifie dépendances obsolètes (tous workspaces)
- `lint-all` : Lance ESLint sur le client

---

# 🎯 MISE À JOUR CLIENT

### 1. Audit

```bash
cd client && bun audit
```

Classification par gravité
Critical 🔴 : Vulnérabilités critiques (exploitation facile, impact majeur)
High 🟠 : Vulnérabilités graves
Moderate 🟡 : Vulnérabilités modérées
Low 🟢 : Vulnérabilités mineures

bun audit | grep -A 1 -B 1 "critical"

<!-- pour avoir les plus dangeureuses ! -->

### 2. Mise à jour sécurité

```bash
cd client
bun update vite typescript @types/react@types/react-dom
```

### 3. Test build

```bash
cd client
bun run build && bun run lint
```

### 4. Test

```bash
cd .. && bun start
```

---

## Production core (react)

```bash
cd client
bun update react react-dom @tanstack/react-query @tanstack/react-query-devtools
bun run build && cd .. && bun start
```

## Phase 5 : Dev tools

```bash
cd client
bun update eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
bun run build
```

## Phase 6 : Vite MAJEUR (attention!)

```bash
cd client
bun update vite @vitejs/plugin-react --latest
bun run build
```

## Phase 7 : Finalisation

```bash
cd client
bun update --latest
bun run build && cd .. && bun start

⚠️ Erreur avec React-Toastify 11.x ! Breaking change dans la nouvelle version. C'est un problème connu avec Vite 7.x et react-toastify 11.x.

Solution rapide : Downgrader react-toastify à la v10 :
bun add react-toastify@10.0.6

```

# 🖥️ MISE À JOUR SERVER

### Phase S1 : Core packages

```bash
cd server
bun update mongodb typescript @types/node
bun run start
```

### Phase S2 : Utilities

```bash
cd server
bun update cheerio dotenv imapflow mailparser
bun run start -
```

### Phase S3 : Types & dev

```bash
cd server
bun update @types/imapflow @types/mailparser --latest
bun run start-
```

### Phase S4 : Elysia ecosystem

```bash
Migration manuelle nécessaire
elysia + tous les @elysiajs/* plugins
Changements API majeurs avec modification dans le code
```

**Note importante :**

# Elysia nécessite une attention particulière avec des modifications majeures de l'API.

Car pour le passage à la version 1.4.15 :
-Changement d'import. Exemple static ne s'importe plus cf :

Avant : type variationType = Static<typeof variationSchema>;

Aprés : type variationType = typeof variationSchema.static

#### BONUS !

# xlsx remplacé par exceljs

# pkgcloud qui est pas sympas

# C'est quoi depcheck ?! C'est un outil universel qui analyse les dépendances indépendamment du gestionnaire utilisé.

npm install -g depcheck

npx depcheck

```

```
