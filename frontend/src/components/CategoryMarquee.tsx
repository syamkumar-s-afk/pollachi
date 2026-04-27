import { useRef, useEffect, useState } from 'react';
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
import { useCategories } from '../hooks/useCategories';

/* ─── Icon map for each category ─── */
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Education: <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />,
  Finance: <Landmark className="w-4 h-4 sm:w-5 sm:h-5" />,
  'Food & Beverage': <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5" />,
  Healthcare: <HeartPulse className="w-4 h-4 sm:w-5 sm:h-5" />,
  'Real Estate': <Home className="w-4 h-4 sm:w-5 sm:h-5" />,
  Retail: <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />,
  Services: <Wrench className="w-4 h-4 sm:w-5 sm:h-5" />,
  Technology: <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />,
  'Travel & Transport': <Bus className="w-4 h-4 sm:w-5 sm:h-5" />,
  Automotive: <Car className="w-4 h-4 sm:w-5 sm:h-5" />,
  Grocery: <Apple className="w-4 h-4 sm:w-5 sm:h-5" />,
  Restaurant: <ChefHat className="w-4 h-4 sm:w-5 sm:h-5" />,
};

/* ─── Solid colors for pills with white text ─── */
const PILL_COLORS = [
  'bg-blue-500 text-white shadow-md',
  'bg-indigo-700 text-white shadow-md',
  'bg-yellow-400 text-white shadow-md',
  'bg-red-600 text-white shadow-md',
  'bg-pink-500 text-white shadow-md',
  'bg-green-600 text-white shadow-md',
  'bg-purple-600 text-white shadow-md',
  'bg-cyan-500 text-white shadow-md',
  'bg-orange-500 text-white shadow-md',
  'bg-lime-500 text-white shadow-md',
  'bg-rose-500 text-white shadow-md',
  'bg-teal-600 text-white shadow-md',
];

export default function CategoryMarquee() {
  const { categories } = useCategories();
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
  const animateRef = useRef<() => void>(() => undefined);

  /* ─── Categories duplicated 4× for seamless infinite loop ─── */
  const categoryNames = categories.map(c => c.name);
  const items = categoryNames.length > 0 ? [...categoryNames, ...categoryNames, ...categoryNames, ...categoryNames] : [];

  /* ─── Animation loop ─── */
  useEffect(() => {
    animateRef.current = () => {
      const track = trackRef.current;
      if (!track || isPaused || isDragging) return;

      positionRef.current += speedRef.current;

      // Reset position seamlessly when we've scrolled past one full set
      const singleSetWidth = track.scrollWidth / 4;
      if (positionRef.current >= singleSetWidth) {
        positionRef.current -= singleSetWidth;
      }

      track.scrollLeft = positionRef.current;
      animationRef.current = requestAnimationFrame(animateRef.current);
    };
  }, [isPaused, isDragging]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animateRef.current);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPaused, isDragging]);

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
    animationRef.current = requestAnimationFrame(animateRef.current);
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
      animationRef.current = requestAnimationFrame(animateRef.current);
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
    animationRef.current = requestAnimationFrame(animateRef.current);
  };

  return (
    <div className="relative mb-1 sm:mb-2">
      {/* Left / Right edge fade masks */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-[var(--color-background-gray)] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-[var(--color-background-gray)] to-transparent" />

      {/* Scrollable track */}
      <div
        ref={trackRef}
        className={`marquee-track overflow-x-hidden whitespace-nowrap py-1.5 sm:py-3 select-none ${
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
        <div className="inline-flex gap-1.5 sm:gap-3">
          {items.map((cat, idx) => (
            <div
              key={`${cat}-${idx}`}
              onClick={() => handlePillClick(cat)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') handlePillClick(cat); }}
              className={`
                inline-flex items-center gap-1 sm:gap-2 px-4 py-2 sm:px-6 sm:py-3
                ${PILL_COLORS[idx % PILL_COLORS.length]}
                font-bold text-[12px] sm:text-[15px] tracking-wide
                hover:scale-110 hover:shadow-lg
                transition-all duration-200
                flex-shrink-0 cursor-pointer rounded-full
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
