// "use client";

// import { useState } from "react";
// import { supabase } from "@/lib/supabase";
// import { Eye, EyeOff, UserPlus, Lock, Mail, User } from "lucide-react";

// export default function AddUserPage() {
//   const [formData, setFormData] = useState({
//     full_name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: "", text: "" });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSignUp = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage({ type: "", text: "" });

//     if (formData.password !== formData.confirmPassword) {
//       setMessage({ type: "error", text: "Passwords do not match!" });
//       setLoading(false);
//       return;
//     }

//     const { data, error } = await supabase.auth.signUp({
//       email: formData.email,
//       password: formData.password,
//       options: {
//         data: {
//           full_name: formData.full_name,
//         },
//       },
//     });

//     if (error) {
//       setMessage({ type: "error", text: error.message });
//     } else {
//       setMessage({ type: "success", text: "User created successfully! Check email for verification." });
//       setFormData({ full_name: "", email: "", password: "", confirmPassword: "" });
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-black flex items-center justify-center p-4">
//       <div className="max-w-md w-full bg-zinc-900 border border-amber-500/30 rounded-2xl p-8 shadow-2xl">
        
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="inline-flex p-3 rounded-full bg-amber-500/10 mb-4">
//             <UserPlus className="text-amber-500" size={32} />
//           </div>
//           <h1 className="text-3xl font-bold text-white tracking-tight">
//             Add New <span className="text-amber-500">User</span>
//           </h1>
//           <p className="text-zinc-400 mt-2">Enter credentials for the new account</p>
//         </div>

//         <form onSubmit={handleSignUp} className="space-y-5">
//           {/* Full Name */}
//           <div>
//             <label className="block text-sm font-medium text-amber-500 mb-1.5">Full Name</label>
//             <div className="relative">
//               <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
//               <input
//                 type="text"
//                 name="full_name"
//                 required
//                 value={formData.full_name}
//                 onChange={handleChange}
//                 className="w-full bg-zinc-800 border border-zinc-700 text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
//                 placeholder="John Doe"
//               />
//             </div>
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium text-amber-500 mb-1.5">Email Address</label>
//             <div className="relative">
//               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
//               <input
//                 type="email"
//                 name="email"
//                 required
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full bg-zinc-800 border border-zinc-700 text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
//                 placeholder="email@example.com"
//               />
//             </div>
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-sm font-medium text-amber-500 mb-1.5">Password</label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 required
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="w-full bg-zinc-800 border border-zinc-700 text-white pl-10 pr-12 py-2.5 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
//                 placeholder="••••••••"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-amber-500 transition-colors"
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//           </div>

//           {/* Confirm Password */}
//           <div>
//             <label className="block text-sm font-medium text-amber-500 mb-1.5">Confirm Password</label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="confirmPassword"
//                 required
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 className="w-full bg-zinc-800 border border-zinc-700 text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
//                 placeholder="••••••••"
//               />
//             </div>
//           </div>

//           {/* Status Message */}
//           {message.text && (
//             <div className={`p-3 rounded-lg text-sm ${message.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
//               {message.text}
//             </div>
//           )}

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
//           >
//             {loading ? "Creating User..." : "Create Account"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation"; // Import the router
import { Eye, EyeOff, UserPlus, Lock, Mail, User } from "lucide-react";

export default function AddUserPage() {
  const router = useRouter(); // Initialize router
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    // 1. Create the user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.full_name,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else {
      /* 2. IMPORTANT: Supabase often auto-logs in the new user on the client side.
         We sign out immediately to ensure the "Admin/Manager" session stays active
         or simply to prevent the browser from switching identities.
      */
      await supabase.auth.signOut();

      // 3. Success! Redirect back to the users list page
      router.push("/users"); 
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900 border border-amber-500/30 rounded-2xl p-8 shadow-2xl">
        
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-amber-500/10 mb-4">
            <UserPlus className="text-amber-500" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Add New <span className="text-amber-500">User</span>
          </h1>
        </div>

        <form onSubmit={handleSignUp} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-amber-500 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type="text"
                name="full_name"
                required
                value={formData.full_name}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-amber-500"
                placeholder="Name"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-amber-500 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-amber-500"
                placeholder="Email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-amber-500 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 text-white pl-10 pr-12 py-2.5 rounded-lg focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-amber-500 mb-1.5">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg text-sm bg-red-500/10 text-red-500 border border-red-500/20">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 rounded-lg transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Creating..." : "Add User"}
          </button>
        </form>
      </div>
    </div>
  );
}