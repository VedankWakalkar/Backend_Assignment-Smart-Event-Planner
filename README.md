# 🌤️ Smart Event Planner – Backend API

An intelligent event planning backend built with **Node.js**, **Express**, and **MongoDB**, integrating **OpenWeatherMap** to help users plan outdoor events based on real-time and forecasted weather conditions. Supports weather scoring, event recommendations, and optional Redis caching.

---

## 📦 Features

### ✅ Core Functionalities

- **Create / Update / View Events** with type, date, and location
- **Weather API Integration** (OpenWeatherMap – 5-day forecast)
- **Suitability Scoring** (Good / Okay / Poor) based on event type
- **Alternative Date Suggestions** (within 5-day window)
- **Hourly Forecast Breakdown** for event date

### ⚡ Optional (Implemented)

- **Redis Caching** for weather forecasts & suitability scoring
- **Extra Credit Feature:** Hourly weather breakdown per event

---

## 🏗️ Tech Stack

| Layer        | Technology          |
| ------------ | ------------------- |
| Backend      | Node.js, Express.js |
| Database     | MongoDB (Mongoose)  |
| Caching      | Redis               |
| Weather API  | OpenWeatherMap      |
| Validation   | Zod                 |
| Testing Tool | Postman             |

---

## 📁 Project Structure

```
smart-event-planner/
├── controllers/         # Route handlers
├── models/              # Mongoose schemas
├── routes/              # API route definitions
├── services/            # Weather API logic
├── utils/               # Cache helpers and weather scoring
├── validations/         # Zod schemas
├── config/              # Redis client setup
├── .env                 # API keys and DB URL
├── app.js               # Express setup
└── server.js            # Entry point
```

---

## 🔐 Environment Variables

Create a `.env` file:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-events
OPENWEATHER_API_KEY=your_openweather_api_key
```

---

## 🔁 API Endpoints

### 📁 Event Management

| Method | Endpoint      | Description        |
| ------ | ------------- | ------------------ |
| `POST` | `/events`     | Create a new event |
| `GET`  | `/events`     | Get all events     |
| `PUT`  | `/events/:id` | Update an event    |

### 🌦️ Weather & Analysis

| Method | Endpoint                       | Description                     |
| ------ | ------------------------------ | ------------------------------- |
| `GET`  | `/weather/:location/:date`     | Get weather forecast for a date |
| `POST` | `/events/:id/weather-check`    | Link weather to event           |
| `GET`  | `/events/:id/suitability`      | Get suitability score           |
| `GET`  | `/events/:id/alternatives`     | Suggest better dates            |
| `GET`  | `/events/:id/hourly-breakdown` | Get hourly weather breakdown    |

---

## 🔁 Redis Caching (Implemented)

| Cache Key                   | Stores                  |
| --------------------------- | ----------------------- |
| `weather:<location>:<date>` | Filtered forecast list  |
| `suitability:<eventId>`     | Event suitability score |

Cache TTL = 6 hours.

---

## 🔬 Weather Suitability Scoring

| Metric        | Ideal          | Points |
| ------------- | -------------- | ------ |
| Temperature   | 15–30°C        | 30     |
| Precipitation | < 20%          | 25     |
| Wind Speed    | < 20 km/h      | 20     |
| Condition     | Clear / Clouds | 25     |

Thresholds:

- `>= 80` → Good
- `50–79` → Okay
- `< 50` → Poor

---

## 📦 Installation & Running

```bash
# Install dependencies
npm install

# Start Redis server (if installed locally)
redis-server

# Start app (with nodemon for development)
npm run dev
```

---

## 📮 Postman Collection

A full Postman collection is available to test:

- Create & Update Events
- Get Weather
- Run Weather Check
- View Suitability
- Get Alternatives
- View Hourly Breakdown

👉 _[You can export this from Postman or request a `.json` export]_

---

## ✅ Test Scenarios

- ✅ Create a sports event in Mumbai on June 12
- ✅ Get weather and suitability score
- ✅ Suggest alternative dates if weather is poor
- ✅ View hour-by-hour forecast
- ✅ Redis hits on second calls

---

## ✨ Extra Credit Implemented

- ✅ **Hourly Breakdown of Forecast**
- ✅ **Redis Caching for Weather + Suitability**

---

## 🚀 Future Improvements

- [ ] Smart Notifications (email/SMS alerts)
- [ ] Historical weather comparison
- [ ] UI Dashboard
- [ ] User Authentication + Event Ownership

---

## 👤 Author

**Vedank Wakalkar**  
Full-stack & AI/ML Enthusiast  
📧 Contact: [vedankwakalkar@gmail.com](mailto:vedankwakalkar@gmail.com)

---

## 📜 License

MIT – feel free to use, fork, or contribute.
