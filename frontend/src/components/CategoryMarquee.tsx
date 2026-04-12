import { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Landmark,
  UtensilsCrossed,
  HeartPulse,
  Home,
  ShoppingBag,
  Wrench,
  Cpu,
  Bus,
  Car,
  Apple,
  ChefHat,
} from 'lucide-react';
import { CATEGORIES } from '../constants';

/* ─── Icon map for each category ─── */
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Education: <GraduationCap className="w-4 h-4" />,
  Finance: <Landmark className="w-4 h-4" />,
  'Food & Beverage': <UtensilsCrossed className="w-4 h-4" />,
  Healthcare: <HeartPulse className="w-4 h-4" />,
  'Real Estate': <Home className="w-4 h-4" />,
  Retail: <ShoppingBag className="w-4 h-4" />,
  Services: <Wrench className="w-4 h-4" />,
  Technology: <Cpu className="w-4 h-4" />,
  'Travel & Transport': <Bus className="w-4 h-4" />,
  Automotive: <Car className="w-4 h-4" />,
  Grocery: <Apple className="w-4 h-4" />,
  Restaurant: <ChefHat className="w-4 h-4" />,
};

/* ─── Gradient colours for pills (cycle through) ─── */
const PILL_COLORS = [
  'from-red-500/10 to-red-500/5 text-red-700 border-red-200',
  'from-blue-500/10 to-blue-500/5 text-blue-700 border-blue-200',
  'from-emerald-500/10 to-emerald-500/5 text-emerald-700 border-emerald-200',
  'from-violet-500/10 to-violet-500/5 text-violet-700 border-violet-200',
  'from-amber-500/10 to-amber-500/5 text-amber-700 border-amber-200',
  'from-pink-500/10 to-pink-500/5 text-pink-700 border-pink-200',
  'from-teal-500/10 to-teal-500/5 text-teal-700 border-teal-200',
  'from-orange-500/10 to-orange-500/5 text-orange-700 border-orange-200',
  'from-cyan-500/10 to-cyan-500/5 text-cyan-700 border-cyan-200',
  'from-indigo-500/10 to-indigo-500/5 text-indigo-700 border-indigo-200',
  'from-lime-500/10 to-lime-500/5 text-lime-700 border-lime-200',
  'from-rose-500/10 to-rose-500/5 text-rose-700 border-rose-200',
];

export default function CategoryMarquee() {
  const navigate = useNavigate();
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef<number | null>(null);
  const speedRef = useRef(0.6); // px per frame
  const positionRef = useRef(0);
  const dragDistanceRef = useRef(0); // track total drag distance to distinguish click vs drag
  const mouseDownXRef = useRef(0);

  /* ─── Categories duplicated 4× for seamless infinite loop ─── */
  const items = [...CATEGORIES, ...CATEGORIES, ...CATEGORIES, ...CATEGORIES];

  /* ─── Animation loop ─── */
  const animate = useCallback(() => {
    const track = trackRef.current;
    if (!track || isPaused || isDragging) return;

    positionRef.current += speedRef.current;

    // Reset position seamlessly when we've scrolled past one full set
    const singleSetWidth = track.scrollWidth / 4;
    if (positionRef.current >= singleSetWidth) {
      positionRef.current -= singleSetWidth;
    }

    track.scrollLeft = positionRef.current;
    animationRef.current = requestAnimationFrame(animate);
  }, [isPaused, isDragging]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  /* ─── Mouse drag handlers ─── */
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    mouseDownXRef.current = e.pageX;
    dragDistanceRef.current = 0;
    setStartX(e.pageX - (trackRef.current?.offsetLeft || 0));
    setScrollLeft(trackRef.current?.scrollLeft || 0);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - (trackRef.current.offsetLeft || 0);
    const walk = (x - startX) * 2;
    dragDistanceRef.current = Math.abs(e.pageX - mouseDownXRef.current);
    trackRef.current.scrollLeft = scrollLeft - walk;
    positionRef.current = trackRef.current.scrollLeft;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    animationRef.current = requestAnimationFrame(animate);
  };

  /* ─── Click handler (only fires if not a drag) ─── */
  const handlePillClick = (cat: string) => {
    if (dragDistanceRef.current < 5) {
      navigate(`/listings?category=${encodeURIComponent(cat)}`);
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      animationRef.current = requestAnimationFrame(animate);
    }
    setIsPaused(false);
  };

  /* ─── Touch handlers for mobile ─── */
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (trackRef.current?.offsetLeft || 0));
    setScrollLeft(trackRef.current?.scrollLeft || 0);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !trackRef.current) return;
    const x = e.touches[0].pageX - (trackRef.current.offsetLeft || 0);
    const walk = (x - startX) * 2;
    trackRef.current.scrollLeft = scrollLeft - walk;
    positionRef.current = trackRef.current.scrollLeft;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    animationRef.current = requestAnimationFrame(animate);
  };

  return (
    <div className="relative mb-5">
      {/* Left / Right edge fade masks */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-[var(--color-background-gray)] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-[var(--color-background-gray)] to-transparent" />

      {/* Scrollable track */}
      <div
        ref={trackRef}
        className={`marquee-track overflow-x-hidden whitespace-nowrap py-3 select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsPaused(true)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="inline-flex gap-3">
          {items.map((cat, idx) => (
            <div
              key={`${cat}-${idx}`}
              onClick={() => handlePillClick(cat)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') handlePillClick(cat); }}
              className={`
                inline-flex items-center gap-2 px-5 py-2.5
                bg-gradient-to-br ${PILL_COLORS[idx % PILL_COLORS.length]}
                border rounded-full
                font-semibold text-[13px] tracking-wide
                hover:scale-105 hover:shadow-md
                transition-all duration-200
                flex-shrink-0 cursor-pointer
              `}
            >
              {CATEGORY_ICONS[cat] || null}
              <span>{cat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
