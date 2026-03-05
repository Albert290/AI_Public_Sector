import Link from 'next/link';
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-white">AI Training Platform</span>
                <span className="text-xs text-slate-400">Public Sector</span>
              </div>
            </Link>
            <p className="text-sm text-slate-400">
              Empowering public servants with AI skills for modern governance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-amber-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-amber-500 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-amber-500 transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-amber-500 transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="font-semibold text-white mb-4">Training Programs</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-slate-400">Secretary Training</span>
              </li>
              <li>
                <span className="text-slate-400">Administrative Officer</span>
              </li>
              <li>
                <span className="text-slate-400">Data Analyst</span>
              </li>
              <li>
                <span className="text-slate-400">HR Manager</span>
              </li>
              <li>
                <span className="text-slate-400">Policy Advisor</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-amber-500" />
                <span>training@publicsector.gov</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-amber-500" />
                <span>+254 712 870654</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-amber-500" />
                <span>Public Service Building<br />Nairobi</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-slate-400">
            © {currentYear} AI Training Platform. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-slate-400 hover:text-amber-500 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-slate-400 hover:text-amber-500 transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-slate-400 hover:text-amber-500 transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
