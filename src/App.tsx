import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppProvider } from '@/context/AppContext'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { ProductLandingPage } from '@/pages/landing/ProductLandingPage'
import { VaultApp } from '@/VaultApp'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <Routes>
              <Route path="/products/:slug" element={<ProductLandingPage />} />
              <Route path="/*" element={<VaultApp />} />
            </Routes>
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
