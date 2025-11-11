import { 
  Inter, 
  Poppins, 
  Raleway,
  Plus_Jakarta_Sans,
  Work_Sans,
  DM_Sans,
  Space_Grotesk
} from 'next/font/google';

export const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

export const raleway = Raleway({ 
  subsets: ['latin'],
  variable: '--font-raleway',
  display: 'swap',
});

export const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const workSans = Work_Sans({ 
  subsets: ['latin'],
  variable: '--font-work-sans',
  display: 'swap',
});

export const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const fonts = {
  inter: inter.variable,
  poppins: poppins.variable,
  raleway: raleway.variable,
  plusJakarta: plusJakarta.variable,
  workSans: workSans.variable,
  dmSans: dmSans.variable,
  spaceGrotesk: spaceGrotesk.variable,
};

