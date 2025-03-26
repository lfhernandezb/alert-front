import React, { Suspense, useEffect } from 'react'
import { CSpinner, useColorModes } from '@coreui/react';
import { useSelector } from 'react-redux';
import { HashRouter, Route, Routes } from 'react-router-dom';

import './scss/style.scss'

// We use those styles to show code examples, you should remove them in your application.
// import './scss/examples.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));

// Pages
// const Home = React.lazy(() => import('./pages/home'))
const About = React.lazy(() => import('./pages/about'))
// const Page404 = React.lazy(() => import('./pages/page404/Page404'))
// const Page500 = React.lazy(() => import('./pages/page500/Page500'))

function App() {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state: { theme: string }) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const themeParam = urlParams.get('theme');
    const theme = themeParam?.match(/^[A-Za-z0-9\s]+/)?.[0] ?? null;
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/about" element={<About />} />
          {/* <Route path="/404" element={<Page404 />} />
          <Route path="/500" element={<Page500 />} /> */}
          <Route path="*" element={<DefaultLayout />} />
        </Routes>
      </Suspense>
    </HashRouter>
  ) 
}

export default App
