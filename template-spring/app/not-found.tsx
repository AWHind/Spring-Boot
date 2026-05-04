import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent to-background px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-bold text-foreground mb-4">Page non trouvée</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          Oups ! La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Retour à l'accueil
          </Link>
          <Link
              href="/login"
            className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </main>
  );
}
