export interface Product {
  id: string;
  category: string;
  name: string;
  description: string;
  images: string[];
  features?: string[];
}

export const productCategories: Product[] = [
  {
    id: 'triangle-tyres',
    category: 'Triangle Tyres',
    name: 'Premium Triangle Tyres',
    description: 'High-performance Triangle brand tyres for commercial trucks, passenger vehicles, and heavy-duty applications. Engineered for durability and reliability on all terrains.',
    features: ['Truck & Bus Tyres', 'Passenger Car Tyres', 'OTR & Heavy-Duty', 'All-Season Options'],
    images: [
      '/images/products/triangle.png',
      '/images/products/triangle1.png',
      '/images/products/triangle102.png',
      '/images/products/triangle11.png',
      '/images/products/triangle4.png',
      '/images/products/triangle5.png',
    ],
  },
  {
    id: 'cars',
    category: 'Cars',
    name: 'Passenger & Commercial Vehicles',
    description: 'Modern passenger and commercial vehicles sourced from trusted international manufacturers. Perfect for personal use and corporate fleet needs.',
    features: ['Sedan & SUV', 'Commercial Trucks', 'Fleet Procurement', 'Custom Orders'],
    images: [
      '/images/products/car2.png',
      '/images/products/car3.png',
      '/images/products/cars5.png',
      '/images/products/cars7.png',
      '/images/products/cars8.png',
      '/images/products/cars9.png',
    ],
  },
  {
    id: 'car-spare-parts',
    category: 'Car Spare Parts',
    name: 'Genuine Car Spare Parts',
    description: 'Authentic OEM-quality spare parts including brake systems, engine components, suspension parts, and more — ensuring vehicle longevity and peak performance.',
    features: ['Brake Systems', 'Engine Components', 'Suspension Parts', 'Electrical Parts'],
    images: [
      '/images/products/carsparepart1.png',
      '/images/products/carsparepart2.png',
      '/images/products/carsparepart3.png',
      '/images/products/carsparepart4.png',
      '/images/products/carsparepart6.png',
      '/images/products/carsparepart7.png',
    ],
  },
  {
    id: 'machinery',
    category: 'Machinery',
    name: 'Industrial Machinery',
    description: 'Heavy-duty industrial machinery for construction, manufacturing, and agricultural applications. Built to withstand the toughest working conditions.',
    features: ['Construction Equipment', 'Manufacturing Machines', 'Agricultural Machinery', 'Technical Support'],
    images: [
      '/images/products/machinery1.png',
      '/images/products/machinery2.png',
      '/images/products/machinery3.png',
      '/images/products/machinery5.png',
      '/images/products/machinery6.png',
      '/images/products/machinery7.png',
      '/images/products/machinery8.png',
      '/images/products/machinery9.png',
      '/images/products/machinery10.png',
      '/images/products/machinery13.png',
    ],
  },
  {
    id: 'elevators',
    category: 'Elevators',
    name: 'Elevators & Lift Systems',
    description: 'Modern elevator solutions for commercial buildings, residential complexes, and industrial facilities. Safe, efficient, and built to international standards.',
    features: ['Passenger Elevators', 'Freight Elevators', 'Installation Support', 'Maintenance Packages'],
    images: [
      '/images/products/elevator.png',
      '/images/products/elvator2.png',
      '/images/products/elevator3.png',
      '/images/products/elevator4.png',
    ],
  },
  {
    id: 'generators',
    category: 'Generators',
    name: 'Power Generators',
    description: 'Reliable power generation solutions ranging from portable units to heavy-duty industrial generators. Ensuring uninterrupted power supply for any application.',
    features: ['Diesel Generators', 'Industrial Power Units', 'Portable Generators', 'Spare Parts Supply'],
    images: [
      '/images/products/genarators1.png',
      '/images/products/genarators2.png',
      '/images/products/geanerators3.png',
    ],
  },
  {
    id: 'construction-materials',
    category: 'Construction Materials',
    name: 'Construction Materials',
    description: 'Premium construction materials including steel, cement, finishing materials, and structural components. Supporting infrastructure development with quality supplies.',
    features: ['Steel & Iron', 'Cement Products', 'Reinforcement Bars', 'Structural Components'],
    images: [
      '/images/products/constructionmaterail.png',
      '/images/products/constructionmaterail3.png',
      '/images/products/constructionmaterail5.png',
      '/images/products/constructionmaterail9.png',
      '/images/products/constructionmaterial.png',
      '/images/products/constructionmaterial7.png',
    ],
  },
  {
    id: 'house-finishing',
    category: 'House Finishing',
    name: 'House Finishing Materials',
    description: 'Complete range of interior and exterior finishing materials including tiles, sanitary ware, paints, and decorative elements for modern construction projects.',
    features: ['Tiles & Flooring', 'Sanitary Ware', 'Paints & Coatings', 'Decorative Fixtures'],
    images: [
      '/images/products/housefinshing1.png',
      '/images/products/housefinshing2.png',
    ],
  },
  {
    id: 'containers',
    category: 'Containers',
    name: 'Shipping & Storage Containers',
    description: 'High-quality shipping and storage containers for global logistics, import/export operations, and on-site storage. Available in standard and custom configurations.',
    features: ['20ft & 40ft Containers', 'Refrigerated Units', 'Open-Top Containers', 'Flat-Rack Containers'],
    images: [
      '/images/products/conatainer1.png',
      '/images/products/container2.png',
      '/images/products/container3.png',
      '/images/products/container4.png',
      '/images/products/container6.png',
      '/images/products/conatainer5.png',
    ],
  },
];
