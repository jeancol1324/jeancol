import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className,
  showHome = true
}) => {
  const allItems = showHome
    ? [{ label: 'Inicio', href: '/', icon: <Home className="w-4 h-4" /> }, ...items]
    : items;

  return (
    <nav className={cn('flex items-center gap-2 text-sm', className)}>
      {allItems.map((item, index) => {
        const isLast = index === allItems.length - 1;
        const isFirst = index === 0;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600" />
            )}
            {item.href && !isLast ? (
              <Link
                to={item.href}
                className={cn(
                  'flex items-center gap-2 text-zinc-500 hover:text-primary transition-colors',
                  isFirst && 'text-zinc-600 dark:text-zinc-400'
                )}
              >
                {item.icon && <span className="text-current">{item.icon}</span>}
                <span className="font-medium">{item.label}</span>
              </Link>
            ) : (
              <span
                className={cn(
                  'flex items-center gap-2 font-medium',
                  isLast
                    ? 'text-zinc-900 dark:text-white font-bold'
                    : 'text-zinc-500'
                )}
              >
                {item.icon && <span className="text-current">{item.icon}</span>}
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

interface SizeGuideProps {
  isOpen: boolean;
  onClose: () => void;
  category?: 'tops' | 'bottoms' | 'shoes';
}

const sizeCharts = {
  tops: {
    headers: ['Medida', 'S', 'M', 'L', 'XL', 'XXL'],
    rows: [
      ['Pecho (cm)', '88-92', '93-97', '98-102', '103-107', '108-112'],
      ['Cintura (cm)', '74-78', '79-83', '84-88', '89-93', '94-98'],
      ['Largo (cm)', '68', '70', '72', '74', '76']
    ]
  },
  bottoms: {
    headers: ['Medida', '28', '30', '32', '34', '36'],
    rows: [
      ['Cintura (cm)', '71-74', '76-79', '81-84', '86-89', '91-94'],
      ['Cadera (cm)', '88-91', '92-95', '96-99', '100-103', '104-107'],
      ['Largo (cm)', '76', '78', '80', '82', '84']
    ]
  },
  shoes: {
    headers: ['EUR', '38', '39', '40', '41', '42', '43', '44'],
    rows: [
      ['US', '6', '7', '7.5', '8', '9', '10', '11'],
      ['CM', '24', '25', '25.5', '26', '27', '28', '29']
    ]
  }
};

export const SizeGuideModal: React.FC<SizeGuideProps> = ({
  isOpen,
  onClose,
  category = 'tops'
}) => {
  const chart = sizeCharts[category];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-zinc-950 rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight italic">
            Guía de Tallas
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
          >
            ×
          </button>
        </div>

        <p className="text-zinc-500 mb-6">
          Mide tu cuerpo y compara con la tabla. Si estás entre tallas, recomendamos subir una talla.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {chart.headers.map((header, i) => (
                  <th
                    key={i}
                    className={cn(
                      'px-4 py-3 text-xs font-black uppercase tracking-widest',
                      i === 0
                        ? 'text-left text-zinc-500 bg-transparent'
                        : 'text-center bg-primary text-white'
                    )}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chart.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="px-4 py-3 text-xs font-black text-zinc-500 uppercase">
                    {row[0]}
                  </td>
                  {row.slice(1).map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-4 py-3 text-sm text-center font-medium text-zinc-900 dark:text-white"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl">
          <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase mb-2">
            ¿Cómo medir?
          </h3>
          <ul className="text-xs text-zinc-500 space-y-1">
            <li>• <strong>Pecho:</strong> Mide alrededor de la parte más fullest de tu pecho.</li>
            <li>• <strong>Cintura:</strong> Mide alrededor de tu cintura natural.</li>
            <li>• <strong>Cadera:</strong> Mide alrededor de la parte más ancha de tus caderas.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

interface SizeCalculatorProps {
  onSelectSize: (size: string) => void;
  className?: string;
}

export const SizeCalculator: React.FC<SizeCalculatorProps> = ({ onSelectSize, className }) => {
  const [chest, setChest] = React.useState('');
  const [waist, setWaist] = React.useState('');
  const [recommendedSize, setRecommendedSize] = React.useState<string | null>(null);

  const calculateSize = () => {
    const chestCm = parseInt(chest);
    const waistCm = parseInt(waist);

    if (isNaN(chestCm) || isNaN(waistCm)) return;

    if (chestCm <= 92 && waistCm <= 78) setRecommendedSize('S');
    else if (chestCm <= 97 && waistCm <= 83) setRecommendedSize('M');
    else if (chestCm <= 102 && waistCm <= 88) setRecommendedSize('L');
    else if (chestCm <= 107 && waistCm <= 93) setRecommendedSize('XL');
    else setRecommendedSize('XXL');
  };

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase">
        Encuentra tu talla
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-zinc-500 block mb-1">Pecho (cm)</label>
          <input
            type="number"
            value={chest}
            onChange={(e) => setChest(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm"
            placeholder="Ej: 95"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500 block mb-1">Cintura (cm)</label>
          <input
            type="number"
            value={waist}
            onChange={(e) => setWaist(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm"
            placeholder="Ej: 80"
          />
        </div>
      </div>
      <button
        onClick={calculateSize}
        className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-zinc-900 transition-colors"
      >
        Calcular Talla
      </button>
      {recommendedSize && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950 rounded-xl text-center">
          <p className="text-xs text-emerald-600 dark:text-emerald-400 uppercase mb-1">Tu talla recomendada</p>
          <button
            onClick={() => onSelectSize(recommendedSize)}
            className="text-3xl font-black text-emerald-600 dark:text-emerald-400 hover:scale-110 transition-transform"
          >
            {recommendedSize}
          </button>
        </div>
      )}
    </div>
  );
};
