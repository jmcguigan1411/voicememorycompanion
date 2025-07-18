import { Shield } from "lucide-react";

export default function EthicsPrivacy() {
  return (
    <div className="bg-amber-50 border border-secondary/20 rounded-xl p-6">
      <div className="flex items-start space-x-3">
        <Shield className="text-secondary w-5 h-5 mt-1" />
        <div>
          <h4 className="font-semibold text-neutral-800 mb-2">Privacy & Ethics</h4>
          <p className="text-sm text-neutral-600 mb-3">
            Your loved one's voice data is encrypted and stored securely. We're committed to ethical AI use.
          </p>
          <button className="text-secondary text-sm font-medium hover:underline">
            Learn more about our privacy practices
          </button>
        </div>
      </div>
    </div>
  );
}
