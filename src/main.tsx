import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store.ts'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastContainer position="top-right" />
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
