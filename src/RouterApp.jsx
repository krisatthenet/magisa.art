import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { CartProvider } from './cart/CartContext';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import JewelryDetailPage from './pages/JewelryDetailPage';
import { getJewelryPage } from './data';

function JewelryDetailRoute() {
  const { slug } = useParams();
  const page = getJewelryPage(slug);

  if (!page) {
    return <HomePage />;
  }

  return <JewelryDetailPage page={page} />;
}

function AppRouter() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/jewelry/:slug" element={<JewelryDetailRoute />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default AppRouter;
