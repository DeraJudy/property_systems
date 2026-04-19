"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, Home, Shield, Heart } from "lucide-react";

const values = [
  { icon: Heart, title: "Purpose Led", description: "Driven by values, not just targets. Every decision centres on the wellbeing of our young people." },
  { icon: Home, title: "Stable Homes", description: "Providing safe, warm, and welcoming accommodation across Peterborough and beyond." },
  { icon: Users, title: "Integrated Care", description: "Combining social care, housing and development under one roof for holistic support." },
  { icon: Shield, title: "For the Vulnerable", description: "Working tirelessly for the most vulnerable members of our society, including care leavers and asylum seekers." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1, 
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" },
  }),
};

const StorySection = () => {
  return (
    /* Increased py-24 to py-32 and md:py-32 to md:py-48 to match VideoSection */
    <section id="story" className="py-32 md:py-48">
      <div className="container mx-auto px-8 md:px-12">
        <div className="grid items-center gap-20 lg:grid-cols-2"> {/* Increased gap from 16 to 20 */}
          
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-[2.5rem] shadow-2xl"> {/* Slightly rounder corners & deeper shadow */}
              <img
                src="https://res.cloudinary.com/dcfl8iot4/image/upload/v1776548512/property-exterior_nu4cek.jpg"
                alt="Kenley Group property"
                className="w-full h-auto object-cover aspect-4/3"
                loading="lazy"
                width={1920}
                height={1080}
              />
            </div>
            {/* Adjusted absolute badge position and padding */}
            <div className="absolute -bottom-8 -right-4 rounded-3xl bg-foreground p-8 text-background shadow-2xl md:-right-8">
              <p className="text-4xl font-black">2023</p>
              <p className="text-xs uppercase tracking-widest text-background/60">Est. Peterborough</p>
            </div>
          </motion.div>

          {/* Text side */}
          <div className="lg:pl-10"> {/* Added padding-left on large screens for breathing room */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground"
            >
              Our Story
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl"
            >
              Welcome to Kenley Group
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-12 text-xl leading-relaxed text-muted-foreground/80"
            >
              Founded by our Chief Executive, Abdul Khan, Kenley Group is a purpose-led 
              organisation driven by our values. We are an integrated Social Care, Housing 
              and Development Company working to provide stable homes built on love for 
              the most vulnerable in our society.
            </motion.p>

            <div className="grid gap-8 sm:grid-cols-2"> {/* Increased gap from 6 to 8 */}
              {values.map((value, i) => (
                <motion.div
                  key={value.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className="group"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground transition-transform group-hover:scale-110">
                    <value.icon className="h-6 w-6 text-background" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-foreground">{value.title}</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;