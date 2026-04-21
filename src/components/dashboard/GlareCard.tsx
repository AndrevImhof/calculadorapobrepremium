import { cn } from '@/lib/utils';
import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlareCardProps {
  children: React.ReactNode;
  className?: string;
  isNegative?: boolean;
}

export const GlareCard = ({ children, className, isNegative = false }: GlareCardProps) => {
  const isPointerInside = useRef(false);
  const refElement = useRef<HTMLDivElement>(null);
  const state = useRef({
    glare: { x: 50, y: 50 },
    background: { x: 50, y: 50 },
    rotate: { x: 0, y: 0 },
  });

  const containerStyle = {
    '--m-x': '50%',
    '--m-y': '50%',
    '--r-x': '0deg',
    '--r-y': '0deg',
    '--bg-x': '50%',
    '--bg-y': '50%',
    '--duration': '300ms',
    '--foil-size': '100%',
    '--opacity': '0',
    '--radius': '32px',
    '--easing': 'ease',
    '--transition': 'var(--duration) var(--easing)',
  } as React.CSSProperties & Record<string, string>;

  // Gradiente dourado em estado normal, vermelho-sangue quando negativo
  const glowColor = isNegative
    ? 'repeating-linear-gradient(0deg,rgb(180,10,10) calc(var(--step)*1),rgba(220,50,50,1) calc(var(--step)*2),rgba(150,0,0,1) calc(var(--step)*3),rgba(200,20,20,1) calc(var(--step)*4),rgba(120,0,0,1) calc(var(--step)*5),rgb(180,30,30) calc(var(--step)*6),rgb(180,10,10) calc(var(--step)*7)) 0% var(--bg-y)/200% 700% no-repeat'
    : 'repeating-linear-gradient(0deg,rgb(234,179,8) calc(var(--step)*1),rgba(251,191,36,1) calc(var(--step)*2),rgba(245,158,11,1) calc(var(--step)*3),rgba(217,119,6,1) calc(var(--step)*4),rgba(180,83,9,1) calc(var(--step)*5),rgb(202,138,4) calc(var(--step)*6),rgb(234,179,8) calc(var(--step)*7)) 0% var(--bg-y)/200% 700% no-repeat';

  const backgroundStyle = {
    '--step': '5%',
    '--foil-svg': `url("data:image/svg+xml,%3Csvg width='26' height='26' viewBox='0 0 26 26' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2.99994 3.419C2.99994 3.419 21.6142 7.43646 22.7921 12.153C23.97 16.8695 3.41838 23.0306 3.41838 23.0306' stroke='white' stroke-width='5' stroke-miterlimit='3.86874' stroke-linecap='round' style='mix-blend-mode:darken'/%3E%3C/svg%3E")`,
    '--pattern': 'var(--foil-svg) center/100% no-repeat',
    '--rainbow': glowColor,
    '--diagonal':
      'repeating-linear-gradient(128deg,#0a0a0a 0%,hsl(45,15%,25%) 3.8%,hsl(45,15%,25%) 4.5%,hsl(45,15%,25%) 5.2%,#0a0a0a 10%,#0a0a0a 12%) var(--bg-x) var(--bg-y)/300% no-repeat',
    '--shade':
      'radial-gradient(farthest-corner circle at var(--m-x) var(--m-y),rgba(255,255,255,0.1) 12%,rgba(255,255,255,0.15) 20%,rgba(255,255,255,0.25) 120%) var(--bg-x) var(--bg-y)/300% no-repeat',
    backgroundBlendMode: 'hue, hue, hue, overlay',
  } as React.CSSProperties & Record<string, string>;

  const updateStyles = () => {
    if (refElement.current) {
      const { background, rotate, glare } = state.current;
      refElement.current.style.setProperty('--m-x', `${glare.x}%`);
      refElement.current.style.setProperty('--m-y', `${glare.y}%`);
      refElement.current.style.setProperty('--r-x', `${rotate.x}deg`);
      refElement.current.style.setProperty('--r-y', `${rotate.y}deg`);
      refElement.current.style.setProperty('--bg-x', `${background.x}%`);
      refElement.current.style.setProperty('--bg-y', `${background.y}%`);
    }
  };

  return (
    <motion.div
      style={containerStyle}
      animate={isNegative ? { scale: [1, 1.01, 1] } : { scale: 1 }}
      transition={isNegative ? { duration: 1.5, repeat: Infinity } : {}}
      className="relative isolate w-[340px] max-w-full transition-transform delay-[var(--delay)] duration-[var(--duration)] ease-[var(--easing)] will-change-transform [contain:layout_style] [perspective:600px]"
      ref={refElement}
      onPointerMove={(event) => {
        const rotateFactor = 0.4;
        const rect = event.currentTarget.getBoundingClientRect();
        const position = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };
        const percentage = {
          x: (100 / rect.width) * position.x,
          y: (100 / rect.height) * position.y,
        };
        const delta = { x: percentage.x - 50, y: percentage.y - 50 };
        const { background, rotate, glare } = state.current;
        background.x = 50 + percentage.x / 4 - 12.5;
        background.y = 50 + percentage.y / 3 - 16.67;
        rotate.x = -(delta.x / 3.5) * rotateFactor;
        rotate.y = (delta.y / 2) * rotateFactor;
        glare.x = percentage.x;
        glare.y = percentage.y;
        updateStyles();
      }}
      onPointerEnter={() => {
        isPointerInside.current = true;
        setTimeout(() => {
          if (isPointerInside.current) {
            refElement.current?.style.setProperty('--duration', '0s');
          }
        }, 300);
      }}
      onPointerLeave={() => {
        isPointerInside.current = false;
        refElement.current?.style.removeProperty('--duration');
        refElement.current?.style.setProperty('--r-x', '0deg');
        refElement.current?.style.setProperty('--r-y', '0deg');
      }}
    >
      <div
        className={cn(
          'grid h-full origin-center [transform:rotateY(var(--r-x))_rotateX(var(--r-y))] overflow-hidden rounded-[var(--radius)] transition-all delay-[var(--delay)] duration-[var(--duration)] ease-[var(--easing)] will-change-transform hover:filter-none hover:[--duration:200ms] hover:[--easing:linear] hover:[--opacity:0.6]',
          isNegative ? 'border border-red-900/60' : 'border border-amber-900/40'
        )}
      >
        {/* Conteúdo base */}
        <div className="grid h-full w-full mix-blend-soft-light [clip-path:inset(0_0_0_0_round_var(--radius))] [grid-area:1/1]">
          <div
            className={cn(
              'h-full w-full transition-colors duration-700',
              isNegative ? 'bg-zinc-950' : 'bg-zinc-950',
              className
            )}
          >
            {children}
          </div>
        </div>

        {/* Camada de glare branco */}
        <div className="transition-background will-change-background grid h-full w-full opacity-[var(--opacity)] mix-blend-soft-light transition-opacity delay-[var(--delay)] duration-[var(--duration)] ease-[var(--easing)] [background:radial-gradient(farthest-corner_circle_at_var(--m-x)_var(--m-y),_rgba(255,255,255,0.8)_10%,_rgba(255,255,255,0.65)_20%,_rgba(255,255,255,0)_90%)] [clip-path:inset(0_0_1px_0_round_var(--radius))] [grid-area:1/1]" />

        {/* Camada foil dourada / vermelha */}
        <div
          className="will-change-background relative grid h-full w-full opacity-[var(--opacity)] [background-blend-mode:hue_hue_hue_overlay] mix-blend-color-dodge transition-opacity [background:var(--pattern),_var(--rainbow),_var(--diagonal),_var(--shade)] [clip-path:inset(0_0_1px_0_round_var(--radius))] [grid-area:1/1] after:bg-[inherit] after:[background-size:var(--foil-size),_200%_400%,_800%,_200%] after:[background-position:center,_0%_var(--bg-y),_calc(var(--bg-x)*_-1)_calc(var(--bg-y)*_-1),_var(--bg-x)_var(--bg-y)] after:[background-blend-mode:soft-light,_hue,_hard-light] after:mix-blend-exclusion after:content-[''] after:[grid-area:inherit] after:bg-repeat-[inherit] after:bg-attachment-[inherit] after:bg-origin-[inherit] after:bg-clip-[inherit]"
          style={{ ...backgroundStyle }}
        />

        {/* Glow border animado quando negativo */}
        <AnimatePresence>
          {isNegative && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="pointer-events-none absolute inset-0 rounded-[var(--radius)] [grid-area:1/1] shadow-[inset_0_0_40px_rgba(220,38,38,0.25)] border border-red-700/40"
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
