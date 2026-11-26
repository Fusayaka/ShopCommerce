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

export const filterApplyBtn =
  'mt-5 w-full cursor-pointer rounded-3xl border-none bg-black py-3 text-sm font-medium text-white transition-colors hover:bg-[#333]';
