import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import Products from './pages/Products';
import ContactUs from './pages/ContactUs';

// Placeholder Pages
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="container mx-auto px-4 py-20 min-h-[60vh] flex flex-col items-center justify-center text-center">
    <h1 className="text-4xl font-bold mb-4 text-[var(--color-primary)]">{title}</h1>
    <p className="text-[var(--color-body)] max-w-2xl">
      This page is currently under development. Content for {title} will be added here soon.
    </p>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="products" element={<Products />} />
          <Route path="services" element={<Services />} />
          <Route path="projects" element={<PlaceholderPage title="Projects" />} />
          <Route path="contact" element={<ContactUs />} />
          {/* We will extract these into actual page files next */}
          <Route path="*" element={<PlaceholderPage title="404 - Page Not Found" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
