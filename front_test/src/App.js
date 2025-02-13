import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import QuizResultPage from './pages/QuizResultPage';

// Define routes using createBrowserRouter
const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/quiz/:id",
    element: <QuizPage />,
  },
  {
    path: "/quiz-results/:id", // Final route for results
    element: <QuizResultPage />,
  }
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
