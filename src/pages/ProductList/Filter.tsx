import { useState } from 'react';
import './filter.css'
import upArrow from '@/assets/up-arrow.png'
import downArrow from '@/assets/down-arrow.png'
import filterMenu from '@/assets/filter.png'

interface FilterProps{
    isOpen?: boolean;
    onClose?: () => void;
    onApplyFilter?: (filters: { 
        rating: string, 
        minPrice: number, 
        maxPrice: number, 
        isDiscountOnly: boolean 
    }) => void;
}

interface DualPriceRangeProps {
    minPrice: number;
    maxPrice: number;
    minLimit: number;
    maxLimit: number;
    minPercent: number;
    maxPercent: number;
    onMinChange: (value: number) => void;
    onMaxChange: (value: number) => void;
}

const DualPriceRange = ({
    minPrice,
    maxPrice,
    minLimit,
    maxLimit,
    minPercent,
    maxPercent,
    onMinChange,
    onMaxChange
}: DualPriceRangeProps) => {
    const minPos = `calc(${minPercent}% + ${9 - minPercent * 0.18}px)`;
    const maxPos = `calc(${maxPercent}% + ${9 - maxPercent * 0.18}px)`;

    return (
        <div className="dual-range-container">
            <div className="price-range-values">
                <span style={{ left: minPos }}>${minPrice}</span>
                <span style={{ left: maxPos }}>${maxPrice}</span>
            </div>
            <div 
                className="price-slider-track-wrapper"
                style={{
                    '--min-pos': minPos,
                    '--max-pos': maxPos
                } as React.CSSProperties}
            >
                <div className="price-slider-active-range"></div>
                <input 
                    type="range" 
                    min={minLimit} 
                    max={maxLimit} 
                    value={minPrice}
                    onChange={(e) => onMinChange(Number(e.target.value))}
                    className="price-range-input min-input"
                />
                <input 
                    type="range" 
                    min={minLimit} 
                    max={maxLimit} 
                    value={maxPrice}
                    onChange={(e) => onMaxChange(Number(e.target.value))}
                    className="price-range-input max-input"
                />
            </div>
        </div>
    );
};

export default function Filter({isOpen = true, onClose, onApplyFilter}: FilterProps){
    const [isDiscountOnly, setIsDiscountOnly] = useState<boolean>(false);
    const [rating, setRating] = useState("All Ratings");
    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(400);

    const [isRatingOpen, setIsRatingOpen] = useState<boolean>(true);
    const [isDiscountOpen, setIsDiscountOpen] = useState<boolean>(true);
    const [isPriceOpen, setIsPriceOpen] = useState<boolean>(true);
    const [isFilterBodyOpen, setIsFilterBodyOpen] = useState<boolean>(true);

    const minLimit = 0;
    const maxLimit = 500;

    const minPercent = ((minPrice - minLimit) / (maxLimit - minLimit)) * 100;
    const maxPercent = ((maxPrice - minLimit) / (maxLimit - minLimit)) * 100;

    const handleApply = () => {
        if (onApplyFilter){
            onApplyFilter({rating, minPrice, maxPrice, isDiscountOnly});
        }
        if (onClose) onClose();
    };

    return(
        <div className={`filter-card ${isOpen ? 'mobile-open' : ''}`}>
            <div className="filter-header">
                <h3>Filters</h3>
                <button className="filter-toggle-btn" onClick={() => setIsFilterBodyOpen(!isFilterBodyOpen)}>
                    <img src={filterMenu} alt="filter" className="filter-main-icon" />
                </button>
            </div>

            {isFilterBodyOpen && (
                <>
                    <hr className="filter-divider" />

                    <div className="filter-group">
                        <div 
                            className="filter-group-header" 
                            onClick={() => setIsRatingOpen(!isRatingOpen)}
                        >
                            <span>Rating range</span>
                            <img 
                                src={isRatingOpen ? upArrow : downArrow} 
                                alt="toggle" 
                                className="filter-arrow-icon" 
                            />
                        </div>
                        {isRatingOpen && (
                            <div className="filter-select-wrapper">
                                <select 
                                    value={rating} 
                                    onChange={(e) => setRating(e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="All Ratings">All Ratings</option>
                                    <option value="5">5 Stars</option>
                                    <option value="4">4 Stars & above</option>
                                    <option value="4">3 Stars & above</option>
                                    <option value="4">2 Stars & above</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <hr className="filter-divider" />

                    <div className="filter-group">
                        <div 
                            className="filter-group-header" 
                            onClick={() => setIsDiscountOpen(!isDiscountOpen)}
                        >
                            <span>Only discount</span>
                            <img 
                                src={isDiscountOpen ? upArrow : downArrow} 
                                alt="toggle" 
                                className="filter-arrow-icon" 
                            />
                        </div>
                        {isDiscountOpen && (
                            <label className="filter-switch">
                                <input 
                                    type="checkbox" 
                                    checked={isDiscountOnly}
                                    onChange={(e) => setIsDiscountOnly(e.target.checked)}
                                />
                                <span className="filter-slider"></span>
                            </label>
                        )}
                    </div>

                    <hr className="filter-divider" />

                    <div className="filter-group">
                        <div 
                            className="filter-group-header" 
                            onClick={() => setIsPriceOpen(!isPriceOpen)}
                        >
                            <span>Price Range</span>
                            <img 
                                src={isPriceOpen ? upArrow : downArrow} 
                                alt="toggle" 
                                className="filter-arrow-icon" 
                            />
                        </div>
                        {isPriceOpen && (
                            <DualPriceRange 
                                minPrice={minPrice}
                                maxPrice={maxPrice}
                                minLimit={minLimit}
                                maxLimit={maxLimit}
                                minPercent={minPercent}
                                maxPercent={maxPercent}
                                onMinChange={(val) => {
                                    if (val <= maxPrice) setMinPrice(val);
                                }}
                                onMaxChange={(val) => {
                                    if (val >= minPrice) setMaxPrice(val);
                                }}
                            />
                        )}
                    </div>

                    <button className="filter-apply-btn" onClick={handleApply}>
                        Apply Filter
                    </button>
                </>
            )}
        </div>
    );
}