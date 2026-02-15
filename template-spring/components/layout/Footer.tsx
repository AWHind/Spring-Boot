import Link from 'next/link';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <div className="mb-6">
              <div className="font-bold text-gray-900 text-xl tracking-tight mb-2">Maison Élysia</div>
              <div className="text-xs text-gray-500">Premium Restaurant</div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Experience exceptional culinary delights delivered to your door.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-wider">Navigation</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-[#FF6B35] transition-colors duration-300 font-medium">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-[#FF6B35] transition-colors duration-300 font-medium">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="#featured" className="hover:text-[#FF6B35] transition-colors duration-300 font-medium">
                  About
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-[#FF6B35] transition-colors duration-300 font-medium">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-[#FF6B35] transition-colors">
                  Delivery
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-[#FF6B35] transition-colors">
                  Pickup
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-[#FF6B35] transition-colors">
                  Catering
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-[#FF6B35] transition-colors">
                  Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="tel:+33123456789" className="hover:text-[#FF6B35] transition-colors">+126 28-473-334</a>
              </li>
              <li>
                <a href="mailto:hello@roastlux.fr" className="hover:text-[#FF6B35] transition-colors">Maison.elysia@gmail.com</a>
              </li>
              <li>
                123 Rue de Tunis
                <br />
                75001 Tunis
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <p>
              © {currentYear} Maison Élysia. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/" className="hover:text-[#FF6B35] transition-colors">
                Terms
              </Link>
              <Link href="/" className="hover:text-[#FF6B35] transition-colors">
                Privacy
              </Link>
              <Link href="/" className="hover:text-[#FF6B35] transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
