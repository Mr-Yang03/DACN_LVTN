import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
      fontSize: {
        // Thêm các kích thước pt
        'pt-8': '8pt',
        'pt-9': '9pt',
        'pt-10': '10pt',
        'pt-11': '11pt',
        'pt-12': '12pt',
        'pt-13': '13pt',
        'pt-14': '14pt',
        'pt-16': '16pt',
        'pt-18': '18pt',
        'pt-20': '20pt',
        'pt-22': '22pt',
        'pt-24': '24pt',
        'pt-28': '28pt',
        'pt-32': '32pt',
        'pt-36': '36pt',
        'pt-40': '40pt',
        'pt-48': '48pt',
        'pt-56': '56pt',
        'pt-64': '64pt',
      },
      spacing: {
        // Thêm kích thước pt cho padding, margin, height, width, v.v.
        'pt-1': '1pt',
        'pt-2': '2pt',
        'pt-3': '3pt',
        'pt-4': '4pt',
        'pt-5': '5pt',
        'pt-6': '6pt',
        'pt-8': '8pt',
        'pt-10': '10pt',
        'pt-12': '12pt',
        'pt-14': '14pt',
        'pt-16': '16pt',
        'pt-20': '20pt',
        'pt-24': '24pt',
        'pt-28': '28pt',
        'pt-32': '32pt',
        'pt-36': '36pt',
        'pt-40': '40pt',
        'pt-48': '48pt',
        'pt-56': '56pt',
        'pt-64': '64pt',
        'pt-72': '72pt',
        'pt-80': '80pt',
        'pt-96': '96pt',
      },
      lineHeight: {
        // Thêm các giá trị line-height bằng pt
        'pt-12': '12pt',
        'pt-14': '14pt',
        'pt-16': '16pt',
        'pt-18': '18pt',
        'pt-20': '20pt',
        'pt-24': '24pt',
        'pt-28': '28pt',
        'pt-32': '32pt',
        'pt-36': '36pt',
        'pt-40': '40pt',
      },
      borderWidth: {
        // Thêm các giá trị border-width bằng pt
        'pt-1': '1pt',
        'pt-2': '2pt',
        'pt-3': '3pt',
        'pt-4': '4pt',
        'pt-5': '5pt',
        'pt-6': '6pt',
        'pt-8': '8pt',
      }
  	}
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
