import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Oriental Feminine Colors
        'rose-gold': "hsl(var(--rose-gold))",
        'blush-pink': "hsl(var(--blush-pink))",
        'soft-rose': "hsl(var(--soft-rose))",
        'amber-warm': "hsl(var(--amber-warm))",
        'champagne': "hsl(var(--champagne))",
        'dusty-rose': "hsl(var(--dusty-rose))",
        'pearl': "hsl(var(--pearl))",
        'silk-cream': "hsl(var(--silk-cream))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        'gradient-gold': 'var(--gradient-gold)',
        'gradient-warm': 'var(--gradient-warm)',
        'gradient-hero': 'var(--gradient-hero)',
        // Oriental Feminine Gradients
        'gradient-rose-gold': 'var(--gradient-rose-gold)',
        'gradient-blush': 'var(--gradient-blush)',
        'gradient-silk': 'var(--gradient-silk)',
        'gradient-oriental': 'var(--gradient-oriental)',
        'gradient-shimmer': 'var(--gradient-shimmer)',
      },
      boxShadow: {
        'luxury': 'var(--shadow-luxury)',
        'gold': 'var(--shadow-gold)',
        'soft': 'var(--shadow-soft)',
        'rose': 'var(--shadow-rose)',
        'glow': 'var(--shadow-glow)',
      },
      fontFamily: {
        sans: ['Cormorant Garamond', 'Playfair Display', 'serif'],
        serif: ['Cormorant Garamond', 'Playfair Display', 'serif'],
        script: ['Dancing Script', 'cursive'],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "slide-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "confetti": {
          "0%": {
            opacity: "1",
            transform: "translateY(-100vh) rotate(0deg)"
          },
          "100%": {
            opacity: "0",
            transform: "translateY(100vh) rotate(720deg)"
          }
        },
        "bounce-slow": {
          "0%, 100%": {
            transform: "translateY(0)"
          },
          "50%": {
            transform: "translateY(-10px)"
          }
        },
        // Oriental Feminine Animations
        "float": {
          "0%, 100%": {
            transform: "translateY(0) rotate(0deg)"
          },
          "25%": {
            transform: "translateY(-6px) rotate(0.5deg)"
          },
          "75%": {
            transform: "translateY(3px) rotate(-0.5deg)"
          }
        },
        "gentle-pulse": {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)"
          },
          "50%": {
            opacity: "0.85",
            transform: "scale(1.02)"
          }
        },
        "bloom": {
          "0%": {
            opacity: "0",
            transform: "scale(0.95) translateY(10px)",
            filter: "blur(4px)"
          },
          "100%": {
            opacity: "1",
            transform: "scale(1) translateY(0)",
            filter: "blur(0)"
          }
        },
        "glow-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 20px hsl(38 75% 50% / 0.2)"
          },
          "50%": {
            boxShadow: "0 0 35px hsl(38 75% 50% / 0.35)"
          }
        },
        "rose-breathe": {
          "0%, 100%": {
            boxShadow: "0 4px 20px hsl(350 35% 60% / 0.1)"
          },
          "50%": {
            boxShadow: "0 4px 30px hsl(350 35% 60% / 0.25)"
          }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "slide-up": "slide-up 0.8s ease-out",
        "confetti": "confetti 3s ease-in-out forwards",
        "bounce-slow": "bounce-slow 2s ease-in-out infinite",
        // Oriental Feminine Animations
        "float": "float 6s ease-in-out infinite",
        "gentle-pulse": "gentle-pulse 4s ease-in-out infinite",
        "bloom": "bloom 0.8s ease-out forwards",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "rose-breathe": "rose-breathe 4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
