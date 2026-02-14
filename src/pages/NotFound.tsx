import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Building2, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-surface p-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-2xl bg-gradient-primary shadow-primary">
            <Building2 className="h-12 w-12 text-primary-foreground" />
          </div>
        </div>
        <h1 className="font-poppins text-6xl font-bold gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Halaman Tidak Ditemukan</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          Maaf, halaman yang Anda cari tidak tersedia.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/">
            <Button className="gap-2 bg-gradient-primary hover:opacity-90">
              <Home className="h-4 w-4" />
              Ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
