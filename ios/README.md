# Pic N Eat - AI-Powered Nutrition Tracker

A mobile-first nutrition tracking application designed for Purdue dining that uses AI to identify food from photos and track calories, protein, carbs, and fats.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [How It Works](#how-it-works)
- [API Endpoints](#api-endpoints)
- [ML Model](#ml-model)
- [Data Storage](#data-storage)

---

## Overview

Pic N Eat helps users track their daily nutrition intake by:
1. Taking photos of their meals
2. Getting instant AI-powered food identification
3. Logging nutritional information (calories, protein, carbs, fats)
4. Tracking progress toward personalized daily goals

The app calculates personalized calorie targets based on user profile data including gender, height, weight, activity level, and fitness goals.

---

## Features

- **Photo-based meal logging**: Take a picture, analyze it, log the meal
- **Personalized calorie goals**: Calculated using the Mifflin-St Jeor equation
- **Daily nutrition tracking**: Track calories, protein, carbs, and fats
- **No authentication required**: All data stored locally for privacy
- **Mobile-first design**: Optimized for iPhone and mobile devices
- **Real-time progress ring**: Visual calorie tracking with animated progress

---

## Project Structure

```
pic-n-eat/
├── client/                    # FRONTEND (React + Vite)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ui/            # Shadcn/UI component library
│   │   │   ├── layout.tsx     # Main app layout with bottom nav
│   │   │   └── bottom-nav.tsx # Navigation bar component
│   │   ├── pages/             # Application pages
│   │   │   ├── onboarding/    # Onboarding flow (5 steps)
│   │   │   │   ├── gender.tsx
│   │   │   │   ├── workouts.tsx
│   │   │   │   ├── goals.tsx
│   │   │   │   ├── height-weight.tsx
│   │   │   │   ├── calculate.tsx   # Calorie calculation logic
│   │   │   │   └── complete.tsx
│   │   │   ├── welcome.tsx    # Landing page
│   │   │   ├── home.tsx       # Main dashboard
│   │   │   ├── camera.tsx     # Photo capture & analysis
│   │   │   ├── search.tsx     # Food search
│   │   │   └── leaderboard.tsx
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility functions
│   │   ├── App.tsx            # Main app with routing
│   │   └── main.tsx           # Entry point
│   └── index.html
│
├── server/                    # BACKEND (Express.js)
│   ├── index.ts               # Server entry point
│   ├── routes.ts              # API route definitions
│   ├── storage.ts             # Database operations (Drizzle ORM)
│   ├── db.ts                  # Database connection
│   └── vite.ts                # Vite dev server integration
│
├── shared/                    # SHARED (Types & Schemas)
│   ├── schema.ts              # Drizzle database schemas
│   └── models/
│       └── auth.ts            # User authentication models
│
├── ml/                        # MACHINE LEARNING
│   ├── model.py               # CNN model architecture & inference
│   ├── train_model.py         # Training script (downloads data from GitHub)
│   ├── inference_server.py    # Flask server for ML predictions
│   └── README.md              # ML-specific documentation
│
└── attached_assets/           # Static assets (images, icons)
```

---

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Wouter** - Lightweight routing
- **Framer Motion** - Animations
- **TailwindCSS** - Styling
- **Shadcn/UI** - Component library
- **TanStack Query** - Data fetching

### Backend
- **Express.js** - Web server
- **Drizzle ORM** - Database ORM
- **PostgreSQL** - Database (ready but not used - see Data Storage)
- **TypeScript** - Type safety

### Machine Learning
- **PyTorch** - Deep learning framework
- **FoodCNN** - Custom 3-layer CNN for food classification
- **Classes**: Pancake, Pasta, Pizza

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open the app at `http://localhost:5000`

### Running the ML Model (Optional)

The ML model requires PyTorch. To train:

```bash
cd ml
python train_model.py
```

This downloads training data from GitHub and trains a CNN model.

---

## How It Works

### 1. Onboarding Flow

Users go through a 5-step onboarding process:

1. **Gender Selection** - Stored in `localStorage.onboarding_gender`
2. **Workout Frequency** - Stored in `localStorage.onboarding_workouts`
3. **Fitness Goal** - Stored in `localStorage.onboarding_goal`
4. **Height & Weight** - Stored in `localStorage.onboarding_height/weight`
5. **Calculation** - Computes personalized calorie target

### 2. Calorie Calculation Logic

The app uses the **Mifflin-St Jeor Equation** to calculate daily calorie needs:

```
Location: client/src/pages/onboarding/calculate.tsx
```

#### Step 1: Calculate BMR (Basal Metabolic Rate)

```javascript
// For males:
BMR = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5

// For females:
BMR = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 161
```

#### Step 2: Apply Activity Multiplier (TDEE)

| Workouts/Week | Multiplier | Activity Level |
|---------------|------------|----------------|
| 0             | 1.2        | Sedentary      |
| 1-2           | 1.375      | Light          |
| 3-4           | 1.55       | Moderate       |
| 5+            | 1.725      | Active         |

```javascript
TDEE = BMR * activity_multiplier
```

#### Step 3: Adjust for Goal

| Goal     | Adjustment        |
|----------|-------------------|
| Lose     | TDEE - 500 cal    |
| Maintain | TDEE (no change)  |
| Gain     | TDEE + 300 cal    |

### 3. Food Photo Analysis

```
Location: client/src/pages/camera.tsx
```

1. User captures a photo using device camera
2. Photo is sent to `/api/predict` endpoint
3. Server returns food prediction with nutritional data
4. User reviews and confirms to log the meal

### 4. Meal Logging

Logged meals are stored in `localStorage.logged_meals` as JSON:

```javascript
{
  id: timestamp,
  image: base64_image_data,
  name: "Pizza",
  calories: 285,
  protein: 12,
  carbs: 36,
  fats: 10,
  timestamp: ISO_date_string
}
```

### 5. Daily Tracking

The home page (`home.tsx`) aggregates all logged meals to show:
- Total calories consumed vs target
- Total protein, carbs, fats
- Visual progress ring

---

## API Endpoints

### POST `/api/predict`

Analyzes a food image and returns nutritional prediction.

**Request:**
```json
{
  "image": "base64_encoded_image_data"
}
```

**Response:**
```json
{
  "food_name": "Pizza",
  "calories": 285,
  "protein": 12,
  "carbs": 36,
  "fats": 10,
  "confidence": 85
}
```

### POST `/api/log-meal`

Logs a meal (currently returns success, actual storage on client).

**Request:**
```json
{
  "name": "Pizza",
  "calories": 285,
  "protein": 12,
  "carbs": 36,
  "fats": 10,
  "image": "base64_data"
}
```

---

## ML Model

### Current Status: Mock Predictions

The ML infrastructure is **ready but not active** due to PyTorch platform compatibility issues in the deployment environment.

**What's implemented:**
- `ml/model.py` - FoodCNN architecture for inference
- `ml/train_model.py` - Training script that downloads data from GitHub
- `ml/inference_server.py` - Flask server for serving predictions

**What's used instead:**
- Mock predictions in `server/routes.ts` that randomly select from predefined foods
- Each food has hardcoded nutritional data

### Model Architecture

```python
FoodCNN:
  Conv2d(3, 16, kernel=3, padding=1) + ReLU + MaxPool2d(2)
  Conv2d(16, 32, kernel=3, padding=1) + ReLU + MaxPool2d(2)
  Conv2d(32, 64, kernel=3, padding=1) + ReLU + MaxPool2d(2)
  Flatten
  Linear(64*16*16, 128) + ReLU
  Linear(128, 3) -> [pancake, pasta, pizza]
```

- **Input**: 128x128 RGB images
- **Output**: 3-class probabilities
- **Training data**: https://github.com/mahekparvez/v3picneat.git

### To Activate Real ML Predictions

1. Train the model locally:
   ```bash
   cd ml
   python train_model.py
   ```

2. Upload `food_classifier.pth` to the `ml/` folder

3. Update `server/routes.ts` to call the Python inference server

### Nutrition Data

Hardcoded per food class in `ml/model.py`:

| Food     | Calories | Protein | Carbs | Fats |
|----------|----------|---------|-------|------|
| Pancake  | 227      | 6g      | 28g   | 10g  |
| Pasta    | 320      | 12g     | 58g   | 4g   |
| Pizza    | 285      | 12g     | 36g   | 10g  |

---

## Data Storage

### Current: localStorage (No Authentication)

All user data is stored in the browser's localStorage:

| Key                      | Description                    |
|--------------------------|--------------------------------|
| `onboarding_gender`      | User's gender                  |
| `onboarding_workouts`    | Workouts per week              |
| `onboarding_goal`        | Fitness goal (lose/maintain/gain) |
| `onboarding_height`      | Height in ft/in                |
| `onboarding_weight`      | Weight in lbs                  |
| `user_bmr`               | Calculated BMR                 |
| `user_tdee`              | Calculated TDEE                |
| `user_target_calories`   | Daily calorie target           |
| `logged_meals`           | Array of logged meals (JSON)   |

### Database Schema (Ready for Future Use)

PostgreSQL tables are defined in `shared/schema.ts`:

- **user_profiles**: Stores user profile data, BMR, TDEE, targets
- **meals**: Stores meal logs with nutritional data

The database infrastructure is fully set up but currently unused to allow the app to work without authentication.

---

## Design Decisions

1. **No Authentication**: Simplifies UX for demo/prototype purposes
2. **localStorage**: Fast, works offline, no backend dependency
3. **Mock ML Predictions**: Ensures app works without PyTorch dependencies
4. **Mobile-First**: Designed for iPhone screens
5. **Mifflin-St Jeor**: Industry-standard BMR calculation formula

---

## Future Enhancements

- [ ] Integrate real PyTorch model predictions
- [ ] Add OpenAI Vision API for better food recognition
- [ ] Enable user authentication for data sync
- [ ] Add meal history and weekly reports
- [ ] Expand food database beyond 3 classes

---

## License

MIT License

---

## Contributors

- Built with Replit Agent
