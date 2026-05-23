# Personal Finance Dashboard

A "Should I buy/do this now?" dashboard for everyday users. Combines real-time market signals with personal financial data to give simple Yes/No/Wait answers.

## 🎯 MVP Features

- **Precious Metals & Jewelry Signals**: Gold, Silver, and Diamond buying signals
- **Finance Health Score**: Personal financial health assessment (0-100)
- **Travel Planner**: Trip cost estimation and affordability check
- **Responsive UI**: Built with React and Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React 18, Tailwind CSS, Vite
- **Backend**: Node.js, Express
- **APIs**: Alpha Vantage, Metals-API, Twelve Data (to be integrated)

## 📁 Project Structure

```
gold/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MetalsSignal.jsx
│   │   │   ├── FinanceHealthScore.jsx
│   │   │   └── TravelPlanner.jsx
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── metalSignals.js
│   │   │   └── travel.js
│   │   ├── controllers/
│   │   │   ├── signalsController.js
│   │   │   └── travelController.js
│   │   ├── utils/
│   │   │   ├── priceApis.js
│   │   │   ├── signalGenerator.js
│   │   │   └── travelEstimator.js
│   │   └── index.js
│   ├── .env
│   └── package.json
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install Backend Dependencies**

```bash
cd backend
npm install
```

2. **Install Frontend Dependencies**

```bash
cd ../frontend
npm install
```

### Running the Application

1. **Start Backend Server** (from `backend/` directory)

```bash
npm run dev
```

The server will run on `http://localhost:5001`

2. **Start Frontend Dev Server** (from `frontend/` directory in a new terminal)

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Running with Docker

From the project root:

```bash
docker compose up --build
```

Then open:

- `http://localhost:3000` for the frontend
- `http://localhost:5001/api/health` for the backend health check

## 🔄 API Endpoints

### Metal Signals

- `GET /api/signals/metals` - Get current precious metal signals

### Travel

- `POST /api/travel/estimate` - Calculate trip cost estimate

## 📝 Environment Variables

### Backend (.env)

- `PORT` - Server port (default: 5000)
- `ALPHA_VANTAGE_KEY` - API key for stock/forex data
- `METALS_API_KEY` - API key for metal prices
- `TWELVE_DATA_KEY` - API key for market data

### Frontend (.env)

- `VITE_API_URL` - Backend API URL

## 🎨 Features Roadmap

### Phase 1 (MVP - Current)

- [x] Metal signals (Gold, Silver, Diamond)
- [x] Finance health score
- [x] Travel planner (basic)

### Phase 2

- [ ] Fixed deposit interest rates analysis
- [ ] Index fund/ETF recommendation engine
- [ ] Crypto signals
- [ ] Government bonds signals
- [ ] Real estate affordability calculator

### Phase 3

- [ ] User authentication
- [ ] Data persistence
- [ ] Email alerts
- [ ] Advanced trip tracker

## 💡 How It Works

1. **User enters financial data** (income, expenses, savings, debt)
2. **System calculates Finance Health Score** (0-100)
3. **App fetches real-time market data** via public APIs
4. **Signals generated** (YES/NO/WAIT) based on:
    - Market trends
    - User's financial health
    - Seasonal factors
5. **Simple one-line reason** provided for each signal

## 🔐 Privacy

- No data selling - transparent storage policy
- Option for local vs cloud storage (future)

## 📦 Monetization (Future)

- Freemium model: Basic signals free, premium alerts for $9/mo
- Affiliate partnerships with jewelry retailers and travel platforms
- Retailer subscriptions for targeted marketing

## 🤝 Contributing

Contributions are welcome! Please follow the existing code style.

## 📄 License

MIT License

## 📞 Support

For issues or questions, please open an issue or contact the development team.

---

**Note**: This is an MVP. Many features are mocked with sample data. Real API integrations coming soon.
