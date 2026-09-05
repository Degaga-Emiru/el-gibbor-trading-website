
import HeroSlider from '../components/HeroSlider';
import NewArrivals from '../components/NewArrivals';
import { CompanyOverview, VisionMission, CoreValues } from './AboutUs';
import Services from './Services';
import Products from './Products';
import ContactUs from './ContactUs';

const Home = () => {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Slider (Driving Excellence in Import and Export) */}
      <HeroSlider />

      {/* 2. New Arrivals Section (directly after Hero) */}
      <NewArrivals />

      {/* 3. Company Overview — Who We Are */}
      <CompanyOverview />

      {/* 4. Services */}
      <Services hideHeader={true} />

      {/* 5. Products */}
      <Products hideHeader={true} />

      {/* 6. Vision & Mission */}
      <VisionMission />

      {/* 7. Core Values */}
      <CoreValues />

      {/* 8. Contact Us */}
      <ContactUs hideHeader={true} />
    </div>
  );
};

export default Home;

