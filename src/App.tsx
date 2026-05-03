import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navigation from './components/Navigation'
import Dashboard    from './pages/Dashboard'
import ImmersiveMode from './pages/ImmersiveMode'
import CardsMode    from './pages/CardsMode'
import NeedOfMoment from './pages/NeedOfMoment'
import Settings     from './pages/Settings'
import DhikrDetail  from './pages/DhikrDetail'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-lg mx-auto relative min-h-screen">
      {children}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Immersive mode — full screen, no nav bar */}
        <Route path="/session/:period" element={<ImmersiveMode />} />

        {/* Single dhikr detail — no nav bar */}
        <Route path="/dhikr/:id" element={<DhikrDetail />} />

        {/* Main app with bottom navigation */}
        <Route path="/" element={
          <Layout>
            <Dashboard />
            <Navigation />
          </Layout>
        } />
        <Route path="/browse" element={
          <Layout>
            <CardsMode />
            <Navigation />
          </Layout>
        } />
        <Route path="/need" element={
          <Layout>
            <NeedOfMoment />
            <Navigation />
          </Layout>
        } />
        <Route path="/settings" element={
          <Layout>
            <Settings />
            <Navigation />
          </Layout>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
