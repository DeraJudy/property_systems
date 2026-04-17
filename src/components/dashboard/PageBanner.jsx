import { motion } from "framer-motion";

// Using the Cloudinary URLs provided
const bannerMap = {
  dashboard: "https://res.cloudinary.com/dcfl8iot4/image/upload/v1776349338/banner-dashboard_aunga7.jpg",
  properties: "https://res.cloudinary.com/dcfl8iot4/image/upload/v1776349743/banner-properties_klu3vt.jpg",
  addProperty: "https://res.cloudinary.com/dcfl8iot4/image/upload/v1776416864/Gemini_Generated_Image_4j8t7i4j8t7i4j8t_zggwk9.png",
  editProperty: "https://res.cloudinary.com/dcfl8iot4/image/upload/v1776427734/Gemini_Generated_Image_cmamnbcmamnbcmam_wfrkg9.png",
  people: "https://res.cloudinary.com/dcfl8iot4/image/upload/v1776349460/Gemini_Generated_Image_4orrbk4orrbk4orr_jdxldx.png",
  finance: "https://res.cloudinary.com/dcfl8iot4/image/upload/v1776349340/banner-finance_tsrtyd.jpg",
  compliance: "https://res.cloudinary.com/dcfl8iot4/image/upload/v1776349360/banner-operations_cv4msh.jpg",
  operations: "https://res.cloudinary.com/dcfl8iot4/image/upload/v1776349328/banner-compliance_bwgt91.jpg", 
};

const PageBanner = ({ title, subtitle, category = "operations" }) => {
  // Select image from map, fallback to operations if category doesn't exist
  const image = bannerMap[category] || bannerMap.operations;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative mb-6 overflow-hidden rounded-2xl"
    >
      <div className="relative h-36 md:h-44">
        <img
          src={image}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        {/* Dark overlay to make text readable */}
        <div className="absolute inset-0 bg-linear-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        
        <div className="relative z-10 flex h-full flex-col justify-center px-6 md:px-10">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl font-extrabold text-[#FFFDD0] md:text-3xl"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-1 text-sm text-background/70 md:text-base"
          >
            {subtitle}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default PageBanner;