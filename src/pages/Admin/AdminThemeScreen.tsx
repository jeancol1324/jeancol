import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Palette, Sun, Moon, Save, RotateCcw, Download, Upload, Eye,
  Check, Copy, Plus, Trash2, ChevronDown, ChevronRight, Sparkles,
  Layers, Type, Square, Search, Undo, Redo, X, Sliders, AlertTriangle,
  CheckCircle2, Smartphone, Tablet, Monitor as MonitorIcon, Star, Edit3,
  RefreshCw, Paintbrush, Shuffle, Columns, ArrowLeftRight, Eye as EyeIcon,
  ArrowLeft
} from 'lucide-react';

import { useToast } from '../../context/ToastContext';

/* ─── Types ─── */
interface ColorConfig {
  primary: string; primaryHover: string; secondary: string;
  background: string; surface: string; surfaceHover: string;
  foreground: string; foregroundMuted: string;
  border: string; borderHover: string;
  success: string; successBg: string; warning: string; warningBg: string;
  error: string; errorBg: string; info: string; infoBg: string;
  rating: string; badgeNew: string; badgeSale: string; badgeTop: string;
}
interface ThemeConfig {
  light: ColorConfig; 
  dark: ColorConfig;
}
interface SavedTheme { id: string; name: string; theme: ThemeConfig; isFavorite?: boolean; createdAt: number }
interface PresetTheme { id: string; name: string; description: string; colors: ThemeConfig }

/* ─── Default Theme ─── */
const defaultTheme: ThemeConfig = {
  light: {
    primary: '#FF6321', primaryHover: '#E85A1B', secondary: '#1a1a1a',
    background: '#fdfdfd', surface: '#ffffff', surfaceHover: '#f4f4f5',
    foreground: '#09090b', foregroundMuted: '#71717a', border: '#e4e4e7', borderHover: '#a1a1aa',
    success: '#10B981', successBg: '#dcfce7', warning: '#F59E0B', warningBg: '#fef3c7',
    error: '#EF4444', errorBg: '#fee2e2', info: '#3B82F6', infoBg: '#dbeafe',
    rating: '#FBBF24', badgeNew: '#10B981', badgeSale: '#EF4444', badgeTop: '#1a1a1a',
  },
  dark: {
    primary: '#FF6321', primaryHover: '#FF7A3D', secondary: '#ffffff',
    background: '#050505', surface: '#18181b', surfaceHover: '#27272a',
    foreground: '#f8f8f8', foregroundMuted: '#a1a1aa', border: '#27272a', borderHover: '#3f3f46',
    success: '#34d399', successBg: '#052e16', warning: '#fbbf24', warningBg: '#1c1917',
    error: '#f87171', errorBg: '#450a0a', info: '#60a5fa', infoBg: '#172554',
    rating: '#FBBF24', badgeNew: '#34d399', badgeSale: '#f87171', badgeTop: '#ffffff',
  },
};

/* ─── Apply Theme to CSS ─── */
const applyThemeToCSS = (config: ThemeConfig, mode: 'light' | 'dark') => {
  const root = document.documentElement;
  const colors = config[mode];
  root.style.setProperty('--color-primary', colors.primary);
  root.style.setProperty('--color-primary-hover', colors.primaryHover);
  root.style.setProperty('--color-secondary', colors.secondary);
  root.style.setProperty('--color-background', colors.background);
  root.style.setProperty('--color-surface', colors.surface);
  root.style.setProperty('--color-surface-hover', colors.surfaceHover);
  root.style.setProperty('--color-foreground', colors.foreground);
  root.style.setProperty('--color-foreground-muted', colors.foregroundMuted);
  root.style.setProperty('--color-border', colors.border);
  root.style.setProperty('--color-border-hover', colors.borderHover);
  root.style.setProperty('--color-success', colors.success);
  root.style.setProperty('--color-success-bg', colors.successBg);
  root.style.setProperty('--color-warning', colors.warning);
  root.style.setProperty('--color-warning-bg', colors.warningBg);
  root.style.setProperty('--color-error', colors.error);
  root.style.setProperty('--color-error-bg', colors.errorBg);
  root.style.setProperty('--color-info', colors.info);
  root.style.setProperty('--color-info-bg', colors.infoBg);
  root.style.setProperty('--color-rating', colors.rating);
  root.style.setProperty('--color-badge-new', colors.badgeNew);
  root.style.setProperty('--color-badge-sale', colors.badgeSale);
  root.style.setProperty('--color-badge-top', colors.badgeTop);
  document.body.classList.toggle('dark', mode === 'dark');
};

const presetThemes: PresetTheme[] = [
  { id: 'default', name: 'Naranja Clásico', description: 'Naranja vibrante', colors: defaultTheme },
  { id: 'ocean', name: 'Océano', description: 'Azules serenos', colors: { light: { primary: '#0066FF', primaryHover: '#0052CC', secondary: '#1a1a1a', background: '#f8fafc', surface: '#ffffff', surfaceHover: '#f1f5f9', foreground: '#0f172a', foregroundMuted: '#64748b', border: '#e2e8f0', borderHover: '#94a3b8', success: '#10B981', successBg: '#dcfce7', warning: '#F59E0B', warningBg: '#fef3c7', error: '#EF4444', errorBg: '#fee2e2', info: '#3B82F6', infoBg: '#dbeafe', rating: '#FBBF24', badgeNew: '#10B981', badgeSale: '#EF4444', badgeTop: '#0066FF' }, dark: { primary: '#3B82F6', primaryHover: '#60A5FA', secondary: '#ffffff', background: '#020617', surface: '#0f172a', surfaceHover: '#1e293b', foreground: '#f8fafc', foregroundMuted: '#94a3b8', border: '#1e293b', borderHover: '#334155', success: '#34d399', successBg: '#052e16', warning: '#fbbf24', warningBg: '#1c1917', error: '#f87171', errorBg: '#450a0a', info: '#60a5fa', infoBg: '#172554', rating: '#FBBF24', badgeNew: '#34d399', badgeSale: '#f87171', badgeTop: '#3B82F6' } } },
  { id: 'forest', name: 'Bosque', description: 'Verdes naturales', colors: { light: { primary: '#059669', primaryHover: '#047857', secondary: '#1a1a1a', background: '#f9fafb', surface: '#ffffff', surfaceHover: '#f3f4f6', foreground: '#111827', foregroundMuted: '#6b7280', border: '#e5e7eb', borderHover: '#9ca3af', success: '#059669', successBg: '#d1fae5', warning: '#D97706', warningBg: '#fef3c7', error: '#DC2626', errorBg: '#fee2e2', info: '#2563EB', infoBg: '#dbeafe', rating: '#F59E0B', badgeNew: '#059669', badgeSale: '#DC2626', badgeTop: '#059669' }, dark: { primary: '#10B981', primaryHover: '#34D399', secondary: '#ffffff', background: '#022c22', surface: '#064e3b', surfaceHover: '#065f46', foreground: '#ecfdf5', foregroundMuted: '#6ee7b7', border: '#065f46', borderHover: '#059669', success: '#34d399', successBg: '#052e16', warning: '#fbbf24', warningBg: '#1c1917', error: '#f87171', errorBg: '#450a0a', info: '#60a5fa', infoBg: '#172554', rating: '#FBBF24', badgeNew: '#34d399', badgeSale: '#f87171', badgeTop: '#10B981' } } },
  { id: 'royal', name: 'Púrpura', description: 'Elegancia real', colors: { light: { primary: '#7C3AED', primaryHover: '#6D28D9', secondary: '#1a1a1a', background: '#faf5ff', surface: '#ffffff', surfaceHover: '#f5f3ff', foreground: '#1e1b4b', foregroundMuted: '#7c3aed', border: '#ede9fe', borderHover: '#c4b5fd', success: '#10B981', successBg: '#dcfce7', warning: '#F59E0B', warningBg: '#fef3c7', error: '#EF4444', errorBg: '#fee2e2', info: '#8B5CF6', infoBg: '#ede9fe', rating: '#FBBF24', badgeNew: '#7C3AED', badgeSale: '#EF4444', badgeTop: '#7C3AED' }, dark: { primary: '#A78BFA', primaryHover: '#C4B5FD', secondary: '#ffffff', background: '#0c0a1d', surface: '#1e1b4b', surfaceHover: '#2e1065', foreground: '#faf5ff', foregroundMuted: '#c4b5fd', border: '#2e1065', borderHover: '#4c1d95', success: '#34d399', successBg: '#052e16', warning: '#fbbf24', warningBg: '#1c1917', error: '#f87171', errorBg: '#450a0a', info: '#a78bfa', infoBg: '#172554', rating: '#FBBF24', badgeNew: '#a78bfa', badgeSale: '#f87171', badgeTop: '#A78BFA' } } },
  { id: 'gothic', name: 'Rosa Noche', description: 'Rosa moderno', colors: { light: { primary: '#EC4899', primaryHover: '#DB2777', secondary: '#1a1a1a', background: '#fdf2f8', surface: '#ffffff', surfaceHover: '#fce7f3', foreground: '#831843', foregroundMuted: '#be185d', border: '#fbcfe8', borderHover: '#f9a8d4', success: '#10B981', successBg: '#dcfce7', warning: '#F59E0B', warningBg: '#fef3c7', error: '#EF4444', errorBg: '#fee2e2', info: '#EC4899', infoBg: '#fce7f3', rating: '#EC4899', badgeNew: '#EC4899', badgeSale: '#BE185D', badgeTop: '#1a1a1a' }, dark: { primary: '#F472B6', primaryHover: '#FB7185', secondary: '#ffffff', background: '#0f0f0f', surface: '#1a1a1a', surfaceHover: '#262626', foreground: '#fdf2f8', foregroundMuted: '#fbcfe8', border: '#262626', borderHover: '#404040', success: '#34d399', successBg: '#052e16', warning: '#fbbf24', warningBg: '#1c1917', error: '#f87171', errorBg: '#450a0a', info: '#f472b6', infoBg: '#172554', rating: '#F472B6', badgeNew: '#F472B6', badgeSale: '#FB7185', badgeTop: '#ffffff' } } },
  { id: 'minimal', name: 'Azul Pro', description: 'Limpio y profesional', colors: { light: { primary: '#2563EB', primaryHover: '#1D4ED8', secondary: '#374151', background: '#ffffff', surface: '#F9FAFB', surfaceHover: '#F3F4F6', foreground: '#111827', foregroundMuted: '#6B7280', border: '#E5E7EB', borderHover: '#D1D5DB', success: '#059669', successBg: '#D1FAE5', warning: '#D97706', warningBg: '#FEF3C7', error: '#DC2626', errorBg: '#FEE2E2', info: '#2563EB', infoBg: '#DBEAFE', rating: '#F59E0B', badgeNew: '#2563EB', badgeSale: '#DC2626', badgeTop: '#374151' }, dark: { primary: '#3B82F6', primaryHover: '#60A5FA', secondary: '#ffffff', background: '#0f1117', surface: '#1a1d27', surfaceHover: '#252836', foreground: '#f0f2f8', foregroundMuted: '#8b90a0', border: '#252836', borderHover: '#363a4a', success: '#059669', successBg: '#D1FAE5', warning: '#D97706', warningBg: '#FEF3C7', error: '#DC2626', errorBg: '#FEE2E2', info: '#3B82F6', infoBg: '#DBEAFE', rating: '#F59E0B', badgeNew: '#3B82F6', badgeSale: '#DC2626', badgeTop: '#374151' } } },
  { id: 'energetic', name: 'Rojo', description: 'Pasión y energía', colors: { light: { primary: '#DC2626', primaryHover: '#B91C1C', secondary: '#1a1a1a', background: '#fef2f2', surface: '#ffffff', surfaceHover: '#fee2e2', foreground: '#7f1d1d', foregroundMuted: '#991b1b', border: '#fecaca', borderHover: '#fca5a5', success: '#10B981', successBg: '#dcfce7', warning: '#F59E0B', warningBg: '#fef3c7', error: '#DC2626', errorBg: '#fee2e2', info: '#DC2626', infoBg: '#fee2e2', rating: '#DC2626', badgeNew: '#10B981', badgeSale: '#DC2626', badgeTop: '#DC2626' }, dark: { primary: '#EF4444', primaryHover: '#F87171', secondary: '#ffffff', background: '#0a0a0a', surface: '#1a1a1a', surfaceHover: '#262626', foreground: '#fef2f2', foregroundMuted: '#fecaca', border: '#262626', borderHover: '#404040', success: '#34d399', successBg: '#052e16', warning: '#fbbf24', warningBg: '#1c1917', error: '#EF4444', errorBg: '#450a0a', info: '#EF4444', infoBg: '#450a0a', rating: '#EF4444', badgeNew: '#34d399', badgeSale: '#EF4444', badgeTop: '#ffffff' } } },
];

const colorCategories = [
  { id: 'primary', name: 'Primarios', icon: Sparkles, colors: [
    { key: 'primary', label: 'Principal' }, { key: 'primaryHover', label: 'Hover' }, { key: 'secondary', label: 'Secundario' }
  ]},
  { id: 'background', name: 'Fondos', icon: Layers, colors: [
    { key: 'background', label: 'Fondo' }, { key: 'surface', label: 'Superficie' }, { key: 'surfaceHover', label: 'Superficie Hover' }
  ]},
  { id: 'text', name: 'Texto', icon: Type, colors: [
    { key: 'foreground', label: 'Principal' }, { key: 'foregroundMuted', label: 'Secundario' }
  ]},
  { id: 'border', name: 'Bordes', icon: Square, colors: [
    { key: 'border', label: 'Normal' }, { key: 'borderHover', label: 'Hover' }
  ]},
  { id: 'status', name: 'Estados', icon: AlertTriangle, colors: [
    { key: 'success', label: 'Éxito' }, { key: 'successBg', label: 'Fondo Éxito' },
    { key: 'warning', label: 'Advertencia' }, { key: 'warningBg', label: 'Fondo Advertencia' },
    { key: 'error', label: 'Error' }, { key: 'errorBg', label: 'Fondo Error' },
    { key: 'info', label: 'Info' }, { key: 'infoBg', label: 'Fondo Info' }
  ]},
  { id: 'special', name: 'Especiales', icon: Star, colors: [
    { key: 'rating', label: 'Estrellas' }, { key: 'badgeNew', label: 'Badge Nuevo' },
    { key: 'badgeSale', label: 'Badge Oferta' }, { key: 'badgeTop', label: 'Badge Top' }
  ]},
];

const generatePalette = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lighten = (a: number) => `#${[Math.min(255, Math.round(r+(255-r)*a)), Math.min(255, Math.round(g+(255-g)*a)), Math.min(255, Math.round(b+(255-b)*a))].map(x => x.toString(16).padStart(2,'0')).join('')}`;
  const darken = (a: number) => `#${[Math.max(0, Math.round(r*(1-a))), Math.max(0, Math.round(g*(1-a))), Math.max(0, Math.round(b*(1-a)))].map(x => x.toString(16).padStart(2,'0')).join('')}`;
  return [lighten(0.3), lighten(0.15), hex, darken(0.15), darken(0.3)];
};

const getContrastRatio = (c1: string, c2: string) => {
  const lum = (hex: string) => {
    const rgb = (hex.replace('#','').match(/.{2}/g) ?? []).map(x => parseInt(x,16)/255);
    const [r,g,b] = rgb.map(c => c<=0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4));
    return 0.2126*r + 0.7152*g + 0.0722*b;
  };
  const l1 = lum(c1), l2 = lum(c2);
  return (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05);
};

const getWCAGLevel = (ratio: number) => {
  if (ratio >= 7) return { level: 'AAA', ok: true };
  if (ratio >= 4.5) return { level: 'AA', ok: true };
  if (ratio >= 3) return { level: 'AA Large', ok: true };
  return { level: 'Fail', ok: false };
};

/* ─── Styles ─── */
const styles = `
  .theme-editor * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
  .theme-editor .mono { font-family: 'DM Mono', monospace; }

  .theme-editor {
    --accent: #FF6321;
    --radius: 10px;
    height: 100vh;
    overflow: hidden;
    background: #f5f4f0;
    color: #1a1a1a;
  }

  /* Sidebar */
  .te-sidebar {
    width: 280px;
    min-width: 280px;
    background: #1a1a1a;
    color: #f5f4f0;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
    scrollbar-width: none;
  }
  .te-sidebar::-webkit-scrollbar { display: none; }

  .te-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 28px 20px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .te-logo-dot {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: var(--accent);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .te-logo-text { font-size: 13px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; }
  .te-logo-sub { font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 1px; }

  /* Mode toggle */
  .te-mode-toggle {
    display: flex;
    margin: 16px;
    background: rgba(255,255,255,0.06);
    border-radius: 8px;
    padding: 3px;
  }
  .te-mode-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 7px 0;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    color: rgba(255,255,255,0.5);
    background: transparent;
    transition: all 0.15s;
  }
  .te-mode-btn.active {
    background: rgba(255,255,255,0.12);
    color: #fff;
  }

  /* Sidebar categories */
  .te-sidebar-section { padding: 8px 12px 4px; }
  .te-sidebar-section-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.3);
    padding: 0 8px 6px;
  }

  .te-cat-btn {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 10px;
    border-radius: 8px;
    border: none;
    background: transparent;
    color: rgba(255,255,255,0.6);
    font-size: 13px;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.15s;
    text-align: left;
    position: relative;
  }
  .te-cat-btn:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.9); }
  .te-cat-btn.active { background: rgba(255,255,255,0.1); color: #fff; font-weight: 500; }
  .te-cat-dot {
    width: 10px;
    height: 10px;
    border-radius: 3px;
    flex-shrink: 0;
  }
  .te-cat-changed {
    margin-left: auto;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #F59E0B;
    flex-shrink: 0;
  }

  /* Saved themes in sidebar */
  .te-saved-list { padding: 0 12px 12px; display: flex; flex-direction: column; gap: 4px; }
  .te-saved-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
    cursor: pointer;
    transition: all 0.15s;
    group: true;
  }
  .te-saved-item:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.15); }
  .te-saved-name { flex: 1; font-size: 12px; color: rgba(255,255,255,0.7); font-weight: 500; }

  /* Main content */
  .te-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }

  /* Topbar */
  .te-topbar {
    height: 60px;
    background: #fff;
    border-bottom: 1px solid #e8e6e0;
    display: flex;
    align-items: center;
    padding: 0 24px;
    gap: 12px;
    position: sticky;
    top: 0;
    z-index: 30;
  }
  .te-topbar-title { font-size: 15px; font-weight: 600; flex: 1; color: #1a1a1a; }
  .te-unsaved-badge {
    font-size: 11px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 20px;
    background: #FEF3C7;
    color: #92400E;
    letter-spacing: 0.02em;
  }

  .te-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid #e8e6e0;
    background: #fff;
    color: #1a1a1a;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .te-btn:hover { background: #f5f4f0; }
  .te-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .te-btn-primary { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
  .te-btn-primary:hover { background: #2a2a2a; }
  .te-btn-accent { background: var(--accent); color: #fff; border-color: var(--accent); }
  .te-btn-accent:hover { opacity: 0.9; }
  .te-btn-icon { padding: 8px; }

  .te-divider { width: 1px; height: 20px; background: #e8e6e0; }

  /* Body layout */
  .te-body { display: flex; flex: 1; overflow: hidden; height: calc(100vh - 60px); }

  /* Editor panel */
  .te-editor { flex: 0 0 420px; background: #fff; border-right: 1px solid #e8e6e0; overflow-y: auto; height: 100%; }

  /* Color rows */
  .te-color-section { padding: 20px 24px; }
  .te-section-head {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #a0998c;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .te-section-head-line { flex: 1; height: 1px; background: #f0ede8; }

  .te-color-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border-radius: 10px;
    margin-bottom: 6px;
    background: #faf9f7;
    border: 1.5px solid transparent;
    transition: all 0.15s;
    position: relative;
  }
  .te-color-row:hover { border-color: #e8e6e0; background: #f7f5f2; }
  .te-color-row.changed { border-color: #FDE68A; background: #FFFBEB; }

  .te-color-swatch {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    flex-shrink: 0;
    cursor: pointer;
    border: 1.5px solid rgba(0,0,0,0.08);
    position: relative;
    overflow: hidden;
    transition: transform 0.15s;
  }
  .te-color-swatch:hover { transform: scale(1.08); }
  .te-color-swatch input[type=color] {
    position: absolute;
    inset: -4px;
    opacity: 0;
    width: calc(100% + 8px);
    height: calc(100% + 8px);
    cursor: pointer;
  }

  .te-color-label { flex: 1; font-size: 13px; font-weight: 500; color: #1a1a1a; min-width: 0; }
  .te-color-hex {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: #6b6560;
    padding: 5px 10px;
    background: #fff;
    border: 1px solid #e8e6e0;
    border-radius: 7px;
    width: 96px;
    letter-spacing: 0.02em;
    transition: border-color 0.15s;
  }
  .te-color-hex:focus { outline: none; border-color: var(--accent); }

  .te-color-actions { display: flex; gap: 2px; opacity: 0; transition: opacity 0.15s; }
  .te-color-row:hover .te-color-actions { opacity: 1; }
  .te-color-action-btn {
    width: 28px; height: 28px;
    border-radius: 6px;
    border: none;
    background: transparent;
    color: #8a8480;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.12s;
  }
  .te-color-action-btn:hover { background: #ede9e4; color: #1a1a1a; }

  .te-wcag {
    font-size: 10px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
    letter-spacing: 0.03em;
  }
  .te-wcag-pass { background: #D1FAE5; color: #065F46; }
  .te-wcag-fail { background: #FEE2E2; color: #991B1B; }

  /* Preview panel */
  .te-preview { flex: 1; background: #f5f4f0; overflow-y: auto; display: flex; flex-direction: column; height: 100%; }

  .te-preview-bar {
    padding: 12px 24px;
    background: #f5f4f0;
    border-bottom: 1px solid #e8e6e0;
    display: flex;
    align-items: center;
    gap: 8px;
    position: sticky;
    top: 0;
    z-index: 20;
  }
  .te-preview-label { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #8a8480; flex: 1; }

  .te-size-toggle { display: flex; background: #ebe9e4; border-radius: 8px; padding: 3px; gap: 2px; }
  .te-size-btn {
    width: 30px; height: 28px;
    border-radius: 6px;
    border: none; background: transparent;
    color: #8a8480;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
  }
  .te-size-btn.active { background: #fff; color: #1a1a1a; }

  .te-preview-theme-toggle { display: flex; background: #ebe9e4; border-radius: 8px; padding: 3px; gap: 2px; }
  .te-preview-theme-btn {
    display: flex; align-items: center; gap: 5px;
    padding: 5px 10px;
    border-radius: 6px;
    border: none; background: transparent;
    font-size: 11px; font-weight: 600;
    color: #8a8480;
    cursor: pointer;
    transition: all 0.15s;
  }
  .te-preview-theme-btn.active { background: #1a1a1a; color: #fff; }

  .te-preview-canvas { padding: 24px; display: flex; align-items: flex-start; justify-content: center; flex: 1; }

  .te-preview-frame {
    border-radius: 14px;
    overflow: hidden;
    transition: width 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }

  /* Search */
  .te-search-wrap { position: relative; padding: 16px 24px; background: #fff; border-bottom: 1px solid #f0ede8; }
  .te-search-input {
    width: 100%;
    padding: 9px 12px 9px 36px;
    background: #f5f4f0;
    border: 1.5px solid transparent;
    border-radius: 9px;
    font-size: 13px;
    color: #1a1a1a;
    transition: border-color 0.15s;
  }
  .te-search-input:focus { outline: none; border-color: var(--accent); background: #fff; }
  .te-search-icon { position: absolute; left: 36px; top: 50%; transform: translateY(-50%); color: #a0998c; pointer-events: none; }

  /* Presets */
  .te-presets-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 8px;
    padding: 16px;
    background: #faf9f7;
    border-bottom: 1px solid #f0ede8;
  }
  .te-preset-card {
    padding: 10px 8px;
    background: #fff;
    border-radius: 10px;
    border: 1.5px solid #f0ede8;
    cursor: pointer;
    transition: all 0.15s;
    text-align: center;
  }
  .te-preset-card:hover { border-color: var(--accent); transform: translateY(-1px); }
  .te-preset-dots { display: flex; justify-content: center; gap: 3px; margin-bottom: 6px; }
  .te-preset-dot { width: 8px; height: 8px; border-radius: 3px; }
  .te-preset-name { font-size: 10px; font-weight: 600; color: #6b6560; }
`;

/* ─── Component ─── */
export const AdminThemeScreen = () => {
  const { showToast } = useToast();
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);
  const [originalTheme] = useState<ThemeConfig>(defaultTheme);
  const [activeTab, setActiveTab] = useState<'light' | 'dark'>('light');
  const [previewTab, setPreviewTab] = useState<'light' | 'dark'>('light');
  const [activeCategory, setActiveCategory] = useState('primary');
  const [showPresets, setShowPresets] = useState(true);
  const [showContrastChecker, setShowContrastChecker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewSize, setPreviewSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [history, setHistory] = useState<ThemeConfig[]>([defaultTheme]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [savedThemes, setSavedThemes] = useState<SavedTheme[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Apply theme to CSS when theme changes
  useEffect(() => {
    applyThemeToCSS(theme, activeTab);
  }, [theme, activeTab]);

  // Inject Google Fonts (can't use @import inside injected <style> tags)
  useEffect(() => {
    const id = 'te-google-fonts';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  const currentColors = theme[activeTab];
  const previewColors = theme[previewTab];
  const hasChanges = JSON.stringify(theme) !== JSON.stringify(originalTheme);

  const changedColors = useMemo(() => {
    const changed: string[] = [];
    Object.keys(theme[activeTab]).forEach(key => {
      if (theme[activeTab][key as keyof ColorConfig] !== originalTheme[activeTab][key as keyof ColorConfig]) changed.push(key);
    });
    return changed;
  }, [theme, originalTheme, activeTab]);

  useEffect(() => {
    const saved = localStorage.getItem('savedThemes');
    if (saved) { try { setSavedThemes(JSON.parse(saved)); } catch {} }
  }, []);

  const pushToHistory = useCallback((newTheme: ThemeConfig) => {
    setHistory(prev => {
      const next = prev.slice(0, historyIndex + 1);
      next.push(JSON.parse(JSON.stringify(newTheme)));
      if (next.length > 50) next.shift();
      return next;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) { setHistoryIndex(i => i - 1); setTheme(JSON.parse(JSON.stringify(history[historyIndex - 1]))); }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) { setHistoryIndex(i => i + 1); setTheme(JSON.parse(JSON.stringify(history[historyIndex + 1]))); }
  }, [historyIndex, history]);

  const handleColorChange = useCallback((key: string, value: string) => {
    setTheme(prev => ({ ...prev, [activeTab]: { ...prev[activeTab], [key]: value } }));
  }, [activeTab]);

  const handleColorCommit = useCallback((key: string, value: string) => {
    const updated: ThemeConfig = { ...theme, [activeTab]: { ...theme[activeTab], [key]: value } };
    pushToHistory(updated);
  }, [theme, activeTab, pushToHistory]);

  const handlePresetSelect = useCallback((preset: PresetTheme) => {
    const t = JSON.parse(JSON.stringify(preset.colors));
    setTheme(t);
    pushToHistory(t);
    showToast(`Tema "${preset.name}" aplicado`, 'success');
  }, [pushToHistory, showToast]);

  const handleReset = useCallback(() => {
    setTheme(JSON.parse(JSON.stringify(defaultTheme)));
    pushToHistory(defaultTheme);
    showToast('Tema reseteado', 'success');
  }, [pushToHistory, showToast]);

  const handleCopyColor = useCallback((value: string) => {
    navigator.clipboard.writeText(value);
    showToast(`Copiado`, 'success');
  }, [showToast]);

  const handleSaveTheme = useCallback(() => {
    const name = prompt('Nombre para este tema:');
    if (name) {
      const newSaved: SavedTheme = { id: Date.now().toString(), name, theme: JSON.parse(JSON.stringify(theme)), createdAt: Date.now() };
      const updated = [...savedThemes, newSaved];
      setSavedThemes(updated);
      localStorage.setItem('savedThemes', JSON.stringify(updated));
      showToast(`"${name}" guardado`, 'success');
    }
  }, [savedThemes, theme, showToast]);

  const handleLoadTheme = useCallback((saved: SavedTheme) => {
    setTheme(JSON.parse(JSON.stringify(saved.theme)));
    pushToHistory(saved.theme);
    showToast(`"${saved.name}" cargado`, 'success');
  }, [pushToHistory, showToast]);

  const handleDeleteSaved = useCallback((id: string) => {
    if (confirm('¿Eliminar este tema?')) {
      const updated = savedThemes.filter(s => s.id !== id);
      setSavedThemes(updated);
      localStorage.setItem('savedThemes', JSON.stringify(updated));
    }
  }, [savedThemes]);

  const handleExportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(theme, null, 2)], { type: 'application/json' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `theme-${Date.now()}.json` });
    a.click();
    showToast('Exportado', 'success');
  }, [theme, showToast]);

  const handleImportJSON = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const imported = JSON.parse(ev.target?.result as string);
          setTheme(imported);
          pushToHistory(imported);
          showToast('Importado', 'success');
        } catch { showToast('Error al importar', 'error'); }
      };
      reader.readAsText(file);
    }
  }, [pushToHistory, showToast]);

  const handleExportCSS = useCallback(() => {
    const css = `:root {\n${Object.entries(theme.light).map(([k,v]) => `  --color-${k}: ${v};`).join('\n')}\n}\n\n.dark {\n${Object.entries(theme.dark).map(([k,v]) => `  --color-${k}: ${v};`).join('\n')}\n}`;
    navigator.clipboard.writeText(css);
    showToast('CSS copiado', 'success');
  }, [theme, showToast]);

  const handleGeneratePalette = useCallback(() => {
    const palette = generatePalette(theme[activeTab].primary);
    setTheme(prev => ({ ...prev, [activeTab]: { ...prev[activeTab], primary: palette[2], primaryHover: palette[3] } }));
    pushToHistory(theme);
    showToast('Paleta generada', 'success');
  }, [activeTab, theme, pushToHistory, showToast]);

  const filteredCategories = colorCategories.filter(c =>
    !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.colors.some(cl => cl.label.toLowerCase().includes(searchQuery.toLowerCase()) || cl.key.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const filteredPresets = presetThemes.filter(p =>
    !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeColorCategory = colorCategories.find(c => c.id === activeCategory);
  const previewWidth = previewSize === 'mobile' ? '390px' : previewSize === 'tablet' ? '768px' : '100%';

  return (
    <>
      <style>{styles}</style>
      <div className="theme-editor" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

        {/* Topbar */}
        <div className="te-topbar">
          <Link to="/admin" className="te-btn te-btn-icon" title="Volver"><ArrowLeft size={14} /></Link>
          <span className="te-topbar-title">Editor de Temas</span>
          {hasChanges && <span className="te-unsaved-badge">Sin guardar</span>}

          <button onClick={undo} disabled={historyIndex <= 0} className="te-btn te-btn-icon"><Undo size={14} /></button>
          <button onClick={redo} disabled={historyIndex >= history.length - 1} className="te-btn te-btn-icon"><Redo size={14} /></button>
          <div className="te-divider" />

          <button onClick={() => fileInputRef.current?.click()} className="te-btn"><Upload size={13} />Importar</button>
          <input ref={fileInputRef} type="file" accept=".json" onChange={handleImportJSON} hidden />
          <button onClick={handleExportJSON} className="te-btn"><Download size={13} />Exportar</button>
          <button onClick={handleExportCSS} className="te-btn"><Copy size={13} />CSS</button>
          <button onClick={handleReset} className="te-btn"><RotateCcw size={13} />Reset</button>
          <button onClick={handleSaveTheme} className="te-btn te-btn-primary"><Save size={13} />Guardar</button>
        </div>

        {/* Body */}
        <div className="te-body">

            {/* ── LEFT SIDEBAR ── */}
            <div className="te-sidebar">
              <div className="te-logo">
                <div className="te-logo-dot"><Palette size={16} color="#fff" /></div>
                <div>
                  <div className="te-logo-text">Temas</div>
                  <div className="te-logo-sub">Personalización visual</div>
                </div>
              </div>

              {/* Mode toggle */}
              <div className="te-mode-toggle">
                <button onClick={() => setActiveTab('light')} className={`te-mode-btn ${activeTab === 'light' ? 'active' : ''}`}>
                  <Sun size={13} />Claro
                </button>
                <button onClick={() => setActiveTab('dark')} className={`te-mode-btn ${activeTab === 'dark' ? 'active' : ''}`}>
                  <Moon size={13} />Oscuro
                </button>
              </div>

              {/* Generate palette */}
              <div style={{ padding: '0 12px 8px' }}>
                <button onClick={handleGeneratePalette} className="te-btn" style={{ width: '100%', justifyContent: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                  <Shuffle size={12} />Generar paleta
                </button>
              </div>

              {/* Categories */}
              <div className="te-sidebar-section">
                <div className="te-sidebar-section-label">Colores</div>
                {colorCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`te-cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
                  >
                    <div className="te-cat-dot" style={{ background: currentColors[cat.colors[0].key as keyof ColorConfig] }} />
                    {cat.name}
                    {cat.colors.some(c => changedColors.includes(c.key)) && <div className="te-cat-changed" />}
                  </button>
                ))}
              </div>

              {/* Contrast toggle */}
              <div style={{ padding: '0 12px' }}>
                <button
                  onClick={() => setShowContrastChecker(!showContrastChecker)}
                  className="te-cat-btn"
                  style={showContrastChecker ? { background: 'rgba(255,99,33,0.15)', color: '#FF7A3D' } : {}}
                >
                  <Eye size={13} />
                  Verificar contraste
                </button>
              </div>

              {/* Saved themes */}
              {savedThemes.length > 0 && (
                <div className="te-sidebar-section" style={{ marginTop: 8 }}>
                  <div className="te-sidebar-section-label">Guardados</div>
                  <div className="te-saved-list">
                    {savedThemes.slice().reverse().map(saved => (
                      <div key={saved.id} className="te-saved-item" onClick={() => handleLoadTheme(saved)}>
                        <div style={{ width: 20, height: 20, borderRadius: 5, background: saved.theme.light.primary, flexShrink: 0 }} />
                        <span className="te-saved-name">{saved.name}</span>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteSaved(saved.id); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: 2 }}>
                          <X size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── EDITOR ── */}
            <div className="te-editor">
              {/* Search */}
              <div className="te-search-wrap">
                <Search size={14} className="te-search-icon" />
                <input
                  type="text"
                  placeholder="Buscar colores..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="te-search-input"
                />
              </div>

              {/* Presets */}
              <AnimatePresence>
                {showPresets && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                    <div style={{ padding: '10px 16px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#a0998c' }}>Temas predefinidos</span>
                      <button onClick={() => setShowPresets(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#a0998c', padding: 2 }}><X size={13} /></button>
                    </div>
                    <div className="te-presets-grid">
                      {filteredPresets.map(preset => (
                        <button key={preset.id} onClick={() => handlePresetSelect(preset)} className="te-preset-card">
                          <div className="te-preset-dots">
                            {[preset.colors.light.primary, preset.colors.light.success, preset.colors.light.warning].map((c, i) => (
                              <div key={i} className="te-preset-dot" style={{ background: c }} />
                            ))}
                          </div>
                          <div className="te-preset-name">{preset.name}</div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {!showPresets && (
                <button onClick={() => setShowPresets(true)} style={{ width: '100%', padding: '10px 16px', fontSize: 12, fontWeight: 600, color: '#a0998c', background: '#faf9f7', border: 'none', borderBottom: '1px solid #f0ede8', cursor: 'pointer', textAlign: 'left' }}>
                  <Sparkles size={12} style={{ display: 'inline', marginRight: 6 }} />Ver temas predefinidos
                </button>
              )}

              {/* Color rows */}
              {filteredCategories.map(cat => (
                <div key={cat.id} className="te-color-section" style={{ display: activeCategory === cat.id || !!searchQuery ? 'block' : 'none' }}>
                  <div className="te-section-head">
                    {cat.name}
                    <div className="te-section-head-line" />
                  </div>
                  {cat.colors.map(color => {
                    const key = color.key as keyof ColorConfig;
                    const value = currentColors[key];
                    const isChanged = changedColors.includes(color.key);
                    const isHex = /^#[0-9a-fA-F]{6}$/.test(value);
                    const wcag = isHex ? getWCAGLevel(getContrastRatio(value, currentColors.foreground)) : null;
                    return (
                      <div key={color.key} className={`te-color-row ${isChanged ? 'changed' : ''}`}>
                        <div className="te-color-swatch" style={{ background: value }}>
                          <input
                            type="color"
                            value={isHex ? value : '#000000'}
                            onChange={e => handleColorChange(color.key, e.target.value)}
                            onBlur={e => handleColorCommit(color.key, e.target.value)}
                          />
                        </div>
                        <span className="te-color-label">{color.label}</span>

                        {showContrastChecker && wcag && (
                          <span className={`te-wcag ${wcag.ok ? 'te-wcag-pass' : 'te-wcag-fail'}`}>{wcag.level}</span>
                        )}

                        <input
                          type="text"
                          value={value}
                          onChange={e => handleColorChange(color.key, e.target.value)}
                          onBlur={e => handleColorCommit(color.key, e.target.value)}
                          className="te-color-hex"
                          spellCheck={false}
                        />

                        <div className="te-color-actions">
                          <button onClick={() => handleCopyColor(value)} className="te-color-action-btn" title="Copiar"><Copy size={12} /></button>
                          {isChanged && (
                            <button
                              onClick={() => {
                                const reverted = { ...theme, [activeTab]: { ...theme[activeTab], [color.key]: originalTheme[activeTab][key] } };
                                setTheme(reverted);
                              }}
                              className="te-color-action-btn"
                              title="Revertir"
                              style={{ color: '#D97706' }}
                            >
                              <RefreshCw size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* ── PREVIEW ── */}
            <div className="te-preview">
              <div className="te-preview-bar">
                <span className="te-preview-label">Vista Previa</span>

                <div className="te-size-toggle">
                  <button onClick={() => setPreviewSize('mobile')} className={`te-size-btn ${previewSize === 'mobile' ? 'active' : ''}`}><Smartphone size={13} /></button>
                  <button onClick={() => setPreviewSize('tablet')} className={`te-size-btn ${previewSize === 'tablet' ? 'active' : ''}`}><Tablet size={13} /></button>
                  <button onClick={() => setPreviewSize('desktop')} className={`te-size-btn ${previewSize === 'desktop' ? 'active' : ''}`}><MonitorIcon size={13} /></button>
                </div>

                <div className="te-preview-theme-toggle">
                  <button onClick={() => setPreviewTab('light')} className={`te-preview-theme-btn ${previewTab === 'light' ? 'active' : ''}`}><Sun size={11} />Claro</button>
                  <button onClick={() => setPreviewTab('dark')} className={`te-preview-theme-btn ${previewTab === 'dark' ? 'active' : ''}`}><Moon size={11} />Oscuro</button>
                </div>

                <button onClick={handleExportCSS} className="te-btn te-btn-icon" title="Copiar CSS"><Copy size={13} /></button>
              </div>

              <div className="te-preview-canvas">
                <div className="te-preview-frame" style={{ width: previewWidth, maxWidth: '100%' }}>
                  <PreviewContent colors={previewColors} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
  );
};

/* ─── Preview Content ─── */
const PreviewContent = ({ colors }: { colors: ColorConfig }) => (
  <div style={{ background: colors.background, color: colors.foreground, fontFamily: 'DM Sans, sans-serif', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>

    {/* Nav */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: colors.surface, borderRadius: 12, border: `1px solid ${colors.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: 7, background: colors.primary }} />
        <span style={{ fontWeight: 700, fontSize: 14 }}>Mi Tienda</span>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {['Inicio', 'Productos', 'Contacto'].map(l => (
          <span key={l} style={{ fontSize: 12, color: colors.foregroundMuted, cursor: 'pointer' }}>{l}</span>
        ))}
        <div style={{ width: 28, height: 28, borderRadius: 20, background: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 11, color: '#fff', fontWeight: 700 }}>AB</span>
        </div>
      </div>
    </div>

    {/* Product card */}
    <div style={{ background: colors.surface, borderRadius: 14, border: `1px solid ${colors.border}`, overflow: 'hidden' }}>
      <div style={{ height: 100, background: colors.primary, opacity: 0.15 }} />
      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 5, background: colors.badgeNew, color: '#fff' }}>NUEVO</span>
          <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 5, background: colors.badgeSale, color: '#fff' }}>-20%</span>
        </div>
        <p style={{ fontWeight: 700, fontSize: 15, margin: '0 0 4px' }}>Producto Premium</p>
        <p style={{ fontSize: 12, color: colors.foregroundMuted, margin: '0 0 12px' }}>Descripción breve del producto aquí.</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 800, fontSize: 18, color: colors.primary }}>$89.990</span>
          <button style={{ background: colors.primary, color: '#fff', border: 'none', borderRadius: 9, padding: '9px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Añadir</button>
        </div>
      </div>
    </div>

    {/* Status + rating row */}
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {[
        { label: 'Éxito', bg: colors.successBg, color: colors.success },
        { label: 'Advertencia', bg: colors.warningBg, color: colors.warning },
        { label: 'Error', bg: colors.errorBg, color: colors.error },
        { label: 'Info', bg: colors.infoBg, color: colors.info },
      ].map(s => (
        <span key={s.label} style={{ fontSize: 11, fontWeight: 700, padding: '5px 10px', borderRadius: 7, background: s.bg, color: s.color }}>{s.label}</span>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
        {[1,2,3,4,5].map(i => (
          <div key={i} style={{ width: 12, height: 12, borderRadius: 3, background: i <= 4 ? colors.rating : colors.border }} />
        ))}
        <span style={{ fontSize: 12, fontWeight: 700, marginLeft: 4 }}>4.5</span>
      </div>
    </div>

    {/* Form */}
    <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 16 }}>
      <p style={{ fontWeight: 700, fontSize: 13, margin: '0 0 12px', color: colors.foreground }}>Suscríbete al newsletter</p>
      <input type="text" placeholder="tu@email.com" style={{ display: 'block', width: '100%', padding: '9px 12px', background: colors.background, border: `1px solid ${colors.border}`, borderRadius: 8, fontSize: 12, color: colors.foreground, marginBottom: 8, outline: 'none', boxSizing: 'border-box' }} readOnly />
      <button style={{ width: '100%', background: colors.primary, color: '#fff', border: 'none', borderRadius: 8, padding: '10px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Suscribirse</button>
    </div>

    {/* Table */}
    <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ background: colors.surfaceHover }}>
            <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: colors.foregroundMuted }}>Producto</th>
            <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 600, color: colors.foregroundMuted }}>Precio</th>
            <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 600, color: colors.foregroundMuted }}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {[['Zapatos Clásicos','$120.000','En stock'],['Bolso Cuero','$280.000','Agotado']].map(([name, price, status], i) => (
            <tr key={i} style={{ borderTop: `1px solid ${colors.border}` }}>
              <td style={{ padding: '10px 14px', color: colors.foreground }}>{name}</td>
              <td style={{ padding: '10px 14px', textAlign: 'right', color: colors.primary, fontWeight: 700 }}>{price}</td>
              <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 5, background: status === 'En stock' ? colors.successBg : colors.errorBg, color: status === 'En stock' ? colors.success : colors.error }}>{status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  </div>
);