export const filterCard =
  'box-border rounded-xl border border-[#eaeaea] bg-white p-6 max-md:rounded-none max-md:border-none max-md:px-6 max-md:py-7 max-md:shadow-none';

export const filterHeader =
  'flex items-center justify-between [&_h3]:m-0 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-black';

export const filterToggleBtn =
  'flex cursor-pointer items-center justify-center border-none bg-none p-1';

export const pcToggleBtn = `${filterToggleBtn} max-md:hidden`;
export const mobileCloseBtn = `${filterToggleBtn} hidden max-md:flex`;

export const iconCloseMobile = 'h-5 w-5 text-black';
export const filterMainIcon = 'h-[18px] w-[18px] object-contain';
export const filterDivider = 'my-4 h-px border-none bg-[#eaeaea]';
export const filterGroup = 'mb-2';
export const filterGroupHeader =
  'mb-3 flex cursor-pointer items-center justify-between text-sm font-medium text-[#333] select-none';
export const filterArrowIcon = 'h-3 w-3 object-contain';
export const filterSelectWrapper = 'relative w-full';
export const filterSelect =
  'box-border w-full cursor-pointer rounded-lg border border-[#d1d1d1] bg-white px-3.5 py-2.5 text-sm text-[#333] outline-none focus:border-black';

export const filterSwitch = 'relative flex h-6 w-11 items-center justify-start';
export const filterSwitchInput = 'peer absolute h-0 w-0 opacity-0';
export const filterSlider =
  "absolute inset-0 cursor-pointer rounded-3xl bg-[#ccc] transition-all duration-300 before:absolute before:top-1/2 before:left-[3px] before:h-[18px] before:w-[18px] before:-translate-y-1/2 before:rounded-full before:bg-white before:transition-all before:duration-300 before:content-[''] peer-checked:bg-black peer-checked:before:translate-x-5";

export const dualRangeContainer = 'w-full py-2';
export const priceRangeValues =
  'relative mb-3 h-5 [&_span]:absolute [&_span]:-translate-x-1/2 [&_span]:text-[13px] [&_span]:font-semibold [&_span]:whitespace-nowrap [&_span]:text-black';
export const priceSliderTrackWrapper = 'relative h-1.5 rounded-[3px] bg-[#eaeaea]';
export const priceSliderActiveRange =
  'pointer-events-none absolute top-0 left-[var(--min-pos,0%)] h-full w-[calc(var(--max-pos,100%)-var(--min-pos,0%))] bg-black';
export const priceRangeInput =
  'pointer-events-none absolute top-0 left-0 z-[2] m-0 h-1.5 w-full appearance-none bg-transparent p-0 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:shadow-[0_2px_4px_rgba(0,0,0,0.2)] [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-[18px] [&::-moz-range-thumb]:w-[18px] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:shadow-[0_2px_4px_rgba(0,0,0,0.2)]';

export const filterApplyBtn =
  'mt-5 w-full cursor-pointer rounded-3xl border-none bg-black py-3 text-sm font-medium text-white transition-colors hover:bg-[#333]';
