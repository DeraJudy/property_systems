"use client";

import React from "react";
import { motion } from "framer-motion";
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const socials = [
  { icon: Facebook, label: "Facebook", url: "https://www.facebook.com/kenleygroup", handle: "@kenleygroup" },
  { icon: Instagram, label: "Instagram", url: "https://www.instagram.com/kenleygroup", handle: "@kenleygroup" },
  { icon: Linkedin, label: "LinkedIn", url: "https://www.linkedin.com/kenleygroup", handle: "Kenley Group" },
];

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.49a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.72a8.2 8.2 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.15z" />
  </svg>
);

const SocialSection = () => {
  return (
    <section id="connect" className="bg-foreground py-24 md:py-32">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-background/50">
            Stay Connected
          </p>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-background md:text-4xl lg:text-5xl">
            Follow Our Journey
          </h2>
          <p className="mx-auto max-w-lg text-lg text-background/60">
            Join our community across social media and stay updated on our latest work.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                className="group flex flex-col items-center gap-3 rounded-2xl border border-background/10 bg-background/5 p-8 transition-all duration-300 hover:bg-background/10 hover:-translate-y-1"
              >
                <Icon className="h-8 w-8 text-background transition-transform group-hover:scale-110" />
                <span className="text-base font-bold text-background">{social.label}</span>
                <span className="text-xs text-background/50">{social.handle}</span>
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
            className="group flex flex-col items-center gap-3 rounded-2xl border border-background/10 bg-background/5 p-8 transition-all duration-300 hover:bg-background/10 hover:-translate-y-1"
          >
            <TikTokIcon />
            <span className="text-base font-bold text-background">TikTok</span>
            <span className="text-xs text-background/50">@kenleygroup</span>
          </motion.a>
        </div>

        {/* Contact info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-16 max-w-2xl rounded-2xl border border-background/10 bg-background/5 p-8 md:p-10"
        >
          <h3 className="mb-6 text-center text-xl font-bold text-background">Get in Touch</h3>
          <div className="grid gap-6 sm:grid-cols-3">
            <a href="mailto:office@kenleygroup.co.uk" className="flex flex-col items-center gap-2 text-center group">
              <Mail className="h-5 w-5 text-background/60 group-hover:text-background transition-colors" />
              <span className="text-sm text-background/80 group-hover:text-background transition-colors">
                office@kenleygroup.co.uk
              </span>
            </a>
            <a href="tel:+441733567888" className="flex flex-col items-center gap-2 text-center group">
              <Phone className="h-5 w-5 text-background/60 group-hover:text-background transition-colors" />
              <span className="text-sm text-background/80 group-hover:text-background transition-colors">
                01733 567888
              </span>
            </a>
            <div className="flex flex-col items-center gap-2 text-center">
              <MapPin className="h-5 w-5 text-background/60" />
              <span className="text-sm text-background/80">217-219 St Pauls Road, PE1 3EH</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialSection;