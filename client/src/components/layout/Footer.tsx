import { Link } from "wouter";
import { Mic, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 bg-white border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Mic className="text-white w-4 h-4" />
              </div>
              <span className="font-bold text-neutral-800">VoiceKeeper</span>
            </div>
            <p className="text-sm text-neutral-600">
              Preserving precious voices and memories with respect, security, and love.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-neutral-800 mb-3">Privacy & Ethics</h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li><Link href="#" className="hover:text-primary">Data Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary">Ethical AI Guidelines</Link></li>
              <li><Link href="#" className="hover:text-primary">Security Practices</Link></li>
              <li><Link href="#" className="hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-neutral-800 mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li><Link href="#" className="hover:text-primary">Help Center</Link></li>
              <li><Link href="#" className="hover:text-primary">Contact Support</Link></li>
              <li><Link href="#" className="hover:text-primary">Community Guidelines</Link></li>
              <li><Link href="#" className="hover:text-primary">Grief Resources</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-neutral-200 text-center">
          <p className="text-sm text-neutral-500 flex items-center justify-center">
            © 2024 VoiceKeeper. Made with <Heart className="inline w-4 h-4 text-red-500 mx-1" /> for preserving memories. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
