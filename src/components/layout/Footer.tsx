import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-foreground text-background/90">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-gradient-primary">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-poppins font-bold text-xl text-background">
                PinjamGedungku
              </span>
            </Link>
            <p className="text-background/70 max-w-md mb-6">
              Solusi terbaik untuk peminjaman gedung serbaguna di Indonesia. 
              Proses mudah, cepat, dan terpercaya.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-poppins font-semibold text-lg mb-4">Menu Cepat</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-background/70 hover:text-background transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/gedung" className="text-background/70 hover:text-background transition-colors">
                  Daftar Gedung
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-background/70 hover:text-background transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-background/70 hover:text-background transition-colors">
                  Daftar
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-poppins font-semibold text-lg mb-4">Hubungi Kami</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-background/70">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>Jl. Dipatiukur No. 112, Bandung</span>
              </li>
              <li className="flex items-center gap-3 text-background/70">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>(022) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-background/70">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>info@pinjamgedungku.id</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-6 text-center text-background/50 text-sm">
          <p>© 2025 PinjamGedungku. Kelompok 7 - IF6 UNIKOM. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  );
};
