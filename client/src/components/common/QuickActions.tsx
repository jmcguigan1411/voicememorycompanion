import { MessageCircle, Upload, Heart, UserCog } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      icon: MessageCircle,
      title: "Start New Chat",
      description: "Begin a conversation with your loved one's voice",
      href: "/chat",
      color: "primary",
    },
    {
      icon: Upload,
      title: "Upload Audio",
      description: "Add more voice recordings to improve quality",
      href: "/upload",
      color: "secondary",
    },
    {
      icon: Heart,
      title: "Memory Capsules",
      description: "View saved conversations and special moments",
      href: "/memory-capsules",
      color: "accent",
    },
    {
      icon: UserCog,
      title: "Personality",
      description: "Customize AI personality and memories",
      href: "/personality",
      color: "purple",
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "primary":
        return "bg-primary/10 text-primary group-hover:bg-primary/20";
      case "secondary":
        return "bg-secondary/10 text-secondary group-hover:bg-secondary/20";
      case "accent":
        return "bg-accent/10 text-accent group-hover:bg-accent/20";
      case "purple":
        return "bg-purple-100 text-purple-600 group-hover:bg-purple-200";
      default:
        return "bg-primary/10 text-primary group-hover:bg-primary/20";
    }
  };

  const getBorderColor = (color: string) => {
    switch (color) {
      case "primary":
        return "hover:border-primary/30";
      case "secondary":
        return "hover:border-secondary/30";
      case "accent":
        return "hover:border-accent/30";
      case "purple":
        return "hover:border-purple-400/30";
      default:
        return "hover:border-primary/30";
    }
  };

  return (
    <section className="mb-8">
      <h3 className="text-lg font-semibold text-neutral-800 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.title}
              onClick={() => window.location.href = action.href}
              className={`bg-white p-6 rounded-xl border border-neutral-200 ${getBorderColor(action.color)} hover:shadow-md transition-all text-left group`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${getColorClasses(action.color)}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-neutral-800 mb-2">{action.title}</h4>
              <p className="text-sm text-neutral-600">{action.description}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
