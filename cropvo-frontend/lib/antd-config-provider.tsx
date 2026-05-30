'use client';

import { ConfigProvider } from 'antd';
import { antdDarkTheme, antdLightTheme } from '@/lib/antd-theme';
import { useTheme } from '@/lib/theme';

export function AntdConfigProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const antdTheme = theme === 'dark' ? antdDarkTheme : antdLightTheme;

  return (
    <ConfigProvider key={theme} theme={antdTheme}>
      {children}
    </ConfigProvider>
  );
}
