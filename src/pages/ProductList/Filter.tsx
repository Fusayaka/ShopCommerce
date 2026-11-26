import { useEffect, useRef, useState } from 'react';
import upArrow from '@/assets/up-arrow.svg'
import downArrow from '@/assets/down-arrow.svg'
import filterMenu from '@/assets/filter.svg'
import { useSearchParams } from 'react-router-dom';
import { productApi } from '@/api/productApi';
import { PriceRangeSlider } from '@/components';
import * as fs from './filterStyles';

interface FilterProps{
    isOpen?: boolean;
    onClose?: () => void;
    onApplyFilter?: (filters: {
        rating: string,
        minPrice: number,
        maxPrice: number,
        minLimit: number,
        maxLimit: number,
        isDiscountOnly: boolean
    }) => void;
}

export default function Filter({onClose, onApplyFilter}: FilterProps){
    const [searchParams] = useSearchParams();
    const [isDiscountOnly, setIsDiscountOnly] = useState<boolean>(
        searchParams.get("discount") === "true"
    );
    const [rating, setRating] = useState(
        searchParams.get("rating") || "0"
    );
    const [minLimit, setMinLimit] = useState<number>(0);
    const [maxLimit, setMaxLimit] = useState<number>(500);

    const [minPrice, setMinPrice] = useState<number>(
        Number(searchParams.get("minPrice")) || 0
    );
    const [maxPrice, setMaxPrice] = useState<number>(
        Number(searchParams.get("maxPrice")) || 500
    );

    const haveMinPrice = useRef(searchParams.get("minPrice") !== null);
    const haveMaxPrice = useRef(searchParams.get("maxPrice") !== null);

    useEffect(() => {
        productApi.getRoundRange()
            .then(({ min, max }) => {
                setMinLimit(min);
                setMaxLimit(max);
                if (!haveMinPrice.current) setMinPrice(min);
                if (!haveMaxPrice.current) setMaxPrice(max);
            })
            .catch((err) => console.error("Error loading price range:", err));
    }, []);

    const [isRatingOpen, setIsRatingOpen] = useState<boolean>(true);
    const [isDiscountOpen, setIsDiscountOpen] = useState<boolean>(true);
    const [isPriceOpen, setIsPriceOpen] = useState<boolean>(true);
    const [isFilterBodyOpen, setIsFilterBodyOpen] = useState<boolean>(true);

    const handleApply = () => {
        if (onApplyFilter){
            onApplyFilter({rating, minPrice, maxPrice, minLimit, maxLimit, isDiscountOnly});
        }
        if (onClose) onClose();
    };

    return(
        <div className={`${fs.filterCard} w-4/5 max-w-[80%] max-md:w-full max-md:max-w-full`}>
            <div className={fs.filterHeader}>
                <h3>Filters</h3>
                <button className={fs.pcToggleBtn} onClick={() => setIsFilterBodyOpen(!isFilterBodyOpen)}>
                    <img src={filterMenu} alt="filter" className={fs.filterMainIcon} />
                </button>

                <button
                    className={fs.mobileCloseBtn}
                    onClick={onClose}
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={fs.iconCloseMobile}
                    >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            {isFilterBodyOpen && (
                <>
                    <hr className={fs.filterDivider} />

                    <div className={fs.filterGroup}>
                        <div
                            className={fs.filterGroupHeader}
                            onClick={() => setIsRatingOpen(!isRatingOpen)}
                        >
                            <span>Rating range</span>
                            <img
                                src={isRatingOpen ? upArrow : downArrow}
                                alt="toggle"
                                className={fs.filterArrowIcon}
                            />
                        </div>
                        {isRatingOpen && (
                            <div className={fs.filterSelectWrapper}>
                                <select
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                    className={fs.filterSelect}
                                >
                                    <option value="0">All Ratings</option>
                                    <option value="5">5 Stars</option>
                                    <option value="4">4 Stars & above</option>
                                    <option value="3">3 Stars & above</option>
                                    <option value="2">2 Stars & above</option>
                                    <option value="1">1 Stars & above</option>
                                    <option value="new">New</option>
                                    <option value="no-review">No review</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <hr className={fs.filterDivider} />

                    <div className={fs.filterGroup}>
                        <div
                            className={fs.filterGroupHeader}
                            onClick={() => setIsDiscountOpen(!isDiscountOpen)}
                        >
                            <span>Only discount</span>
                            <img
                                src={isDiscountOpen ? upArrow : downArrow}
                                alt="toggle"
                                className={fs.filterArrowIcon}
                            />
                        </div>
                        {isDiscountOpen && (
                            <label className={fs.filterSwitch}>
                                <input
                                    type="checkbox"
                                    checked={isDiscountOnly}
                                    onChange={(e) => setIsDiscountOnly(e.target.checked)}
                                    className={fs.filterSwitchInput}
                                />
                                <span className={fs.filterSlider}></span>
                            </label>
                        )}
                    </div>

                    <hr className={fs.filterDivider} />

                    <div className={fs.filterGroup}>
                        <div
                            className={fs.filterGroupHeader}
                            onClick={() => setIsPriceOpen(!isPriceOpen)}
                        >
                            <span>Price Range</span>
                            <img
                                src={isPriceOpen ? upArrow : downArrow}
                                alt="toggle"
                                className={fs.filterArrowIcon}
                            />
                        </div>
                        {isPriceOpen && (
                            <PriceRangeSlider
                                minPrice={minPrice}
                                maxPrice={maxPrice}
                                minLimit={minLimit}
                                maxLimit={maxLimit}
                                onMinChange={(val) => {
                                    if (val <= maxPrice) setMinPrice(val);
                                }}
                                onMaxChange={(val) => {
                                    if (val >= minPrice) setMaxPrice(val);
                                }}
                            />
                        )}
                    </div>

                    <button className={fs.filterApplyBtn} onClick={handleApply}>
                        Apply Filter
                    </button>
                </>
            )}
        </div>
    );
}