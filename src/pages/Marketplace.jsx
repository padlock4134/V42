import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import ChefFreddie from '../components/ChefFreddie';

const Marketplace = () => {
  const { currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [vendorForm, setVendorForm] = useState({
    businessName: '',
    businessType: '',
    contactName: '',
    contactEmail: '',
    description: '',
    location: ''
  });
  const [isVendorFormSubmitted, setIsVendorFormSubmitted] = useState(false);

  const handleNotifySubmit = (e) => {
    e.preventDefault();
    
    if (email.trim()) {
      // This would be replaced with an actual API call
      // For now, we'll just simulate success
      setIsSubmitted(true);
    }
  };

  const handleVendorSubmit = (e) => {
    e.preventDefault();
    
    // This would be replaced with an actual API call
    // For now, we'll just simulate success
    setIsVendorFormSubmitted(true);
  };

  return (
    <Layout>
      <div className="bg-white rounded-retro shadow-retro border-2 border-gray-800 p-6">
        {/* Coming Soon Banner */}
        <div className="absolute top-6 right-0 bg-retro-red text-white py-2 px-8 transform rotate-45 text-sm font-bold" style={{ right: '-40px', top: '30px' }}>
          Coming Soon!
        </div>
        
        <h2 className="font-retro text-2xl mb-6 border-b-4 border-retro-yellow pb-2">
          The Grange Marketplace
        </h2>
        
        {/* Hero Section */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-retro text-3xl mb-4">Support Your Local Food Economy</h3>
              <p className="text-lg mb-6">
                The Grange Marketplace connects you directly with local food producers, artisans, and specialty shops in your community.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-retro-yellow rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold">Hyperlocal Sourcing</h4>
                    <p className="text-gray-600">Find ingredients from producers within 25 miles of your location.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-retro-blue rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold">Seasonal Freshness</h4>
                    <p className="text-gray-600">Get the freshest seasonal ingredients for your recipes.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-retro-teal rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold">Support Local Businesses</h4>
                    <p className="text-gray-600">Your purchases directly support small-scale producers in your community.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square rounded-retro overflow-hidden border-2 border-gray-800">
                <img 
                  src="https://via.placeholder.com/300" 
                  alt="Local butcher shop" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-retro overflow-hidden border-2 border-gray-800">
                <img 
                  src="https://via.placeholder.com/300" 
                  alt="Farmers market" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-retro overflow-hidden border-2 border-gray-800">
                <img 
                  src="https://via.placeholder.com/300" 
                  alt="Artisan cheese shop" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-retro overflow-hidden border-2 border-gray-800">
                <img 
                  src="https://via.placeholder.com/300" 
                  alt="Fish market" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Marketplace Categories */}
        <section className="mb-12">
          <h3 className="font-retro text-2xl mb-6">Marketplace Categories</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: 'Butchers', icon: '🥩', color: 'bg-red-100' },
              { name: 'Fish Markets', icon: '🐟', color: 'bg-blue-100' },
              { name: 'Farm Stands', icon: '🥕', color: 'bg-green-100' },
              { name: 'Bakeries', icon: '🍞', color: 'bg-yellow-100' },
              { name: 'Cheese Shops', icon: '🧀', color: 'bg-yellow-50' },
              { name: 'Specialty Grocers', icon: '🛒', color: 'bg-purple-100' },
              { name: 'Herb & Spice Shops', icon: '🌿', color: 'bg-green-50' },
              { name: 'Wineries & Breweries', icon: '🍷', color: 'bg-red-50' }
            ].map((category, index) => (
              <div 
                key={index} 
                className={`${category.color} rounded-retro p-4 border-2 border-gray-800 text-center cursor-not-allowed opacity-75`}
              >
                <div className="text-4xl mb-2">{category.icon}</div>
                <h4 className="font-retro">{category.name}</h4>
                <p className="text-xs text-gray-500 mt-1">Coming Soon</p>
              </div>
            ))}
          </div>
        </section>
        
        {/* Get Notified Section */}
        <section className="mb-12">
          <div className="bg-retro-mint rounded-retro p-6 border-2 border-gray-800">
            <h3 className="font-retro text-2xl mb-4">Get Notified When We Launch</h3>
            <p className="mb-6">
              We're working hard to bring the best local food suppliers to your fingertips. 
              Sign up to be notified when The Grange Marketplace launches in your area.
            </p>
            
            {isSubmitted ? (
              <div className="bg-white rounded-md p-4 border-2 border-green-500">
                <h4 className="font-bold text-green-600 mb-2">Thank You!</h4>
                <p>We'll notify you when The Grange Marketplace launches in your area.</p>
              </div>
            ) : (
              <form onSubmit={handleNotifySubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="retro-input flex-1"
                  placeholder="Your email address"
                  required
                />
                <button type="submit" className="retro-button">
                  Notify Me
                </button>
              </form>
            )}
          </div>
        </section>
        
        {/* For Vendors Section */}
        <section>
          <h3 className="font-retro text-2xl mb-6">For Local Food Suppliers</h3>
          
          <div className="bg-retro-cream rounded-retro p-6 border-2 border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-retro text-xl mb-4">Join Our Marketplace</h4>
                <p className="mb-4">
                  Are you a local food producer, artisan, or specialty shop owner? 
                  Join The Grange Marketplace to connect with home cooks in your community.
                </p>
                
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Reach passionate home cooks
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Simple inventory management
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Flexible pickup and delivery options
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Low commission fees
                  </li>
                </ul>
              </div>
              
              <div>
                {isVendorFormSubmitted ? (
                  <div className="bg-white rounded-md p-6 border-2 border-green-500">
                    <h4 className="font-bold text-green-600 mb-2">Application Received!</h4>
                    <p className="mb-4">Thank you for your interest in joining The Grange Marketplace. Our team will review your application and contact you soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleVendorSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                        Business Name
                      </label>
                      <input
                        id="businessName"
                        type="text"
                        value={vendorForm.businessName}
                        onChange={(e) => setVendorForm({...vendorForm, businessName: e.target.value})}
                        className="retro-input w-full"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-1">
                        Business Type
                      </label>
                      <select
                        id="businessType"
                        value={vendorForm.businessType}
                        onChange={(e) => setVendorForm({...vendorForm, businessType: e.target.value})}
                        className="retro-input w-full"
                        required
                      >
                        <option value="">Select type</option>
                        <option value="butcher">Butcher Shop</option>
                        <option value="fishmonger">Fish Market</option>
                        <option value="farm">Farm/Farm Stand</option>
                        <option value="bakery">Bakery</option>
                        <option value="cheese">Cheese Shop</option>
                        <option value="grocery">Specialty Grocer</option>
                        <option value="herbs">Herb & Spice Shop</option>
                        <option value="alcohol">Winery/Brewery</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                          Contact Name
                        </label>
                        <input
                          id="contactName"
                          type="text"
                          value={vendorForm.contactName}
                          onChange={(e) => setVendorForm({...vendorForm, contactName: e.target.value})}
                          className="retro-input w-full"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                          Contact Email
                        </label>
                        <input
                          id="contactEmail"
                          type="email"
                          value={vendorForm.contactEmail}
                          onChange={(e) => setVendorForm({...vendorForm, contactEmail: e.target.value})}
                          className="retro-input w-full"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                        Business Location
                      </label>
                      <input
                        id="location"
                        type="text"
                        value={vendorForm.location}
                        onChange={(e) => setVendorForm({...vendorForm, location: e.target.value})}
                        className="retro-input w-full"
                        placeholder="City, State"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Business Description
                      </label>
                      <textarea
                        id="description"
                        value={vendorForm.description}
                        onChange={(e) => setVendorForm({...vendorForm, description: e.target.value})}
                        className="retro-input w-full"
                        rows="3"
                        required
                      ></textarea>
                    </div>
                    
                    <button type="submit" className="retro-button w-full">
                      Submit Application
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
      <ChefFreddie currentPage="marketplace" />
    </Layout>
  );
};

export default Marketplace;
