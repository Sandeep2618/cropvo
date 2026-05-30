import type { Metadata } from 'next';
import './globals.css';
import { AntdConfigProvider } from '@/lib/antd-config-provider';
import { ThemeProvider } from '@/lib/theme';
import { AntdRegistry } from '@ant-design/nextjs-registry';

export const metadata: Metadata = {
  title: 'Crovo',
  description: 'Healthcare platform for patients, doctors, and admins',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)]">
        <AntdRegistry>
          <ThemeProvider>
            <AntdConfigProvider>{children}</AntdConfigProvider>
          </ThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
