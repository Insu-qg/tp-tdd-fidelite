# TP Test-Driven Development - Système de Fidélité

> Implémentation d'un système de fidélité et de gestion d'abonnements en utilisant une approche TDD.

## 📑 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Installation](#-installation)
- [Tests](#-tests)
- [Architecture](#-architecture)
- [Documentation API](#-documentation-api)
- [Approche TDD](#-approche-tdd)
- [Performance](#-performance)

## ✨ Fonctionnalités

### 🎯 Calcul des Points de Fidélité

Le système calcule les points de fidélité selon les règles suivantes :

- **Points standards** : 1 point par tranche de 10€
- **Points premium** : 2 points par tranche de 10€
- **Bonus** : +10 points pour un panier > 200€

Exemple :
```javascript
const cart = [
  { type: "standard", price: 25 }, // 2 points
  { type: "premium", price: 25 }   // 4 points
];
```

### 🔄 Renouvellement d'Abonnement

Un abonnement est renouvelable si toutes ces conditions sont remplies :

✅ Statut `"active"`  
✅ Date de fin ≤ date actuelle  
✅ Non déjà renouvelé  
✅ Pas de dette impayée  
✅ N'est pas un essai gratuit  

## 🚀 Installation

```bash
# Cloner le dépôt
git clone git@github.com:Insu-qg/tp-tdd-fidelite.git

# Installer les dépendances
npm install
```

## 🧪 Tests

```bash
# Lancer tous les tests
npm test

# Tests spécifiques
npm run loyalty        # Tests du système de points
npm run subscription   # Tests des abonnements

# Couverture des tests
npm test --coverage
```

## 🏗 Architecture

```
tp-tdd-fidelite/
├── loyalty.js           # Calcul des points
├── loyalty.test.js      # Tests des points
├── subscription.js      # Gestion abonnements
├── subscription.test.js # Tests abonnements
└── package.json
```

## 📖 Documentation API

### Système de Points

```javascript
calculateLoyaltyPoints(cart: Array<Product>): number
```

- **Input**: Array de produits `{ type: string, price: number }`
- **Output**: Nombre total de points
- **Erreurs**: Retourne 0 pour les entrées invalides

### Gestion des Abonnements

```javascript
canRenewSubscription(subscription: Subscription, currentDate: string): boolean
getRenewalReason(subscription: Subscription, currentDate: string): string
```

- **Input**: 
  - `subscription`: Objet abonnement
  - `currentDate`: Date au format 'YYYY-MM-DD'
- **Output**: 
  - `boolean` pour canRenew
  - `string` message pour getReason

## 🔄 Approche TDD

1. **RED** : Écrire un test qui échoue
2. **GREEN** : Implémenter le minimum pour passer
3. **REFACTOR** : Améliorer sans casser les tests

## 📊 Performance

Les tests vérifient que le système :
- Traite 1000 produits en < 100ms
- Valide 1000 abonnements efficacement

### Résultats de Performance

```bash
npx jest -t "Performance"
```

## 🧰 Outils Utilisés

- **Jest** : Framework de test
- **Babel** : Transpilation JavaScript
- **VS Code** : Environnement de développement

## 📝 Notes de Développement

- Les points sont arrondis à l'entier inférieur
- Les dates utilisent le format ISO 'YYYY-MM-DD'
- La validation des entrées est stricte
- Les tests couvrent les cas limites et erreurs
