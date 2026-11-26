import type { CSSProperties } from 'react';

const dualRangeContainer = 'w-full py-2';
const priceRangeValues =
  'relative mb-3 h-5 [&_span]:absolute [&_span]:-translate-x-1/2 [&_span]:text-[13px] [&_span]:font-semibold [&_span]:whitespace-nowrap [&_span]:text-black';
const priceSliderTrackWrapper = 'relative h-1.5 rounded-[3px] bg-[#eaeaea]';
const priceSliderActiveRange =
  'pointer-events-none absolute top-0 left-[var(--min-pos,0%)] h-full w-[calc(var(--max-pos,100%)-var(--min-pos,0%))] bg-black';
const priceRangeInput =
  'pointer-events-none absolute top-0 left-0 z-[2] m-0 h-1.5 w-full appearance-none bg-transparent p-0 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:shadow-[0_2px_4px_rgba(0,0,0,0.2)] [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-[18px] [&::-moz-range-thumb]:w-[18px] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:shadow-[0_2px_4px_rgba(0,0,0,0.2)]';

export interface PriceRangeSliderProps {
  minPrice: number;
  maxPrice: number;
  minLimit: number;
  maxLimit: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
}

export default function PriceRangeSlider({
  minPrice,
  maxPrice,
  minLimit,
  maxLimit,
  onMinChange,
  onMaxChange,
}: PriceRangeSliderProps) {
  const span = maxLimit - minLimit || 1;
  const minPercent = ((minPrice - minLimit) / span) * 100;
  const maxPercent = ((maxPrice - minLimit) / span) * 100;
  const minPos = `calc(${minPercent}% + ${9 - minPercent * 0.18}px)`;
  const maxPos = `calc(${maxPercent}% + ${9 - maxPercent * 0.18}px)`;

  return (
    <div className={dualRangeContainer}>
      <div className={priceRangeValues}>
        <span style={{ left: minPos }}>${minPrice}</span>
        <span style={{ left: maxPos }}>${maxPrice}</span>
      </div>
      <div
        className={priceSliderTrackWrapper}
        style={{ '--min-pos': minPos, '--max-pos': maxPos } as CSSProperties}
      >
        <div className={priceSliderActiveRange}></div>
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          value={minPrice}
          onChange={(e) => onMinChange(Number(e.target.value))}
          className={priceRangeInput}
        />
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          value={maxPrice}
          onChange={(e) => onMaxChange(Number(e.target.value))}
          className={priceRangeInput}
        />
      </div>
    </div>
  );
}
