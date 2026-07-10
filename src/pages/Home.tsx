import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSlider from '../components/HeroSlider';
import { CompanyOverview, VisionMission, CoreValues } from './AboutUs';
import Services from './Services';
import Products from './Products';
import ContactUs from './ContactUs';

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Slider */}
      <HeroSlider />

      {/* 2. Company Overview — Who We Are */}
      <CompanyOverview />

      {/* 3. Services */}
      <Services hideHeader={true} />

      {/* 4. Products */}
      <Products hideHeader={true} />

      {/* 5. Vision & Mission */}
      <VisionMission />

      {/* 6. Core Values */}
      <CoreValues />

      {/* 7. Contact Us */}
      <ContactUs hideHeader={true} />
    </div>
  );
};

export default Home;
