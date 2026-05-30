import type { ThemeConfig } from 'antd';
import { theme } from 'antd';

// ── Shared tokens ─────────────────────────────────────────────────────────
const shared: ThemeConfig = {
  token: {
    colorPrimary:   '#00b894',
    colorSuccess:   '#00b894',
    colorError:     '#ef4444',
    colorWarning:   '#f59e0b',
    colorInfo:      '#3b82f6',
    borderRadius:   10,
    borderRadiusLG: 14,
    borderRadiusSM: 8,
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: 14,
  },
  components: {
    Button: {
      borderRadius:   999,
      borderRadiusLG: 999,
      borderRadiusSM: 999,
      controlHeight:   40,
      controlHeightLG: 48,
      fontWeight: 600,
    },
    Input: {
      borderRadius:   999,
      borderRadiusLG: 999,
      controlHeight:   44,
      controlHeightLG: 48,
    },
    Select: {
      borderRadius:   10,
      controlHeight:   40,
    },
    Table: {
      borderRadius:   12,
      borderRadiusLG: 16,
    },
    Message: {
      borderRadius: 10,
    },
    Notification: {
      borderRadius: 14,
    },
    Form: {
      labelFontSize: 13,
    },
  },
};

// ── Dark theme (used when .dark class is on <html>) ───────────────────────
export const antdDarkTheme: ThemeConfig = {
  ...shared,
  cssVar: { key: 'cropvo' },
  algorithm: theme.darkAlgorithm,
  token: {
    ...shared.token,
    // Backgrounds (CSS vars stay in sync with .dark on <html>)
    colorBgContainer:    'var(--bg-input)',
    colorBgElevated:     '#111827',   // dropdown / popover bg
    colorBgLayout:       '#0a0f1a',   // page bg
    colorBgSpotlight:    '#1e3040',
    // Borders
    colorBorder:         '#1e3040',
    colorBorderSecondary:'#1e3040',
    colorSplit:          '#1e3040',
    // Text
    colorText:           '#e8f8f5',
    colorTextSecondary:  '#7ecdc4',
    colorTextTertiary:   '#4a8a82',
    colorTextPlaceholder:'#4a8a82',
    colorTextDisabled:   '#4a8a82',
    // Icon
    colorIcon:           '#4a8a82',
    colorIconHover:      '#7ecdc4',
  },
  components: {
    ...shared.components,
    Input: {
      ...shared.components?.Input,
      colorBgContainer:    'var(--bg-input)',
      activeBg:            'var(--bg-input)',
      hoverBg:             'var(--bg-input)',
      colorBorder:         '#1e3040',
      colorText:           '#e8f8f5',
      colorTextPlaceholder:'#4a8a82',
      activeBorderColor:   '#00b894',
      hoverBorderColor:    '#00b894',
      activeShadow:        '0 0 0 2px rgba(0,184,148,0.15)',
    },
    Select: {
      ...shared.components?.Select,
      colorBgContainer:    '#0d1520',
      colorBorder:         '#1e3040',
      colorText:           '#e8f8f5',
      colorTextPlaceholder:'#4a8a82',
      optionSelectedBg:    '#1a2535',
    },
    Table: {
      ...shared.components?.Table,
      colorBgContainer:    '#111827',
      headerBg:            '#0d1520',
      headerColor:         '#4a8a82',
      rowHoverBg:          '#1a2535',
      borderColor:         '#1e3040',
      colorText:           '#e8f8f5',
    },
    Form: {
      ...shared.components?.Form,
      labelColor:          '#7ecdc4',
    },
    Popconfirm: {
      colorBgElevated:     '#111827',
      colorText:           '#e8f8f5',
    },
    Message: {
      ...shared.components?.Message,
      colorBgElevated:     '#111827',
      colorText:           '#e8f8f5',
    },
  },
};

// ── Light theme ───────────────────────────────────────────────────────────
export const antdLightTheme: ThemeConfig = {
  ...shared,
  cssVar: { key: 'cropvo' },
  algorithm: theme.defaultAlgorithm,
  token: {
    ...shared.token,
    colorBgContainer:    'var(--bg-input)',
    colorBgElevated:     '#ffffff',
    colorBgLayout:       '#f0faf8',
    colorBorder:         '#b2dfdb',
    colorBorderSecondary:'#b2dfdb',
    colorSplit:          '#b2dfdb',
    colorText:           '#0d2b26',
    colorTextSecondary:  '#3d6b63',
    colorTextTertiary:   '#7aada4',
    colorTextPlaceholder:'#7aada4',
    colorIcon:           '#7aada4',
    colorIconHover:      '#3d6b63',
  },
  components: {
    ...shared.components,
    Input: {
      ...shared.components?.Input,
      colorBgContainer:    'var(--bg-input)',
      activeBg:            'var(--bg-input)',
      hoverBg:             'var(--bg-input)',
      colorBorder:         '#b2dfdb',
      colorText:           '#0d2b26',
      colorTextPlaceholder:'#7aada4',
      activeBorderColor:   '#00b894',
      hoverBorderColor:    '#00b894',
      activeShadow:        '0 0 0 2px rgba(0,184,148,0.15)',
    },
    Select: {
      ...shared.components?.Select,
      colorBgContainer:    '#ffffff',
      colorBorder:         '#b2dfdb',
      colorText:           '#0d2b26',
    },
    Table: {
      ...shared.components?.Table,
      colorBgContainer:    '#ffffff',
      headerBg:            '#f0faf8',
      headerColor:         '#7aada4',
      rowHoverBg:          '#e8f8f5',
      borderColor:         '#b2dfdb',
      colorText:           '#0d2b26',
    },
    Form: {
      ...shared.components?.Form,
      labelColor:          '#3d6b63',
    },
  },
};
