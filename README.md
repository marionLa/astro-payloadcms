# 🚀 Astro + Payload CMS Starter

Ce projet utilise **Astro** pour le frontend et **Payload CMS** comme backend headless CMS.
Il permet de monter rapidement un site statique (type vitrine) avec un backend accessible à des personnes 
non techniques pour qu'elles puissent mettre à jour leur site de manière autonome. 
Il est structuré en monorepo : 

- [Astro](https://astro.build/) pour le frontend
- [Payload CMS](https://payloadcms.com/) pour le backend
- 
---

## 📦 **Installation**

### 1️⃣ **Cloner le projet**
```sh
git clone https://github.com/marionLa/astro-payloadcms.git
cd <NOM_DU_PROJET>
```

### 2️⃣ **Installer les dépendances**


```sh
pnpm install
```

---

## ⚙️ **Configuration**

### 1️⃣ **Créer une base MongoDB**
Le projet fonctionne dans sa configuration initiale avec un base MongoDB locale ou hébergée 
sur MongoDB Atlas.
Sur Vercel, il est possible d'utiliser le plugin Mongo pour pouvoir connecter la base de données.

### 2️⃣ **Créer un fichier `.env` pour Payload CMS**
Dans le dossier `backend`, copier le fichier .env.example et le renommer en `.env`. 
Compléter les données nécessaires au fonctionnement du back. 

### 3️⃣ **Créer un fichier `.env` pour Astro**
Dans le dossier `frontend`, copier le fichier .env.example et le renommer en `.env`.
Compléter les données nécessaires. 

---

## 🚀 **Lancer l'application**

### 1️⃣ **Démarrer l'application complète**
```sh
pnpm run dev
```
📌 **Accès à l'admin Payload CMS :** `http://localhost:3000`

📌 **Accès au site Astro :** `http://localhost:4321`

---


---


## 🌍 **Déploiement**

Le projet peut être déployé sur Vercel en suivant les préconisations pour un
[monorepo](https://vercel.com/docs/monorepos).


## 🛠 **Personnalisation**
### **Modifier les collections Payload**
Les collections Payload sont définies dans **`apcm-back/src/collections`**.
Payload génère automatiquement les types et les schémas de la base. Voir la documentation 
officielle pour plus d'infos. 

