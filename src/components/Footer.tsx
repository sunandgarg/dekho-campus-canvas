import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { Link } from "react-router-dom";
import logo from "@/assets/dekhocampus-logo.png";

const footerLinks = {
  explore: [
    { label: "Colleges", href: "/colleges" },
    { label: "Courses", href: "/courses" },
    { label: "Exams", href: "/exams" },
    { label: "Rankings", href: "#" },
    { label: "Compare", href: "#" },
  ],
  resources: [
    { label: "News", href: "/articles" },
    { label: "Career Guide", href: "#" },
    { label: "Scholarships", href: "#" },
    { label: "Study Abroad", href: "#" },
    { label: "Webinars", href: "#" },
  ],
  company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Partners", href: "#" },
    { label: "Contact", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Accessibility", href: "#" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background" role="contentinfo">
      {/* Lead Capture Section */}
      <div className="border-b border-background/10">
        <div className="container py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <LeadCaptureForm
              variant="banner"
              title="🎯 Get Expert College Counseling — Free!"
              subtitle="Our counselors have helped 50,000+ students find their dream college"
              source="footer_banner"
            />
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container py-10 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-r from-background/20 to-background/10 p-2 rounded-xl inline-block">
                <img src={logo} alt="DekhoCampus" width={229} height={63} className="h-7 md:h-8 w-auto" />
              </div>
            </Link>
            <p className="text-background/70 text-sm mb-6 max-w-xs">
              India's #1 AI-powered education platform helping students find their perfect career path.
            </p>
            <div className="space-y-3 text-sm text-background/70">
              <a href="mailto:hello@dekhocampus.com" className="flex items-center gap-2 hover:text-accent transition-colors">
                <Mail className="w-4 h-4" />
                <span>hello@dekhocampus.com</span>
              </a>
              <a href="tel:+919876543210" className="flex items-center gap-2 hover:text-accent transition-colors">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <nav aria-label="Explore">
            <h4 className="font-bold text-background mb-4 text-sm">Explore</h4>
            <ul className="space-y-2.5">
              {footerLinks.explore.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-background/70 hover:text-accent transition-colors text-sm">{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Resources">
            <h4 className="font-bold text-background mb-4 text-sm">Resources</h4>
            <ul className="space-y-2.5">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-background/70 hover:text-accent transition-colors text-sm">{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h4 className="font-bold text-background mb-4 text-sm">Company</h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-background/70 hover:text-accent transition-colors text-sm">{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h4 className="font-bold text-background mb-4 text-sm">Legal</h4>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-background/70 hover:text-accent transition-colors text-sm">{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container py-4 md:py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs md:text-sm text-background/70">
            © 2026 DekhoCampus. Made with ❤️ for students in India
          </p>
          <div className="flex items-center gap-2.5">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="w-9 h-9 rounded-lg bg-background/10 flex items-center justify-center hover:bg-accent hover:text-foreground transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
