import './brandmarquee.css'

export default function BrandMarquee(){
    const brands = [
        "GUCCI",
        "PRADA",
        "VERSACE",
        "Calvin Klein",
        "ZARA"
    ];

    return (
        <div className="marquee-container">
            <div className="marquee-track">
                <div className='marquee-group'>
                    {brands.map((brand: string, index: number) => (
                    <span key={`set1-${index}`} className="brand-logo">
                        {brand}
                    </span>
                    ))}
                </div>
                
                <div className='marquee-group'>
                    {brands.map((brand: string, index: number) => (
                    <span key={`set2-${index}`} className="brand-logo">
                        {brand}
                    </span>
                    ))}
                </div>
            </div>
        </div>
    );
}