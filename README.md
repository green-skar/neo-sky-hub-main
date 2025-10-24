# Neo Card™ User Dashboard

A comprehensive digital loyalty card dashboard built with React, TypeScript, and Tailwind CSS. This dashboard provides users with complete visibility and control over their digital loyalty card experience with 9 integrated sections.

## ✨ Features

### 🎯 Core Features
- **9-Section Navigation**: Intuitive sidebar menu with Overview, Scan History, Rewards, M-Pesa, Audit Proofs, Blocked Cards, Notifications, Media Library, and Settings
- **Mobile-Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Data Visualization**: Interactive charts and statistics for user activity and rewards
- **Demo Mode**: Complete mock data system for development and testing

### 🔧 Technical Features
- **Service Layer Architecture**: Clean separation between UI and data access
- **Mock Service Worker (MSW)**: Simulates real API calls with realistic delays and error handling
- **Interactive Components**: 
  - Functional map integration with React Leaflet
  - Video player with HTML5 video element
  - File upload system with React Dropzone
  - AI chat interface with mock responses
- **Blockchain Integration**: Simulated hash verification and audit trails
- **M-Pesa Payment Processing**: Mock payment flows and transaction history

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: React Query (TanStack Query)
- **Maps**: React Leaflet, Leaflet
- **Media**: React Player, React Dropzone
- **Mocking**: Mock Service Worker (MSW), Faker.js
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd neo-sky-hub-main
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:8080` to view the dashboard.

### Demo Mode

The application runs in demo mode by default with `VITE_DEMO=1` in the `.env` file. This provides:
- Mock API responses with realistic delays
- Sample data for all sections
- Simulated user interactions
- No backend required

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── MapView.tsx     # Interactive map component
│   ├── VideoPlayer.tsx # Video player component
│   ├── FileUpload.tsx  # File upload component
│   └── AIChat.tsx      # AI chat interface
├── pages/              # Page components (9 sections)
├── services/           # API service layer
├── mocks/              # Mock data and MSW handlers
├── types/              # TypeScript type definitions
└── setup/              # MSW initialization
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Sections Overview

1. **Overview/My NeoCard** - User profile, stats, recent scans, charts
2. **Scan History** - Timeline of QR/NFC scans with map integration
3. **Rewards & Ladder** - Level progression, rewards gallery, achievements
4. **M-Pesa & Payouts** - Earnings dashboard, transaction history, verification
5. **Audit Proofs** - Blockchain hash records, verification tools
6. **Blocked/Lost Cards** - Card status management, reactivation workflow
7. **Notifications & Alerts** - AI-powered categorization, preferences
8. **Media & DroneShow Replay** - Media gallery, video player, file upload
9. **Settings & AI Support** - User preferences, AI chat interface

## Backend Integration

To connect to a real backend:

1. Set `VITE_DEMO=0` in `.env`
2. Update `VITE_API_URL` to your backend endpoint
3. Implement the API endpoints as defined in the service layer
4. The service layer will automatically switch from mock to real API calls

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
