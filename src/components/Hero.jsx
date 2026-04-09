// "use client";
// import React, { useEffect, useState } from "react";
// import {
//   Building2,
//   Users,
//   Shield,
//   BarChart3,
//   FileText,
//   Bell,
//   CheckCircle2,
//   ArrowRight,
//   ChevronRight,
// } from "lucide-react";
// import Link from "next/link";
// import { motion } from "framer-motion";
// import { Button } from "./ui/button";
// import Image from "next/image";

// export default function Hero() {

//   return (


//     <main className="bg-[#f5f0e6] ">
//       <section className="mx-auto max-w-7xl py-24 md:py-32">
//         <div className="grid items-center gap-12 lg:grid-cols-2">
//           <motion.div
//             initial={{ opacity: 0, x: -30 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.6 }}
//             className="text-center lg:text-left"
//           >
//             <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#1F6B4A]/20 accent px-4 py-1.5 text-sm font-medium accent-foreground-text">
//               <span className="h-2 w-2 rounded-full primary animate-pulse" />
//               Purpose-built for supported housing
//             </div>

//             <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-[#123D2B] md:text-5xl lg:text-6xl">
//               Manage housing,{" "}
//               <span className="primary-text">support lives</span>
//             </h1>

//             <p className="mb-8 mx-auto max-w-lg text-lg muted-foreground-text leading-relaxed lg:mx-0">
//               The all-in-one platform for supported housing providers. Manage
//               properties, service users, cases, finances, and compliance — all
//               in one place.
//             </p>

//             <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start px-5 sm:px-0">
//               <Link href="/register">
//                 <Button
//                   size="lg"
//                   className="w-full sm:w-auto bg-[#1F6B4A] hover:bg-[#6B7D74] hover:text-[#123D2B]"
//                 >
//                   Start Free Trial
//                   <ChevronRight className="ml-1 h-4 w-4" />
//                 </Button>
//               </Link>

//               <Link href="/login">
//                 <Button
//                   variant="outline"
//                   size="lg"
//                   className="w-full sm:w-auto"
//                 >
//                   View Demo
//                 </Button>
//               </Link>
//             </div>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.7, delay: 0.2 }}
//             className="relative"
//           >
//             {/* <div className="relative aspect-16/10 overflow-hidden rounded-2xl border border-border/50 shadow-sm transition-shadow hover:shadow-lg">
//               <Image
//                 src="https://res.cloudinary.com/dcfl8iot4/image/upload/v1772186399/hero-image_o8f7xg.jpg"
//                 alt="Kenley Property Systems Dashboard"
//                 fill
//                 sizes="(max-width: 768px) 100vw, 50vw"
//                 className="object-cover"
//               />
//             </div> */}
//             <div className="relative aspect-16/10 overflow-hidden rounded-2xl border border-border/50 shadow-sm transition-shadow hover:shadow-lg">
//               <video
//                 src="https://res.cloudinary.com/dcfl8iot4/video/upload/v1775683315/WhatsApp_Video_2026-04-08_at_22.18.14_knciym.mp4"
//                 className="absolute inset-0 h-full w-full object-cover"
//                 autoPlay
//                 loop
//                 muted
//                 playsInline
//                 controls
//               >
//                 Your browser does not support the video tag.
//               </video>
//             </div>
//             <div className="absolute -bottom-4 -left-4 rounded-xl bg-card p-4 shadow-card-hover border border-border/50">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-lg accent">
//                   <BarChart3 className="h-5 w-5 primary-text" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-semibold text-[#123D2B]">98.2%</p>
//                   <p className="text-xs text-[#6B7D74]">Occupancy Rate</p>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </section>
//     </main>
//   );
// }


"use client";
import React, { useEffect, useState } from "react";

export default function Hero() {

  return (
    <div className="flex items-center justify-center min-h-screen background p-4 sm:p-8 lg:p-12 perspective-[1000px] overflow-hidden">

      {/* THE 3D FRAME */}

      {/* THE 3D FRAME - Flattened class strings to prevent hydration mismatch */}

      <div

        className="group relative p-8 card border-[16px] border-[#123d2b] rounded-[3rem] shadow-[20px_20px_60px_rgba(18,61,43,0.3),-10px_-10px_30px_rgba(255,255,255,0.5),inset_5px_5px_10px_rgba(0,0,0,0.2)] max-w-4xl w-full transition-all duration-500 ease-out hover:[transform:rotateX(2deg)_rotateY(-2deg)] hover:shadow-[30px_30px_70px_rgba(18,61,43,0.4)]"

      >

        {/* Metallic Inner Inset */}

        <div className="absolute inset-0 rounded-[2.2rem] border-2 border-[#1f6b4a]/40 m-1 pointer-events-none" />



        {/* Elegant 'Mat' / Inner Border */}

        <div className="relative aspect-16/10 overflow-hidden rounded-2xl border border-border/50 shadow-[inset_0_10px_20px_rgba(0,0,0,0.3)] bg-white">

          <video

            src="https://res.cloudinary.com/dcfl8iot4/video/upload/v1775683315/WhatsApp_Video_2026-04-08_at_22.18.14_knciym.mp4"

            className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"

            autoPlay

            loop

            muted

            playsInline

          >

            Your browser does not support the video tag.

          </video>



          {/* 3D Glass Reflection Overlay */}

          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 -translate-x-10 group-hover:translate-x-10 transition-transform" />

        </div>



        {/* Reactive 3D 'Light' Corner Accents */}

        <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-gradient-to-br from-[#1f6b4a] to-[#123d2b] shadow-md border border-white/20" />

        <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-gradient-to-br from-[#1f6b4a] to-[#123d2b] shadow-md border border-white/20" />

        <div className="absolute bottom-4 left-4 w-3 h-3 rounded-full bg-gradient-to-br from-[#1f6b4a] to-[#123d2b] shadow-md border border-white/20" />

        <div className="absolute bottom-4 right-4 w-3 h-3 rounded-full bg-gradient-to-br from-[#1f6b4a] to-[#123d2b] shadow-md border border-white/20" />



        {/* Floating Tag */}

        <div className="absolute -bottom-6 right-12 bg-[#123d2b] text-[#f7f2e9] px-4 py-1 rounded-md text-xs font-medium shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">

          Welcome to Kenley Poperty Systems

        </div>

      </div>

    </div>
  );
}