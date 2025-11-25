# RxPriceFinder

**Insurance-Based Prescription Price Comparison**

Find the cheapest pharmacy prices for your prescriptions based on your insurance coverage. Compare real insurance-based prices at local pharmacies and save hundreds of dollars per year.

![RxPriceFinder Screenshot](https://via.placeholder.com/800x400?text=RxPriceFinder+Screenshot)

## Features

- 🔍 **Real Medication Search** - Search from official FDA and RxNorm medication databases with partial matching
- 💊 **Smart Auto-Fill** - Automatic dosage and form suggestions based on selected medication
- 🏥 **Insurance-Based Pricing** - See actual prices based on your specific insurance plan, not just cash prices
- 📍 **Local Pharmacy Finder** - Find pharmacies near you with interactive Google Maps integration
- 💰 **Price Comparison** - Compare prices across 8+ pharmacies sorted by lowest price
- 📊 **Detailed Breakdown** - See cash price vs insurance price, copays, deductibles, and savings
- 🗺️ **Interactive Map** - View all pharmacy locations with price markers on Google Maps
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices

## How It Works

1. **Search for Your Medication** - Type the medication name (brand or generic) and select from real FDA database
2. **Select Dosage & Form** - Choose from available dosages and forms (tablet, capsule, etc.)
3. **Choose Your Insurance** - Select your insurance plan from 7 major carriers
4. **Compare Prices** - See prices from 8 local pharmacies sorted by lowest price
5. **Save Money** - Find the cheapest option and save up to $9+ per prescription

## Tech Stack

### Frontend
- **React 19** - Modern UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Wouter** - Lightweight routing
- **shadcn/ui** - Beautiful component library
- **Google Maps API** - Interactive pharmacy maps

### APIs & Data
- **RxNorm API** - Real medication data from National Library of Medicine
- **FDA NDC Directory** - Drug database
- **Google Places API** - Pharmacy location search
- **GoodRx API** (ready to integrate) - Cash pricing data

### Backend (Ready for Integration)
- **Mock Database** - In-memory storage (easily swappable with Supabase/PostgreSQL)
- **Authentication System** - User login/signup ready
- **Insurance Database** - 7 major insurance carriers with tier-based pricing

## Installation

### Prerequisites
- Node.js 18+ 
- pnpm (or npm/yarn)

### Setup

```bash
# Clone the repository
git clone https://github.com/AmirMHasani/rx-price-finder.git
cd rx-price-finder

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
# Build the app
pnpm build

# Preview production build
pnpm preview
```

## Project Structure

```
rx-price-finder/
├── client/                  # Frontend application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   └── ui/        # shadcn/ui components
│   │   ├── contexts/      # React contexts (Auth, Theme)
│   │   ├── data/          # Mock data (medications, insurance, pharmacies)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services and business logic
│   │   └── App.tsx        # Main app component
│   └── index.html         # HTML entry point
├── server/                 # Backend (placeholder for future API)
├── shared/                 # Shared types and constants
└── README.md              # This file
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Google Maps API (for pharmacy locations)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# GoodRx API (for cash prices)
VITE_GOODRX_API_KEY=your_goodrx_api_key

# Database (when ready to integrate)
DATABASE_URL=your_database_url
```

### API Keys Required

1. **Google Maps API** (Free tier available)
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Maps JavaScript API and Places API
   - Create API key
   - Add to `.env` as `VITE_GOOGLE_MAPS_API_KEY`

2. **GoodRx API** (Optional, for real cash prices)
   - Apply at [GoodRx Business API](https://www.goodrx.com/business/api)
   - Free tier: 100 requests/day
   - Add to `.env` as `VITE_GOODRX_API_KEY`

## Current Features

### ✅ Implemented
- Partial medication search with autocomplete
- Auto-fill dosage and form dropdowns
- 7 major insurance carriers (BCBS, UnitedHealthcare, Aetna, Cigna, Humana, Kaiser, Medicare)
- Insurance tier-based pricing calculation
- 8 local pharmacies in Boston area
- Interactive Google Maps with price markers
- Responsive design for all devices
- 47 unit tests for core functionality

### 🚧 Ready to Integrate (Requires API Keys)
- Real pharmacy location search via Google Places API
- Real cash prices via GoodRx API
- User authentication and saved searches
- Search history and favorite pharmacies
- Price alerts and notifications

### 📋 Future Enhancements (Requires Partnerships)
- Real insurance benefit verification (requires insurance carrier APIs)
- Real formulary checking (requires insurance APIs)
- Pharmacy inventory checking (requires pharmacy chain APIs)
- NCPDP integration for real insurance-based pricing

## Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

## API Integration Guide

### 1. Google Places API (Pharmacy Locations)

```typescript
// Already implemented in client/src/services/pharmacyService.ts
import { searchPharmacies } from '@/services/pharmacyService';

const pharmacies = await searchPharmacies('02108', 5); // ZIP code, radius in miles
```

### 2. GoodRx API (Cash Prices)

```typescript
// Already implemented in client/src/services/goodrxService.ts
import { getGoodRxPrice } from '@/services/goodrxService';

const price = await getGoodRxPrice('lipitor', '20mg', '02108');
```

### 3. RxNorm API (Medication Data)

```typescript
// Already implemented in client/src/services/medicationService.ts
import { searchMedications } from '@/services/medicationService';

const medications = await searchMedications('lipitor');
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **RxNorm API** - National Library of Medicine for medication data
- **FDA NDC Directory** - Drug database
- **shadcn/ui** - Beautiful component library
- **Google Maps** - Interactive maps and pharmacy locations

## Support

For questions or issues, please open an issue on GitHub.

## Roadmap

### Phase 1: MVP (Current)
- ✅ Basic medication search
- ✅ Insurance-based price estimation
- ✅ Local pharmacy comparison
- ✅ Interactive maps

### Phase 2: Real Data Integration (Next 4-8 weeks)
- 🔄 Google Places API for real pharmacy locations
- 🔄 GoodRx API for real cash prices
- 🔄 User authentication and saved searches
- 🔄 Search history and favorites

### Phase 3: Advanced Features (3-6 months)
- 📋 Real insurance benefit verification
- 📋 Formulary checking
- 📋 Price alerts and notifications
- 📋 Prescription upload via photo

### Phase 4: Enterprise (6-12 months)
- 📋 NCPDP membership for real insurance pricing
- 📋 Direct pharmacy chain partnerships
- 📋 Insurance carrier partnerships
- 📋 Mobile app (iOS/Android)

---

**Made with ❤️ by [Amir M Hasani](https://github.com/AmirMHasani)**
