export default function BrandMarquee(){
    const brands = [
        "GUCCI",
        "PRADA",
        "VERSACE",
        "Calvin Klein",
        "ZARA"
    ];

    const brandLogo = 'whitespace-nowrap font-["Times_New_Roman",serif] text-[28px] font-bold text-white';

    const groupBrands = [...brands, ...brands, ...brands];

    return (
        <div className="group flex w-full overflow-hidden bg-black py-[30px]">
            <div className="flex w-max animate-[scrollTicker_22.5s_linear_infinite] items-center gap-20 px-10 group-hover:[animation-play-state:paused]">
                <div className='flex items-center gap-20' aria-hidden="false">
                    {groupBrands.map((brand: string, index: number) => (
                    <span key={`set1-${index}`} className={brandLogo}>
                        {brand}
                    </span>
                    ))}
                </div>

                <div className='flex items-center gap-20' aria-hidden="true">
                    {groupBrands.map((brand: string, index: number) => (
                    <span key={`set2-${index}`} className={brandLogo}>
                        {brand}
                    </span>
                    ))}
                </div>
            </div>
        </div>
    );
}