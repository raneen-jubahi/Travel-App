
# Travel Planner App

## Introduction
The Travel Planner App helps users organize and plan their trips with ease. It allows users to manage their trips, whether they are scheduled for today, upcoming, or in the past. Users can also view the weather forecast for their travel dates using the Weatherbit API and fetch images of their destinations using the Pixabay API. The app stores trip data in the browser's local storage, providing data persistence across sessions.
## [Image showing the project](webpagescreen.png)
## Features
- **Add and Manage Trips:** Users can add, view, and delete trips.
- **Weather Forecast:** Displays weather forecasts for specific departure dates using the Weatherbit API.
- **Destination Images:** Fetches images of destinations or countries using the Pixabay API.
- **Local Storage:** Trips data is stored in the browser's local storage, allowing data persistence across sessions, so users don’t lose their data when they refresh or close the browser.
- **Offline Support:** Service Worker for caching assets and providing offline functionality.
- **Responsive Design:** Optimized for various devices, ensuring a seamless experience across desktops, tablets, and smartphones.
- **Testing:** Includes both client-side and server-side testing to ensure robustness and reliability.

## Technologies Used
### Frontend:
- **Sass:** For styling the application with modular and maintainable CSS.
- **Webpack:** Bundles JavaScript files and manages frontend assets.
- **Babel:** Transpiles modern JavaScript (ES6+) for compatibility across browsers.
- **Service Worker:** Provides offline functionality and caches assets for improved performance.

### Backend:
- **Express:** A lightweight web framework for setting up the server and handling API requests.
- **dotenv:** Manages environment variables securely.
- **cors:** Enables Cross-Origin Resource Sharing, allowing the API to be accessible from different domains.

### Testing:
- **Jest:** A testing framework for unit and integration tests.
- **Supertest:** A library for testing HTTP requests, particularly useful for API endpoints.

### APIs:
- **Weatherbit API:** Fetches weather data based on latitude and longitude obtained from the Geonames API.
- **Pixabay API:** Provides high-quality images for destinations or countries.
- **Geonames API:** Retrieves latitude and longitude for specified locations, supporting the weather data fetch.

## Installation
To run this project locally, follow these steps:

### Clone the repository:
```bash
git clone https://github.com/raneen-jubahi/Travel-App

### Navigate to the project directory:
```bash
cd travel app
```

### Install dependencies:
```bash
npm install
```

### Set Up Environment Variables:
Create an `.env` file in the root of your project directory with the following content:
```plaintext
weatherbit_ApiKey=your_weatherbit_key
username_ApiKey=your_geonames_username
pixabay_ApiKey=your_pixabay_key
PORT=3000
```

### Scripts
#### Start Development:
```bash
npm start
```

#### Build for Production:
```bash
npm run build
```

#### Run the server:
```bash
npm run server
```

#### Run Tests:
```bash
npm test
```

## Prerequisites
### Node.js:
Ensure you have Node.js versionv 20.16.0 installed. You can check your Node.js version by running:
```bash
node -v
```
