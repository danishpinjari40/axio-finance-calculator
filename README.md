# Axio DO Calculator (Dealer App)

A fast, fully offline-capable Progressive Web Application (PWA) built to help dealers calculate exact cash collections and net disbursements for Axio Finance products.

## 🚀 Features

- **Instant Calculations:** Enter Phone Price and Down Payment to get instant derivations for Loan Amount, DBD Charges, and Processing Fees.
- **Shop Total Sale Calculator:** Easily see how much money is hitting your bank vs arriving in cash to ensure it perfectly matches the system price of the phone.
- **Extra Price Diff:** If you are selling the device for slightly more or less than the DO system price, enter it here and the "Collect from Customer" total will perfectly adapt.
- **100% Offline Capable (PWA):** Once loaded on your phone, you can install the app to your Home Screen. It will work completely offline without needing an active internet connection.
- **Zero Decimals:** Rounded and beautiful UI for easy visibility over the counter.

## 📱 How to Install (Offline PWA)

**On Android / Chrome:**
1. Open the calculator in Chrome.
2. Tap the three dots (⋮) in the top right corner.
3. Tap **"Install app"** or **"Add to Home screen"**.
4. You can now launch it directly from your app drawer, even offline!

**On iPhone / Safari:**
1. Open the calculator in Safari.
2. Tap the Share button (square with an up arrow) at the bottom.
3. Scroll down and tap **"Add to Home Screen"**.
4. The app is now installed! You can use it without internet.

## 💻 Tech Stack
- React + TypeScript
- Vite + `vite-plugin-pwa` (Service Workers)
- Custom Vanilla CSS (Dark mode, glassmorphism)

## 🛠️ Development

Install dependencies:
```bash
npm install # or pnpm install
```

Start Development Server:
```bash
npm run dev # or pnpm run dev
```

Build for Production:
```bash
npm run build # or pnpm run build
```
