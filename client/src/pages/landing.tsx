import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Mic, MessageCircle, Archive } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <Mic className="text-white w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold text-neutral-800">VoiceKeeper</h1>
            </div>
            
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-primary hover:bg-primary/90"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-neutral-800 mb-6">
            Preserve Precious <span className="text-primary">Voices</span>
          </h2>
          <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
            Keep your loved ones close with AI-powered voice preservation. 
            Upload recordings, train personalized models, and have heartfelt conversations anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => window.location.href = '/api/login'}
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-4"
            >
              Start Preserving Memories
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-4"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-neutral-800 mb-12">
            How VoiceKeeper Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Mic className="text-primary w-6 h-6" />
                </div>
                <CardTitle className="text-neutral-800">Upload Audio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600">
                  Upload multiple voice recordings (MP3, M4A) of your loved one. 
                  Our AI analyzes speech patterns, tone, and unique characteristics.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4">
                  <MessageCircle className="text-secondary w-6 h-6" />
                </div>
                <CardTitle className="text-neutral-800">AI Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600">
                  Chat with an AI that responds in your loved one's voice. 
                  Personalize with memories, traits, and speaking patterns.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                  <Archive className="text-accent w-6 h-6" />
                </div>
                <CardTitle className="text-neutral-800">Memory Capsules</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600">
                  Save meaningful conversations as Memory Capsules. 
                  Replay special moments and preserve them forever.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-16 h-16 text-secondary mx-auto mb-6" />
          <h3 className="text-3xl font-bold text-neutral-800 mb-6">
            Privacy & Ethics First
          </h3>
          <p className="text-xl text-neutral-600 mb-8">
            Your loved one's voice data is encrypted and stored securely. 
            We're committed to ethical AI use with respect for memory and privacy.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="font-semibold text-neutral-800 mb-2">End-to-End Encryption</h4>
              <p className="text-sm text-neutral-600">
                All voice data is encrypted in transit and at rest.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="font-semibold text-neutral-800 mb-2">Consent-Based</h4>
              <p className="text-sm text-neutral-600">
                Only use with explicit permission and for memorial purposes.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="font-semibold text-neutral-800 mb-2">Your Control</h4>
              <p className="text-sm text-neutral-600">
                You own your data and can delete it at any time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
              <h4 className="font-semibold text-neutral-800 mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li><a href="#" className="hover:text-primary">Voice Training</a></li>
                <li><a href="#" className="hover:text-primary">AI Conversations</a></li>
                <li><a href="#" className="hover:text-primary">Memory Capsules</a></li>
                <li><a href="#" className="hover:text-primary">Personality Settings</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-neutral-800 mb-3">Privacy & Ethics</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li><a href="#" className="hover:text-primary">Data Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary">Ethical AI Guidelines</a></li>
                <li><a href="#" className="hover:text-primary">Security Practices</a></li>
                <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-neutral-800 mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li><a href="#" className="hover:text-primary">Help Center</a></li>
                <li><a href="#" className="hover:text-primary">Contact Support</a></li>
                <li><a href="#" className="hover:text-primary">Community Guidelines</a></li>
                <li><a href="#" className="hover:text-primary">Grief Resources</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-neutral-200 text-center">
            <p className="text-sm text-neutral-500">
              © 2024 VoiceKeeper. Made with <Heart className="inline w-4 h-4 text-red-500" /> for preserving memories. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
