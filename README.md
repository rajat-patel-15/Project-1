# EcoTrack: Assessment & Action of Environmental Awareness Among Students

> **Bridging the gap between 95% environmental awareness and 45% actual recycling participation among college students through physical QR verification, transparent gamification, and campus-level institutional analytics.**

---

## 🌿 Executive Summary & Research Context

Extensive collegiate sustainability surveys consistently reveal a striking **"Awareness–Action Paradox"**:
- **95%** of enrolled university students express concern for the climate crisis and understand the conceptual importance of waste segregation.
- Only **45%** of students routinely practice physical recycling in their residence halls, campus quads, and dining centers.

**EcoTrack** closes this 50-percentage-point behavioral chasm through a transdisciplinary system intersecting four academic domains:
1. **Environmental Science**: Granular waste characterization, contamination prevention (anti-wishcycling), and closed-loop EPA WARM carbon avoidance models.
2. **Behavioral Psychology**: Nudge theory, habit loop conditioning, loss-aversion streak mechanics, and positive peer comparison via public leaderboards.
3. **Computer Science**: Robust React + TypeScript single-page architecture, camera-based physical QR station verification, deterministic calculation engine, and Zod payload schema validation.
4. **Data Science**: Longitudinal telemetry, campus-wide waste flow auditing, and institutional ESG accreditation reporting.

---

## 🚀 Key Features

### 1. Student Action Portal & Telemetry
- **Live Stats Cards**: Real-time display of Eco Points, Total Activities Count, Institutional Rank, and Active Daily Streak.
- **Badge Progress Bar**: Dynamic milestone indicator (e.g. *80 points away from Green Champion*).
- **Physical QR Station Verification**: Live webcam optical scanner (`html5-qrcode`) and manual fallback verifying campus stations (`BIN-COLLEGE-001`, `BIN-HOSTEL-003`, `BIN-LIBRARY-002`, `BIN-CAFETERIA-004`, `BIN-SCI-005`).
- **Interactive Log Modal with Live Preview**: Deterministic preview calculates exact points (`Math.round(basePoints * quantityMultiplier)`) and estimated weight before submission.

### 2. Waste Literacy Engine ("Can I Recycle This?")
- **5 Segregation Guidelines**: Dedicated guidance cards for Plastic (#1–#5), Paper & Cardboard, Metal & Aluminum, Glass, and Hazardous E-Waste.
- **Campus Dictionary (32 Items)**: Real-time fuzzy search for common collegiate items (takeaway coffee cups, greasy pizza boxes, lithium batteries, USB cables, thermal receipts, notebooks, etc.) with prep steps and common misconception warnings.

### 3. Gamification & Community Challenges
- **Dynamic Leaderboard**: Real-time student ranking with Weekly, Monthly, and All-Time filters. Automatically highlights the logged-in student's standing.
- **Eco Challenges State Machine**: Interactive challenges (`Available` ➔ `Joined` ➔ `Claim Reward` ➔ `Completed`) preventing duplicate reward exploits.
- **Automated Badge Hooks**: Deterministic badges evaluated on every write:
  - `ECO_STARTER`: Unlocked on 1st recycling log.
  - `RECYCLER`: Unlocked on 10th recycling log.
  - `GREEN_CHAMPION`: Unlocked at 500+ total points.
  - `ECO_STREAK`: Unlocked at 7+ consecutive active days.
  - `SUSTAINABILITY_LEADER`: Unlocked for Top 3 campus ranking.

### 4. Personal Impact Analytics ("My Impact")
- Powered by **Recharts**:
  - **Doughnut Chart**: Stream distribution across Plastic, Paper, Glass, Metal, E-Waste, and Other.
  - **Area Trajectory**: 14-day longitudinal activity cadence.
  - **Monthly Bar Chart**: Semester credit accumulation.
  - **Scientific Metrics**: Estimated kilograms diverted, avoided CO₂e emissions, and trees preserved.

### 5. Institutional College Admin Dashboard
- **Institutional KPIs**: Registered Students, Active Recycling Participation Rate %, Total Diverted Mass (kg), Total Distributed Points.
- **Live Campus Audit Table**: Full tabular audit log with column filters (Category, Location, Date Range), student identification, and 1-click **Export to CSV**.
- **Challenge Publisher**: Admin interface to create and broadcast new campus environmental challenges.
- **Database Reset**: 1-click tool to restore pristine research demo state.

---

## 🛠️ Tech Stack Specification

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 18, Vite 5, TypeScript |
| **Styling & Design System** | Tailwind CSS 3.4, Custom Eco Tokens, Glassmorphism, Micro-animations |
| **Icons & UI Assets** | Lucide React |
| **Data Visualizations** | Recharts (Responsive Pie, Area, Bar, and Cartesian Grids) |
| **Physical Verification** | HTML5-QRCode (Webcam video stream decoder + manual fallback) |
| **Validation Engine** | Zod (Type-safe schemas for logs, challenges, auth, and QR) |
| **Celebratory Feedback** | Canvas-Confetti |
| **Persistence Layer** | Reactive LocalStorage / IndexedDB service with seed fallback and data events |

---

## 📁 Directory Structure

```
EcoTrack/
├── index.html                   # HTML entry point with Inter font & SEO meta tags
├── package.json                 # Dependency definitions & scripts
├── tsconfig.json                # TypeScript bundler compiler configuration
├── vite.config.ts               # Vite configuration with path aliases
├── tailwind.config.js           # Eco-palette color system and shadows
├── postcss.config.js            # PostCSS Autoprefixer plugin
└── src/
    ├── main.tsx                 # React DOM mount with AuthProvider
    ├── App.tsx                  # Tab router & modal coordinator
    ├── types/
    │   └── index.ts             # TypeScript entity models and enums
    ├── constants/
    │   ├── gamification.ts      # Base points, multipliers, badges, bin stations, 32-item dictionary
    │   └── seedData.ts          # 10 realistic students, 27+ historical logs, initial badges
    ├── utils/
    │   ├── calculations.ts      # Deterministic formulas: points, streaks, badges, EPA WARM models
    │   └── validation.ts        # Zod validation schemas
    ├── services/
    │   ├── storage.ts           # Client-side DB engine with automatic seeding and reset
    │   └── api.ts               # Service layer simulating REST API endpoints with latency
    ├── context/
    │   └── AuthContext.tsx      # Auth, RBAC, 1-click demo profiles, toast queue
    ├── styles/
    │   └── index.css            # Tailwind directives, eco-components, scrollbars
    └── components/
        ├── common/
        │   ├── Navbar.tsx       # Brand header, demo switcher, tab navigation
        │   ├── Modal.tsx        # Accessible reusable modal dialog
        │   └── Toast.tsx        # Animated feedback notifications
        ├── auth/
        │   └── AuthModal.tsx    # Sign in, student registration, and 1-click demo buttons
        ├── dashboard/
        │   ├── StudentDashboard.tsx   # Top stats cards, milestone progress, recent logs
        │   ├── LogRecyclingModal.tsx  # Waste log form with live deterministic preview
        │   └── QRScannerModal.tsx     # Live camera optical scanner + test stations
        ├── education/
        │   └── EducationEngine.tsx    # Segregation cards & real-time item lookup
        ├── gamification/
        │   └── GamificationPortal.tsx # Leaderboard & challenges state machine
        ├── analytics/
        │   └── PersonalAnalytics.tsx  # Recharts doughnut, area, and bar telemetry
        ├── admin/
        │   └── AdminDashboard.tsx     # Institutional KPIs, live audit table, CSV export
        └── research/
            └── ResearchContextModal.tsx # Transdisciplinary academic context & 4 pillars
```

---

## 🧮 Mathematical Gamification Engine

### 1. Base Points by Category
- **Plastic**: `10 pts`
- **Paper**: `8 pts`
- **Glass**: `12 pts`
- **Metal**: `15 pts`
- **E-Waste**: `25 pts`
- **Other**: `5 pts`

### 2. Quantity Brackets & Multipliers
- `<100g` (Est. 50g): `1.0x`
- `100–500g` (Est. 300g): `1.5x`
- `500g–1kg` (Est. 750g): `2.5x`
- `1–5kg` (Est. 3,000g): `4.0x`
- `>5kg` (Est. 6,000g): `5.0x`

$$\text{pointsEarned} = \operatorname{round}(\text{basePoints} \times \text{quantityMultiplier})$$

### 3. Streak Calculation
- If $\Delta\text{days}(\text{today}, \text{lastActiveDate}) = 1$ (yesterday): `streakCount += 1`.
- If $\Delta\text{days}(\text{today}, \text{lastActiveDate}) = 0$ (today): keep streak.
- If $\Delta\text{days} > 1$ or unrecorded: reset `streakCount = 1`.

---

## 🔑 Demo Access & Seed Profiles

The app includes **1-Click Demo Logins** directly in the top header and in the Auth Modal:

### 1. Demo Student
- **Name**: Aarav Sharma
- **Email**: `student@ecotrack.demo`
- **Password**: `student123`
- **Preloaded Metrics**: 420 base points, 17 verified historical logs, Rank #8, 6-day active streak.

### 2. Demo Admin
- **Name**: Dr. Evelyn Vance (Campus Sustainability Dean)
- **Email**: `admin@ecotrack.demo`
- **Password**: `admin123`
- **Capabilities**: Full access to institutional KPIs, campus stream telemetry, live audit table, challenge creation, and database reset.

### 3. Additional Seeded Cohort (10 Students)
- Riya Patel (`890 pts`, Rank #1, 14-day streak)
- Kabir Mehta (`760 pts`, Rank #2)
- Ananya Roy (`685 pts`, Rank #3)
- Rahul Verma (`540 pts`, Rank #4)
- Priya Iyer (`510 pts`, Rank #5)
- Arjun Das (`475 pts`, Rank #6)
- Aarav Sharma (`420 pts`, Rank #7/8)
- Sneha Kulkarni (`360 pts`)
- Aditya Singh (`290 pts`)
- Neha Kapoor (`210 pts`)

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js `v18+` or `v20+`
- npm `v9+` or `v10+`

### Installation
```bash
# 1. Clone repository or navigate to directory
cd EcoTrack

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Visit **`http://localhost:3000`** in your browser.

### Production Build
```bash
# Type check and build optimized bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📜 Research Compliance & ESG Auditing
EcoTrack formats all tabular entries to meet university Sustainability Tracking, Assessment & Rating System (STARS) criteria for Operations (OP-19: Waste Minimization and Diversion).
