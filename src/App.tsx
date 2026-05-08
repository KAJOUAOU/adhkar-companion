import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navigation from './components/Navigation'
import Dashboard    from './pages/Dashboard'
import ImmersiveMode from './pages/ImmersiveMode'
import CardsMode    from './pages/CardsMode'
import NeedOfMoment from './pages/NeedOfMoment'
import Settings     from './pages/Settings'
import DhikrDetail  from './pages/DhikrDetail'
import SleepAdhkar  from './pages/SleepAdhkar'
import EidPage      from './pages/EidPage'
import Prayers      from './pages/Prayers'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-lg mx-auto relative min-h-screen md:shadow-[0_0_60px_rgba(0,0,0,0.12)] md:ring-1 md:ring-black/5">
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

        {/* Sunnah de la nuit — no nav bar */}
        <Route path="/sleep" element={<SleepAdhkar />} />

        {/* Eid Takbir — full screen, no nav bar */}
        <Route path="/eid" element={<EidPage />} />

        {/* Horaires de prière — full screen, no nav bar */}
        <Route path="/prayers" element={<Prayers />} />

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
