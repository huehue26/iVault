/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: "#8B5CF6",
          "purple-dark": "#7C3AED",
          "purple-light": "#EDE9FE",
          gray: {
            600: "#4B5563",
            500: "#6B7280",
            400: "#9CA3AF",
            200: "#E5E7EB",
            100: "#F3F4F6",
          },
          green: "#10B981",
          "green-light": "#D1FAE5",
          blue: "#3B82F6",
          "blue-light": "#DBEAFE",
          orange: "#F59E0B",
          "orange-light": "#FEF3C7",
          red: "#EF4444",
          "red-light": "#FEE2E2",
        },
        insurance: {
          blue: "#3B82F6",
          light: "#DBEAFE",
        },
        accent: {
          orange: "#F59E0B",
        },
        success: {
          green: "#10B981",
        },
        warning: {
          red: "#EF4444",
        },
        // Additional blue variants for buttons
        primary: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
        },
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out",
        "slide-up": "slide-up 0.6s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "wiggle": "wiggle 0.5s ease-in-out",
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
        "card-enter": "card-enter 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        "list-enter": "list-enter 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        "stagger-fade": "stagger-fade 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-right": "slide-in-right 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-left": "slide-in-left 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(5deg)" },
          "75%": { transform: "rotate(-5deg)" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "card-enter": {
          "0%": { 
            opacity: "0", 
            transform: "translateY(30px) scale(0.95)",
            filter: "blur(4px)"
          },
          "50%": { 
            opacity: "0.8", 
            transform: "translateY(-5px) scale(1.02)",
            filter: "blur(1px)"
          },
          "100%": { 
            opacity: "1", 
            transform: "translateY(0) scale(1)",
            filter: "blur(0px)"
          },
        },
        "list-enter": {
          "0%": { 
            opacity: "0", 
            transform: "translateX(-20px)",
            filter: "blur(2px)"
          },
          "60%": { 
            opacity: "0.9", 
            transform: "translateX(2px)",
            filter: "blur(0px)"
          },
          "100%": { 
            opacity: "1", 
            transform: "translateX(0)",
            filter: "blur(0px)"
          },
        },
        "stagger-fade": {
          "0%": { 
            opacity: "0", 
            transform: "translateY(20px) scale(0.98)"
          },
          "100%": { 
            opacity: "1", 
            transform: "translateY(0) scale(1)"
          },
        },
        "slide-in-right": {
          "0%": { 
            opacity: "0", 
            transform: "translateX(30px)"
          },
          "100%": { 
            opacity: "1", 
            transform: "translateX(0)"
          },
        },
        "slide-in-left": {
          "0%": { 
            opacity: "0", 
            transform: "translateX(-30px)"
          },
          "100%": { 
            opacity: "1", 
            transform: "translateX(0)"
          },
        },
      },
    },
  },
  plugins: [],
}

