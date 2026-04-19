// "use client";
// import {
//   Building2,
// } from "lucide-react";


// export default function Footer() {
//   return (
//     <footer className="border-t border-[#e1dbd2]/50 bg-[#fbf8f2]/50 py-12">
//       <section className="mx-auto max-w-7xl ">
//         <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
//           <div className="flex items-center gap-2">
//             <div className="flex h-8 w-8 items-center justify-center rounded-lg primary">
//               <Building2 className="h-4 w-4 primary-foreground-text" />
//             </div>
//             <span className="font-semibold foreground-text">
//               Kenley Property Systems
//             </span>
//           </div>
//           <p className="text-sm muted-foreground-text">
//             © 2026 Kenley Property Systems. All rights reserved.
//           </p>
//         </div>
//       </section>
//     </footer>
//   );
// }


"use client";
import { useState, useEffect } from "react";

const Footer = () => {
  const [year, setYear] = useState("");

  // Use useEffect to set the year only after the component mounts on the client
  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  return (
    /* Increased py-10 to py-16 or py-20 for more vertical padding */
    /* Added px-8 for more horizontal breathing room on small screens */
    <footer className="border-t border-border/50 bg-background py-16 px-8">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 md:flex-row">
        <span className="text-xl font-black tracking-tight text-foreground">
          Kenley Group
        </span>
        
        <p className="text-sm text-muted-foreground">
          © {year || "2026"} Kenley Group — All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;