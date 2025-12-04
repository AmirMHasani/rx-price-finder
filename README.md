# RxPriceFinder 💊

**Insurance-Based Prescription Price Comparison Platform**

Find the lowest prescription prices at local pharmacies based on your insurance coverage. Compare real-time prices across CVS, Walgreens, Walmart, Costco, and independent pharmacies.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev/)

---

## ✨ Features

### 🔍 Smart Medication Search
- **Real FDA Data**: RxNorm API integration with 100,000+ medications
- **Fast Search**: 2-character minimum with intelligent debouncing
- **Clean Results**: Automatic removal of technical jargon and chemical names
- **Popular Suggestions**: Common medications highlighted with badges

### 💰 4-Tier Pricing Comparison
1. **RxPrice Member**: Exclusive 20% discount from insurance copay
2. **Coupon Price**: GoodRx, SingleCare, and RxSaver integration
3. **Insurance Copay**: Real copay based on your plan and formulary tier
4. **Cash Price**: Retail price for uninsured patients

### 🏥 Real Pharmacy Locations
- **Live Data**: Google Places API for actual pharmacy locations
- **Interactive Map**: Color-coded markers with distance filtering
- **Pharmacy Features**: 24-hour, drive-thru, and delivery options
- **Major Chains**: CVS, Walgreens, Walmart, Costco, Rite Aid, and independents

### 🩺 Patient Dashboard
- **Search History**: Track and favorite your medication searches
- **Savings Tracker**: Monitor estimated savings over time
- **Medical Profile**: Store medical history, allergies, and current medications
- **Pharmacogenomics**: Gene-drug interaction dashboard (PGx testing)

### 🌐 Bilingual Support
- Full English and Spanish translations
- Persistent language preference
- 70+ translation keys

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 22+ (LTS recommended)
- **pnpm** 9+ (package manager)
- **MySQL** 8+ or **TiDB** (database)

### Installation

```bash
# Clone the repository
git clone https://github.com/AmirMHasani/rx-price-finder.git
cd rx-price-finder

# Install dependencies
pnpm install

# Set up environment variables (see .env.example)
cp .env.example .env

# Initialize database
pnpm db:push

# Start development server
pnpm dev
```

The app will be available at `http://localhost:3000`

### Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/rxpricefinder

# Authentication
JWT_SECRET=your-secret-key-here
OAUTH_SERVER_URL=https://your-oauth-server.com

# Google Maps (for pharmacy locations)
Google_RxPrice_Places=your-google-places-api-key

# App Configuration
VITE_APP_TITLE=RxPriceFinder
VITE_APP_LOGO=/logo.svg
```

---

## 🏗️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript 5.7** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui** - Component library
- **Wouter** - Lightweight routing
- **tRPC** - Type-safe API client

### Backend
- **Express 4** - Web server
- **tRPC 11** - Type-safe API layer
- **Drizzle ORM** - Database toolkit
- **MySQL/TiDB** - Relational database
- **Manus OAuth** - Authentication provider

### APIs & Data Sources
- **RxNorm API** - FDA medication database
- **Google Places API** - Real pharmacy locations
- **Cost Plus Drugs API** - Wholesale pricing baseline
- **CMS NADAC API** - Pharmacy wholesale costs
- **Medicare Part D API** - Drug pricing data

---

## 📁 Project Structure

```
rx-price-finder/
├── client/                  # Frontend application
│   ├── src/
│   │   ├── pages/          # Page components
│   │   │   ├── SearchWithAPI.tsx    # Main search page
│   │   │   ├── Results.tsx          # Pharmacy results
│   │   │   ├── PatientInfo.tsx      # Patient profile
│   │   │   └── MyGenomic.tsx        # Pharmacogenomics
│   │   ├── services/       # API integration services
│   │   │   ├── medicationService.ts
│   │   │   ├── realPricingService.ts
│   │   │   ├── pharmacyService.ts
│   │   │   └── insuranceService.ts
│   │   ├── components/     # Reusable UI components
│   │   ├── data/           # Static data (insurance, medications)
│   │   └── translations/   # i18n translations (EN/ES)
│   └── public/             # Static assets
├── server/                  # Backend application
│   ├── routers.ts          # tRPC router definitions
│   ├── db.ts               # Database helpers
│   ├── services/           # Backend services
│   └── routes/             # Express routes
├── drizzle/                # Database schema and migrations
│   ├── schema.ts           # Database tables
│   └── migrations/         # Migration files
└── shared/                 # Shared types and constants
```

---

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

**Test Coverage**: 60+ unit tests covering medication search, pricing calculations, insurance logic, and pharmacy features.

---

## 📊 Pricing Algorithm

The pricing engine uses a multi-layer fallback system to ensure accurate prices:

1. **Cost Plus Drugs API** - Wholesale baseline for 800+ medications
2. **Brand Medication Database** - Curated pricing for 25+ expensive brand drugs
3. **CMS NADAC API** - National Average Drug Acquisition Cost
4. **Medicare Part D API** - Government drug pricing data
5. **CMS Regional Pricing** - State-level historic pricing (24-hour cache)
6. **Fallback Estimation** - Generic estimation ($0.25/pill) as last resort

### Pharmacy Markups
- **Costco**: 15% (lowest markup)
- **Walmart**: 20%
- **Sam's Club**: 18%
- **CVS**: 45% (highest markup)
- **Walgreens**: 40%
- **Rite Aid**: 38%

Markups are deterministic (hash-based) to ensure consistent pricing across sessions.

---

## 🔒 Security & Privacy

- **HIPAA Considerations**: No PHI stored without explicit consent
- **Data Encryption**: All sensitive data encrypted at rest and in transit
- **OAuth Authentication**: Secure third-party authentication via Manus OAuth
- **Session Management**: httpOnly cookies with JWT tokens
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive input sanitization

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`pnpm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **RxNorm API** by National Library of Medicine
- **Google Places API** for pharmacy location data
- **Cost Plus Drugs** for transparent pricing data
- **CMS** for Medicare and NADAC pricing data
- **shadcn/ui** for beautiful UI components

---

## 📧 Contact

**Project Maintainer**: Amir M Hasani

**GitHub**: [@AmirMHasani](https://github.com/AmirMHasani)

**Repository**: [rx-price-finder](https://github.com/AmirMHasani/rx-price-finder)

---

## 🗺️ Roadmap

See [ROADMAP.md](ROADMAP.md) for planned features and enhancements.

### Coming Soon
- Real insurance formulary API integration
- Price drop alerts and notifications
- Mobile app (React Native)
- Prescription savings cards
- Pharmacy price history charts
- Drug interaction checker
