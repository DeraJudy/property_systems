// import { motion } from "framer-motion";
import { Users, Home, Shield, Heart } from "lucide-react";
import propertyExterior from "@/assets/property-exterior.jpg";

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
    <section id="story" className="py-24 md:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-3xl">
              <img
                src={propertyExterior}
                alt="Kenley Group property"
                className="w-full h-auto object-cover aspect-[4/3]"
                loading="lazy"
                width={1920}
                height={1080}
              />
            </div>
            <div className="absolute -bottom-6 -right-6 rounded-2xl bg-foreground p-6 text-background shadow-xl">
              <p className="text-3xl font-extrabold">2023</p>
              <p className="text-sm text-background/70">Est. Peterborough</p>
            </div>
          </motion.div>

          {/* Text side */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground"
            >
              Our Story
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-6 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl lg:text-5xl"
            >
              Welcome to Kenley Group
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-10 text-lg leading-relaxed text-muted-foreground"
            >
              Founded by our Chief Executive, Abdul Khan, Kenley Group is a purpose-led 
              organisation driven by our values. We are an integrated Social Care, Housing 
              and Development Company working to provide stable homes built on love for 
              the most vulnerable in our society.
            </motion.p>

            <div className="grid gap-6 sm:grid-cols-2">
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
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-foreground transition-transform group-hover:scale-110">
                    <value.icon className="h-5 w-5 text-background" />
                  </div>
                  <h3 className="mb-1 text-base font-bold text-foreground">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
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