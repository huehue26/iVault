"use client";

import { useInsure } from "../store/insureStore";

export default function Home() {
  const { showLoginPage, setActivePage } = useInsure();

  const handleLoginClick = () => {
    showLoginPage(); // This will show the Auth component as full page
  };

  const handleNavigation = (page: string) => {
    if (page === "homePage") {
      setActivePage("homePage");
    }
    // For other pages, do nothing - user needs to login first
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <i className="fa-solid fa-shield-halved text-white text-lg" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">iVault</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <span 
                onClick={() => handleNavigation("homePage")}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors cursor-pointer"
              >
                Home
              </span>
              <span 
                onClick={() => handleNavigation("policyBankPage")}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors cursor-pointer"
              >
                Vault
              </span>
              <span 
                onClick={() => handleNavigation("claimsPage")}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors cursor-pointer"
              >
                Claims
              </span>
              <span 
                onClick={() => handleNavigation("policyBankPage")}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors cursor-pointer"
              >
                Insights
              </span>
              <span 
                onClick={() => handleNavigation("policyBankPage")}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors cursor-pointer"
              >
                Offers
              </span>
              <span 
                onClick={() => handleNavigation("policyBankPage")}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors cursor-pointer"
              >
                Contact
              </span>
            </nav>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleLoginClick}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 h-[700px] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Your Insurance.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Secured.</span><br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Simplified.</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                One secure place for all your policies. Smarter insights. Hassle-free claims.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg">
                  Upload Policy
                </button>
                <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
                  See How It Works
                </button>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <i className="fa-solid fa-lock text-green-500 mr-2" />
                  Encrypted Storage
                </div>
                <div className="flex items-center">
                  <i className="fa-solid fa-handshake text-green-500 mr-2" />
                  Licensed Partners
                </div>
                <div className="flex items-center">
                  <i className="fa-solid fa-shield-check text-green-500 mr-2" />
                  100% Secure
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-96 h-64 rounded-2xl bg-white shadow-xl flex flex-col items-center justify-center cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50">
                <div className="mb-4 animate-bounce">
                  <i className="fa-solid fa-cloud-arrow-up text-4xl text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Drag & Drop or Upload</h3>
                <p className="text-gray-600 text-center px-4">
                  Upload your insurance policy<br />
                  (PDF, Word, Image)
                </p>
                <div className="mt-4 w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Market Insights Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Smart Market Insights</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay informed about premiums, coverage gaps, and savings opportunities with real-time market data and AI-powered analytics.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-gradient-to-br from-red-50 to-pink-50 p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="fa-solid fa-chart-line text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Premium Trends</h3>
              </div>
              <div className="h-32 mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-gray-500">Chart Placeholder</div>
              </div>
              <p className="text-red-600 font-medium">Premiums rising 5% in your segment</p>
              <p className="text-gray-600 text-sm mt-2">Market analysis shows increasing trend in your insurance category</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="fa-solid fa-magnifying-glass text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Coverage Analysis</h3>
              </div>
              <div className="h-32 mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-gray-500">Chart Placeholder</div>
              </div>
              <p className="text-yellow-600 font-medium">30% of users found coverage gaps</p>
              <p className="text-gray-600 text-sm mt-2">Comprehensive analysis reveals potential protection areas</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="fa-solid fa-umbrella text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Savings Opportunities</h3>
              </div>
              <div className="h-32 mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-gray-500">Chart Placeholder</div>
              </div>
              <p className="text-green-600 font-medium">Save up to 12% with optimized plans</p>
              <p className="text-gray-600 text-sm mt-2">Smart recommendations to reduce your premiums</p>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started Steps Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Unlock Personalized Insurance Insights in Minutes</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform makes insurance management effortless with intelligent analysis and personalized recommendations.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <i className="fa-solid fa-cloud-arrow-up text-3xl text-blue-600" />
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Upload Policy</h3>
                <p className="text-gray-600 mb-6">
                  Secure drag & drop upload for all your insurance documents. Our platform supports PDF, Word, and image formats with bank-level encryption.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 font-medium">✓ Instant processing</p>
                  <p className="text-blue-800 font-medium">✓ 256-bit encryption</p>
                  <p className="text-blue-800 font-medium">✓ Multiple formats supported</p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <i className="fa-solid fa-robot text-3xl text-purple-600" />
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">2. Get AI Analysis</h3>
                <p className="text-gray-600 mb-6">
                  Policy Genie analyzes your documents to highlight premiums, exclusions, terms, and potential savings opportunities automatically.
                </p>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-purple-800 font-medium">✓ Smart term extraction</p>
                  <p className="text-purple-800 font-medium">✓ Premium breakdown</p>
                  <p className="text-purple-800 font-medium">✓ Coverage gap detection</p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <i className="fa-solid fa-chart-line text-3xl text-green-600" />
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">3. Optimize & Save</h3>
                <p className="text-gray-600 mb-6">
                  Receive personalized recommendations for better coverage options and potential savings based on your unique profile and market analysis.
                </p>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-800 font-medium">✓ Personalized recommendations</p>
                  <p className="text-green-800 font-medium">✓ Cost optimization</p>
                  <p className="text-green-800 font-medium">✓ Better coverage options</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Core Features of iVault</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive insurance management tools powered by artificial intelligence to simplify your insurance experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <i className="fa-solid fa-chart-pie text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Analysis</h3>
              <p className="text-gray-600 text-sm">Detailed AI insights into premium structure and cost breakdown analysis.</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <i className="fa-solid fa-shield-check text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Coverage Review</h3>
              <p className="text-gray-600 text-sm">Optimize coverage with AI recommendations and gap analysis.</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <i className="fa-solid fa-piggy-bank text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cost Optimization</h3>
              <p className="text-gray-600 text-sm">Find opportunities to reduce premiums while maintaining coverage.</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center mb-4">
                <i className="fa-solid fa-cloud-arrow-up text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Policy</h3>
              <p className="text-gray-600 text-sm">Store all your policies in one secure, encrypted vault.</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mb-4">
                <i className="fa-solid fa-star text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Featured Offers</h3>
              <p className="text-gray-600 text-sm">Special deals and exclusive offers from top insurance providers.</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <i className="fa-solid fa-headset text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Claim Assistance</h3>
              <p className="text-gray-600 text-sm">Automated claim process with guided support and documentation.</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                <i className="fa-solid fa-wand-magic text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Policy Genie</h3>
              <p className="text-gray-600 text-sm">AI-powered assistant for instant policy analysis and insights.</p>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mb-4">
                <i className="fa-solid fa-bell text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Alerts</h3>
              <p className="text-gray-600 text-sm">Get notified about renewals, payments, and important updates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <i className="fa-solid fa-shield-halved text-white text-lg" />
                </div>
                <span className="ml-3 text-xl font-bold">iVault</span>
              </div>
              <p className="text-gray-400">
                Your trusted partner in insurance management and optimization.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fa-brands fa-twitter text-xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fa-brands fa-linkedin text-xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fa-brands fa-facebook text-xl" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 iVault. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
