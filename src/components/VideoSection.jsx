"use client";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

const VideoSection = () => {
  return (
    /* Increased py-24 to py-32 and md:py-32 to md:py-48 for a more spacious feel */
    <section id="video" className="py-32 md:py-48">
      {/* Added px-8 to match the footer's horizontal breathing room */}
      <div className="container mx-auto px-8 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center" /* Increased mb-12 to mb-16 */
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            See Our Impact
          </p>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Watch Our Story
          </h2>
          <p className="mx-auto max-w-lg text-lg text-muted-foreground">
            See how we're innovating for a brighter future in social care and supported housing.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-4xl"
        >
          <div className="overflow-hidden rounded-3xl border border-border/50 shadow-xl">
            <div className="relative aspect-video bg-foreground/5">
              <iframe
                src="https://player.vimeo.com/video/1081663648?h=35d90c4ba0&badge=0&autopause=0&player_id=0&app_id=58479&transparent=0&color=000000"
                className="absolute inset-0 h-full w-full"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                allowFullScreen
                title="Kenley Group"
              />
            </div>
          </div>
        </motion.div>

        {/* Secondary video section with increased mt-20 for better separation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-20 max-w-3xl"
        >
          <div className="rounded-2xl border border-border/50 bg-card p-8 md:p-10">
            <div className="flex flex-col gap-8 md:flex-row md:items-center">
              <div className="flex-1">
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Key Working Sessions
                </p>
                <h3 className="mb-2 text-xl font-bold text-foreground">
                  Business Contingency Plan
                </h3>
                <p className="text-base text-muted-foreground">
                  Regulation 23 — Business Contingency Planning walkthrough session.
                </p>
              </div>
              <div className="overflow-hidden rounded-xl md:w-72">
                <div className="relative aspect-video bg-foreground/5">
                  <iframe
                    src="https://player.vimeo.com/video/1035980441?h=d3875df656&badge=0&autopause=0&player_id=0&app_id=58479&transparent=0&color=000000"
                    className="absolute inset-0 h-full w-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title="Business Contingency Plan"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection;