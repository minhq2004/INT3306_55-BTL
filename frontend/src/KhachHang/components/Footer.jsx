import {
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  MapPin,
  Plane,
  Clock,
  Shield,
  Heart,
} from "lucide-react";
import { Input, Button, Link } from "@nextui-org/react";

const Footer = () => {
  const features = [
    {
      icon: <Plane className="mb-2 text-blue-500" size={28} />,
      text: "200+ Destinations",
    },
    {
      icon: <Clock className="mb-2 text-blue-500" size={28} />,
      text: "24/7 Support",
    },
    {
      icon: <Shield className="mb-2 text-blue-500" size={28} />,
      text: "Safe Travel",
    },
    {
      icon: <Heart className="mb-2 text-blue-500" size={28} />,
      text: "Best Experience",
    },
  ];

  const quickLinks = [
    "Book Flight",
    "Check-in",
    "Flight Status",
    "Destinations",
  ];

  const contactInfo = [
    { Icon: Phone, text: "1-800-FLY-QAIR" },
    { Icon: Mail, text: "contact@qairlines.com" },
    { Icon: MapPin, text: "Main Terminal, Airport City" },
  ];

  const socialIcons = [Facebook, Twitter, Instagram];

  return (
    <footer className="w-full bg-gradient-to-br from-blue-950 to-black text-white">
      {/* Features Row */}
      <div className="w-full px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              {feature.icon}
              <span className="text-sm text-white font-medium mt-2">
                {feature.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-white/10 w-full"></div>

      {/* Main Footer Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto py-16 px-6">
        {/* Brand Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Plane className="text-blue-500" size={32} />
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
              Q Airlines
            </h3>
          </div>
          <p className="text-blue-100 opacity-80">Elevating Your Journey</p>
          <div className="flex space-x-3">
            {socialIcons.map((Icon, i) => (
              <Button
                key={i}
                isIconOnly
                variant="flat"
                className="bg-white/10 hover:bg-white/20 text-white"
                radius="full"
                size="md"
              >
                <Icon size={20} />
              </Button>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-4 text-blue-300">Quick Links</h4>
          <nav className="flex flex-col space-y-2">
            {quickLinks.map((link) => (
              <Link
                key={link}
                href="#"
                className="text-white/70 hover:text-white hover:pl-2 transition-all duration-300"
              >
                {link}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-semibold mb-4 text-blue-300">Contact</h4>
          <div className="space-y-3 text-white/70">
            {contactInfo.map(({ Icon, text }, i) => (
              <div
                key={i}
                className="flex items-center gap-3 hover:text-white transition-colors"
              >
                <Icon size={18} className="text-blue-500" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-semibold mb-4 text-blue-300">Newsletter</h4>
          <div className="space-y-4">
            <p className="text-white/70">Subscribe for exclusive offers</p>
            <Input
              type="email"
              placeholder="Enter your email"
              classNames={{
                input: "text-white placeholder-blue-100/50",
                inputWrapper:
                  "bg-white/10 hover:bg-white/20 border border-white/10",
              }}
            />
            <Button
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold"
              size="lg"
            >
              Subscribe
            </Button>
          </div>
        </div>
      </div>

      <div className="h-px bg-white/10 w-full"></div>

      {/* Copyright */}
      <div className="max-w-6xl mx-auto py-6 px-6 text-center text-white/50">
        <p>
          &copy; {new Date().getFullYear()} Q Airlines. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
