"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Building2,
  Mail,
  Lock,
  User,
  ArrowRight,
  Building,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <Link href="/" className="mb-8 flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg primary transition-transform group-hover:scale-110">
              <Building2 className="h-5 w-5 primary-foreground-text" />
            </div>
            <span className="text-lg font-bold foreground-text ">
              Kenley Property Systems
            </span>
          </Link>

          <h1 className="mb-2 text-2xl font-bold foreground-text">Welcome back</h1>
          <p className="mb-8 text-sm muted-foreground-text ">
            Sign in to your account to continue
          </p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              <svg key="g" className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>,
              <svg
                key="gh"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>,
              <svg
                key="a"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>,
            ].map((icon, i) => (
              <motion.div
                key={`provider-${i}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-11"
                  type="button"
                  onClick={() => router.push("/dashboard")}
                >
                  {icon}
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="relative mb-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 background px-3 text-xs muted-foreground-text ">
              or register with email
            </span>
          </div>

          <form className="space-y-4">

            <div className="space-y-2">
              <Label htmlFor="email" className="foreground-text">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 muted-foreground-text " />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@organisation.com"
                  className="pl-10 h-11 
                focus-visible:ring-[#1F6B4A] focus-visible:border-[#1F6B4A]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="foreground-text">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 muted-foreground-text " />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  className="pl-10 pr-10 h-11 
                focus-visible:ring-[#1F6B4A] focus-visible:border-[#1F6B4A]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 muted-foreground-text hover:text-[#123d2b] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button type="submit" className="w-full h-11 primary">
                Sign in <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </form>

          <p className="mt-6 text-center text-sm muted-foreground-text">
            Don't have an account?{" "}
            <Link
              href="/Register"
              className="font-medium primary-text hover:underline"
            >
              Create account
            </Link>
          </p>
        </motion.div>
      </div>

      <div className="hidden relative flex-1 overflow-hidden lg:flex">
        <Image
          src="https://res.cloudinary.com/dcfl8iot4/image/upload/v1772186411/auth-bg_kcnllx.jpg"
          alt="Background Image"
          fill
          sizes="100vw"
          className="absolute inset-0 object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#1F6B4A,#2A8C5F,#123D2B)] opacity-85" />

        <div className="relative flex flex-1 items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="max-w-md text-[#f7f2e9]"
          >
            <Building2 className="mb-6 h-12 w-12" />
            <h2 className="mb-4 text-3xl lg:text-4xl font-black">
              Supported housing management, simplified
            </h2>
            <p className="mb-8 text-[#f7f2e9]/80 leading-relaxed">
              Manage properties, service users, cases, and finances all in one 
              integrated platform designed for supported accommodation providers.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { val: "2,400+", label: "Properties Managed" },
                { val: "98.2%", label: "Occupancy Rate" },
                { val: "150+", label: "Organisations" },
                { val: "99.9%", label: "Uptime" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="rounded-lg bg-[#f7f2e9]/10 backdrop-blur-sm p-3"
                >
                  <p className="text-xl font-bold">{stat.val}</p>
                  <p className="text-xs text-[#f7f2e9]/70">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      
    </div>
  );
}
