import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo and Copyright */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-yellow-400 flex items-center justify-center">
              <span className="text-zinc-950 font-bold text-xs">Q</span>
            </div>
            <span className="text-zinc-400 text-sm">
              © 2024 Quotes. Made with <Heart size={12} className="inline text-red-400" /> for sharing thoughts.
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link
              to="/about"
              className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
            >
              About
            </Link>
            <Link
              to="/privacy"
              className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
            >
              Terms
            </Link>
          </div>

          {/* Social Links */}
          {/* <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <Github size={16} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <Twitter size={16} />
            </a>
          </div> */}
        </div>
      </div>
    </footer>
  );
}

export default Footer;