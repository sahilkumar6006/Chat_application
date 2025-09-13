# Chat Application Frontend

A modern, responsive chat application built with React, TypeScript, and Material-UI.

## Features

- User authentication (login/register)
- Real-time messaging using Socket.IO
- One-on-one and group chats
- Search for users
- Create group chats
- Responsive design that works on mobile and desktop
- Clean and intuitive user interface

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running (see backend setup)

## Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd chat-application/frontend
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the frontend directory with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

4. Start the development server
   ```bash
   npm start
   # or
   yarn start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (use with caution)

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── contexts/      # React contexts for state management
  ├── pages/         # Page components
  ├── services/      # API and service functions
  ├── types/         # TypeScript type definitions
  ├── App.tsx        # Main application component
  └── index.tsx      # Application entry point
```

## Backend Integration

This frontend is designed to work with the provided backend API. Make sure the backend server is running and properly configured before starting the frontend.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
