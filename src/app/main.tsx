import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { Router } from './Router.tsx'
import { Provider } from 'react-redux'
import { appStore } from './appStore'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={appStore}>
      <RouterProvider router={Router} />
    </Provider>
  </StrictMode>,
)
