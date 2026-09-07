

export function Footer() {

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 relative">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo and Copyright */}
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 text-sm">
              © {new Date().getFullYear()} <a href="https://github.com/damirtag/as" className="text-yellow-400 hover:text-yellow-300 transition-colors">damirtag/as</a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;