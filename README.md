# 📱GoInn - Indoor Navigation Mobile App

<p align="center">
  <span style="border-radius: 10px; overflow: hidden; display: inline-block;">
  <img src="./screenshots/app_logo.png" alt="GoInn Logo" width="120" height="120" style="display: block; border-radius: 10px;">
</span>
  <br>
  <b>An intelligent indoor navigation solution powered by QR codes and A* algorithm.</b>
  <br>
  <!-- <img src="https://img.shields.io/badge/Platform-Android-green?style=flat-square&logo=android" alt="Platform">
  <img src="https://img.shields.io/badge/Status-Demonstration-blue?style=flat-square" alt="Status"> -->
</p>
 
 ---

<details open>
  <summary><b>🇬🇧 English Version (Click to collapse)</b></summary>
  <br />

  </details>

<br />

<details>
  <summary><b>🇭🇺 Magyar leírás (Kattints a megnyitáshoz)</b></summary>
  <br />

Egy modern **React Native alapú mobilalkalmazás**, amely beltéri navigációt biztosít QR-kód alapú kiindulóponttal és intelligens útvonaltervezéssel.

---

## 🚀 Funkciók

* 📍 **QR-kód alapú pozíció meghatározás**
* 🧭 **A*** **algoritmus alapú útvonaltervezés**
* 🗺️ **SVG-alapú térkép megjelenítés**
* ❤️ **Kedvenc útvonalak mentése**
* 🕘 **Korábbi útvonalak visszatöltése**
* 🏨 **Szállodai szolgáltatások integrációja**

  * Szobafoglalás
  * Gasztronómia (étlap, itallap)
  * Programajánló (tervezett funkció)

<br />

  <div align="center">
  <span style="border-radius: 10px; overflow: hidden; display: inline-block; margin: 5px;">
    <img src="./screenshots/screenshot1_main.png" alt="Főoldal" width="220" style="display: block;">
  </span>
  <span style="border-radius: 10px; overflow: hidden; display: inline-block; margin: 5px;">
    <img src="./screenshots/screenshot2_nav.png" alt="Navigációs nézet" width="220" style="display: block;">
  </span>
  <span style="border-radius: 10px; overflow: hidden; display: inline-block; margin: 5px;">
    <img src="./screenshots/screenshot3_map.png" alt="Térkép nézet" width="220" style="display: block;">
  </span>
</div>

---

## 🛠️ Technológiák

* React Native
* TypeScript
* Firebase (Auth + Firestore)
* SVG rendering
* A* algoritmus

---

## 📂 Projekt struktúra (röviden)

```
src/
 ├── screens/        # Képernyők (Login, Target, Booking, stb.)
 ├── components/     # Újrafelhasználható UI elemek
 ├── store/          # Gráf adatok (graphData.ts)
 ├── algorithms/     # Algoritmusok (A*)
 └── assets/         # Képek, SVG-k
```

---

## ⚙️ Telepítés és futtatás

### 1. Klónozás

```sh
git clone <repo-url>
cd <project-folder>
```

### 2. Függőségek telepítése

```sh
npm install
```

### 3. Metro indítása

```sh
npm start
```

### 4. Alkalmazás futtatása

#### Android

```sh
npm run android
```

---

## 🧠 Működés röviden

Az alkalmazás működése:

1. A felhasználó QR-kódot olvas be → ez lesz a **start pont**
2. Kiválaszt egy célt
3. Az alkalmazás az **A* algoritmus segítségével kiszámolja a legrövidebb útvonalat**
4. Az útvonal egy **SVG térképen jelenik meg**

---

## 🔐 Jogi információ

```
Copyright (c) [2024] Horváth Marcell. All rights reserved. 
This project is for portfolio and demonstration purposes only. 
It may not be copied, distributed, or modified without explicit permission.
```

---

## ⚠️ Megjegyzés

Ez a projekt **nem open-source**, kizárólag bemutatási és portfólió célokra készült.

---

## 👤 Készítette

**Horváth Marcell**

---

## ⭐ További fejlesztési lehetőségek

* Mozgássérült mód finomhangolása
* Többszintes navigáció optimalizálása
* AI-alapú programajánló rendszer
* iOS támogatás

</details>