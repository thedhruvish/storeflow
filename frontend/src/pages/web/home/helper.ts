import {
  Cloud,
  Fingerprint,
  Lock,
  Server,
  Share2,
  ShieldCheck,
} from "lucide-react";

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
} as const;

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Faster stagger for snappier feel
      delayChildren: 0.2,
    },
  },
} as const;

export const featuresList = [
  {
    icon: Server,
    title: "S3 Compatible",
    desc: "Connect directly to AWS S3, MinIO, or any compatible storage backend.",
  },
  {
    icon: Cloud,
    title: "Import from Drive",
    desc: "Seamlessly migrate and organize files from Google Drive.",
  },
  {
    icon: Share2,
    title: "Secure Sharing",
    desc: "Generate time-limited, password-protected sharing links.",
  },
  {
    icon: ShieldCheck,
    title: "Modern Authentication",
    desc: "Sign in using Google OAuth, GitHub OAuth, or traditional email and password authentication.",
  },
  {
    icon: Fingerprint,
    title: "Advanced MFA & Passkeys",
    desc: "Protect accounts with multi-factor authentication including email OTP, TOTP authenticator apps, and passkeys.",
  },

  {
    icon: Lock,
    title: "Low Cast for the host",
    desc: "It compatible to run serverless envriament and also it can run you vps both compatible",
  },
] as const;
