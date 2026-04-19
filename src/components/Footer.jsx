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

const Footer = () => {
  return (
    <footer className="border-t mx-auto border-border/50 bg-background py-10">
      <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
        <span className="text-base font-bold text-foreground">Kenley Group</span>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Kenley Group — All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
