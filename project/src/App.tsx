import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Layout } from '@/components/layout/Layout';
import { HomePage } from '@/pages/HomePage';
import { EventDetailsPage } from '@/pages/EventDetailsPage';
import BookingPage from '@/pages/BookingPage'; // ✅
import { BookingConfirmationPage } from '@/pages/BookingConfirmationPage';
import { CreateEventPage } from '@/pages/CreateEventPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="evento-theme">
      <AuthProvider>
        <Router>
          <Routes>
            {/* Auth routes without layout */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            
            {/* Main app routes with layout */}
            <Route path="/*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/events/:id" element={<EventDetailsPage />} />
                  <Route path="/events/:id/book" element={<BookingPage />} />
                  <Route path="/booking-confirmation/:ticketId" element={<BookingConfirmationPage />} />
                  <Route path="/create-event" element={<CreateEventPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                </Routes>
              </Layout>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;