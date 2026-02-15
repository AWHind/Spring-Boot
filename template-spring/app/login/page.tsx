import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
      <div className="min-h-screen flex flex-col relative">

        {/* Full Page Background Image */}
        <div className="fixed inset-0 -z-10">
          <Image
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920&q=100&auto=format&fit=crop"
              alt="Restaurant ambiance"
              fill
              className="object-cover"
              priority
              quality={100}
          />
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <Header />

        <main className="flex-1 flex items-center justify-center p-4 relative z-10">
          <div className="w-full max-w-md">

            {/* Header Section */}
            <div className="text-center mb-8">
              <Link
                  href="/"
                  className="inline-flex items-center gap-3 mb-6 justify-center hover:opacity-80 transition-opacity"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary/70 text-white flex items-center justify-center font-bold text-lg">
                  ⚡
                </div>

                <div className="text-left">
                  <div className="text-xl font-bold text-white">
                    Maison Élysia
                  </div>
                  <div className="text-xs text-gray-300">
                    Restaurant Gastronomique
                  </div>
                </div>
              </Link>

              <h1 className="text-3xl font-bold text-white mb-2">
                Heureux de vous retrouver
              </h1>

              <p className="text-gray-300">
                Connectez-vous pour accéder à votre espace privé.
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white/90 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-8">
              <AuthForm type="login" />
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-white/80 backdrop-blur-md border border-white/20 rounded-lg text-gray-800">
              <p className="text-sm font-semibold mb-3">Accès Démonstration :</p>
              <div className="space-y-2 text-xs">
                <p><span className="font-medium">Client :</span> client@example.com / password123</p>
                <p><span className="font-medium">Admin :</span> admin@example.com / admin123</p>
              </div>
            </div>

          </div>
        </main>

        <Footer className="relative z-10" />
      </div>
  );
}
