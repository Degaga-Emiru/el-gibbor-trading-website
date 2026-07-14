
import HeroSlider from '../components/HeroSlider';
import { CompanyOverview, VisionMission, CoreValues } from './AboutUs';
import Services from './Services';
import Products from './Products';
import ContactUs from './ContactUs';

const Home = () => {
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
