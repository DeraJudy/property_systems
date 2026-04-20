"use client";

import React from "react";
import { motion } from "framer-motion";
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const socials = [
  { icon: Facebook, label: "Facebook", url: "https://www.facebook.com/kenleygroup", handle: "@kenleygroup" },
  { icon: Instagram, label: "Instagram", url: "https://www.instagram.com/kenleygroup", handle: "@kenleygroup" },
  { icon: Linkedin, label: "LinkedIn", url: "https://www.linkedin.com/company/kenley-group/", handle: "Kenley Group" },
];

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.49a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.72a8.2 8.2 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.15z" />
  </svg>
);

const SocialSection = () => {
  return (
    /* Increased py-32 to py-48 for high-impact vertical spacing */
    <section id="connect" className="bg-foreground py-32 md:py-48">
      /* px-8 md:px-12 to align with Video and Footer containers */
      <div className="container mx-auto px-8 md:px-12">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24 text-center" /* Increased mb-20 to mb-24 */
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-background/50">
            Stay Connected
          </p>
          <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-background md:text-5xl lg:text-6xl">
            Follow Our Journey
          </h2>
          <p className="mx-auto max-w-xl text-lg text-background/60 leading-relaxed">
            Join our community across social media and stay updated on our latest work.
          </p>
        </motion.div>

        {/* Social Grid with p-12 for larger card interiors */}
        <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {socials.map((social, i) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group flex flex-col items-center gap-6 rounded-3xl border border-background/10 
                bg-background/5 p-12 transition-all duration-300 hover:bg-background/10 hover:-translate-y-2"
              >
                <Icon className="h-10 w-10 text-background transition-transform group-hover:scale-110" />
                <div className="text-center">
                  <span className="block text-lg font-bold text-background">{social.label}</span>
                  <span className="text-xs text-background/40">{social.handle}</span>
                </div>
              </motion.a>
            );
          })}
          
          <motion.a
            href="https://www.tiktok.com/@kenleygroup"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="group flex flex-col items-center gap-6 rounded-3xl border border-background/10 bg-background/5 p-12 transition-all duration-300 hover:bg-background/10 hover:-translate-y-2"
          >
            <div className="text-background h-10 w-10 flex items-center justify-center transition-transform group-hover:scale-110">
                <TikTokIcon />
            </div>
            <div className="text-center">
                <span className="block text-lg font-bold text-background">TikTok</span>
                <span className="text-xs text-background/40">@kenleygroup</span>
            </div>
          </motion.a>
        </div>

        {/* Contact Info: mt-32 and p-12/p-20 for a massive, grounded contact block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-32 max-w-5xl rounded-3xl border border-background/10 bg-background/5 p-12 md:p-20"
        >
          <h3 className="mb-12 text-center text-3xl font-bold text-background">Get in Touch</h3>
          <div className="grid gap-12 sm:grid-cols-3">
            <a href="mailto:abdul@kenleygroup.co.uk" className="flex flex-col items-center gap-4 text-center group">
              <div className="p-4 rounded-full bg-background/5 group-hover:bg-background/10 transition-colors">
                <Mail className="h-6 w-6 text-background/60 group-hover:text-background" />
              </div>
              <span className="text-base text-background/80 group-hover:text-background transition-colors break-all font-medium">
                abdul@kenleygroup.co.uk
              </span>
            </a>
            <a href="tel:+441733567888" className="flex flex-col items-center gap-4 text-center group">
              <div className="p-4 rounded-full bg-background/5 group-hover:bg-background/10 transition-colors">
                <Phone className="h-6 w-6 text-background/60 group-hover:text-background" />
              </div>
              <span className="text-base text-background/80 group-hover:text-background transition-colors font-medium">
                01733 567888
              </span>
            </a>
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="p-4 rounded-full bg-background/5">
                <MapPin className="h-6 w-6 text-background/60" />
              </div>
              <span className="text-base text-background/80 font-medium">
                217-219 St Pauls Road, PE1 3EH
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialSection;