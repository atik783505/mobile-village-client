'tsx'
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <div className="space-y-6 max-w-xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
            Discover Premium <br />
            <span className="text-green-600">Products</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Experience exceptional quality and modern design. Shop our curated collection of premium products crafted for the modern lifestyle.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/shop"
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-all"
            >
              Shop Now
            </Link>
            <Link
              href="/about"
              className="px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 font-medium rounded-lg transition-all shadow-sm"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Right Image Banner Card */}
        <div className="relative">
          <div className="relative h-[380px] sm:h-[460px] w-full rounded-2xl overflow-hidden shadow-md bg-gray-100">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000"
              alt="Model Shopping Lifestyle"
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Floating Special Offer Badge Card */}
          <div className="absolute -bottom-6 left-6 sm:left-10 bg-white/95 backdrop-blur-md px-5 py-3.5 rounded-xl shadow-lg border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-600 text-white rounded-lg font-bold flex items-center justify-center text-sm shadow-sm">
              50%
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm sm:text-base">Special Offer</p>
              <p className="text-xs text-gray-500">Limited time only</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}