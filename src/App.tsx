import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import Products from './pages/Products';
import Projects from './pages/Projects';
import Gallery from './pages/Gallery';
import Videos from './pages/Videos';
import Team from './pages/Team';
import Careers from './pages/Careers';
import ContactUs from './pages/ContactUs';
import OfficeInfo from './pages/OfficeInfo';
import ProductDetails from './pages/ProductDetails';

// Backend & Auth imports
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import StaffPortal from './pages/StaffPortal';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';

const Layout = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow pt-20">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const NotFound = () => (
  <div className="container mx-auto px-4 py-40 min-h-[60vh] flex flex-col items-center justify-center text-center">
    <h1 className="text-8xl font-bold text-[#0B2E6B] mb-4">404</h1>
    <p className="text-gray-500 text-xl max-w-md">Sorry, the page you are looking for does not exist.</p>
    <a href="/" className="mt-8 inline-block bg-[#0B2E6B] text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-900 transition-colors">
      Back to Home
    </a>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <AboutUs /> },
      { path: 'products', element: <Products /> },
      { path: 'services', element: <Services /> },
      { path: 'projects', element: <Projects /> },
      { path: 'gallery', element: <Gallery /> },
      { path: 'videos', element: <Videos /> },
      { path: 'team', element: <Team /> },
      { path: 'careers', element: <Careers /> },
      { path: 'contact', element: <ContactUs /> },
      { path: 'office', element: <OfficeInfo /> },
      { path: 'product/:id', element: <ProductDetails /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '/staff',
    element: <StaffPortal />,
  },
  {
    path: '/admin/*',
    element: (
      <ProtectedRoute allowedRole="manager">
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/employee/*',
    element: (
      <ProtectedRoute allowedRole="employee">
        <EmployeeDashboard />
      </ProtectedRoute>
    ),
  },
]);

const App = () => (
  <AuthProvider>
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  </AuthProvider>
);

export default App;

