import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import React, { Fragment, useEffect, useState } from 'react';
import Pagination from 'react-js-pagination';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// import Loader from '../layout/Loader/Loader';
import LoadingBar from 'react-top-loading-bar';

import { clearErrors, getProduct } from '../../actions/productAction';
import ProductCard from '../Home/ProductCard';
import MetaData from '../layout/MetaData';

import './Products.css';

const Products = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector(state => state.user);

    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0, 400000]);
    const [category, setCategory] = useState("");
    const [ratings, setRatings] = useState(0);
    const [availability, setAvailability] = useState('all');
    const [sort, setSort] = useState('newest');
    const [progress, setProgress] = useState(0);

    const onLoaderFinished = () => setProgress(0);

    const { keyword } = useParams();
    const { products, loading, error, resultPerPage, filteredProductsCount } =
        useSelector((state) => state.products);

    const setCurrentPageNo = (e) => {
        setCurrentPage(e);
    };

    const getUniqueCategories = products => {
        const categoriesSet = new Set();
        products.forEach(product => {
            categoriesSet.add(product.category);
        });
        return Array.from(categoriesSet);
    };

    const priceRanges = [
        [
            { key: 'range1', label: '0 - 1000', value: [0, 1000] },
            { key: 'range2', label: '1000 - 2500', value: [1000, 2500] }
        ],
        [
            { key: 'range3', label: '2500 - 5000', value: [2500, 5000] },
            { key: 'range4', label: '5000+', value: [5000, 400000] } 
        ]
    ];

    const priceHandler = (event, newPrice) => {
        if (price[0] === newPrice[0] && price[1] === newPrice[1]) {
            // If the clicked range is already selected, deselect it
            setPrice([0, 400000]); // You can adjust the initial state as needed
        } else {
            setPrice(newPrice);
        }
    };

    useEffect(() => {
        setProgress(100);

        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }

        // if (isAuthenticated) {
        //     navigate('/products');
        // }

        const timer = setTimeout(() => {
            setProgress(0);
        }, 5000);

        dispatch(getProduct({
            keyword,
            category,
            priceMin: price[0],
            priceMax: price[1],
            ratingMin: ratings,
            availability,
            sort,
            page: currentPage,
            limit: 8
        }));

        return () => {
            clearTimeout(timer);
        };
    }, [dispatch, navigate, keyword, currentPage, price, category, ratings, availability, sort, error]);

    const resetFilters = () => {
        setCurrentPage(1);
        setPrice([0, 400000]);
        setCategory('');
        setRatings(0);
        setAvailability('all');
        setSort('newest');
    };

    let count = filteredProductsCount;

    return (
        <Fragment>
            {loading ? (
                <LoadingBar
                    color='red'
                    progress={progress}
                    onLoaderFinished={onLoaderFinished}
                />
            ) : (
                <Fragment>
                    <MetaData title='PRODUCTS -- ECOMMERCE' />
                    <h2 className='productsHeading'>Products</h2>
                    <div className='products'>
                        {products &&
                            products.map(product => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                />
                            ))}
                    </div>

                    <div className='filterBox'>
                        <Typography>Price</Typography>
                        <div className='price-ranges'>
                            {priceRanges.map((rangeLine, lineIndex) => (
                                <div
                                    key={`line_${lineIndex}`}
                                    className='price-range-line'
                                >
                                    {rangeLine.map((range, index) => (
                                        <button
                                            key={range.key}
                                            className={`price-range-button ${
                                                price[0] === range.value[0] &&
                                                price[1] === range.value[1]
                                                    ? 'active'
                                                    : ''
                                            }`}
                                            onClick={() =>
                                                    priceHandler(
                                                        null,
                                                        range.value
                                                    )
                                            }
                                        >
                                            {range.label}
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <Typography>Categories</Typography>
                        <ul className='categoryBox'>
                            {getUniqueCategories(products).map(category => (
                                <li
                                    className='category-link'
                                    key={category}
                                    onClick={() => setCategory(category)}
                                >
                                    {category}
                                </li>
                            ))}
                        </ul>
                        <fieldset>
                            <Typography component='legend'>
                                Ratings Above
                            </Typography>
                            <Slider
                                value={ratings}
                                onChange={(e, newRating) => {
                                    setRatings(newRating);
                                }}
                                aria-labelledby='continuous-slider'
                                min={0}
                                max={5}
                                valueLabelDisplay='auto'
                            />
                        </fieldset>
                        <label htmlFor='availability-filter'>Availability</label>
                        <select
                            id='availability-filter'
                            value={availability}
                            onChange={event => {
                                setAvailability(event.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value='all'>All products</option>
                            <option value='in-stock'>In stock</option>
                            <option value='out-of-stock'>Out of stock</option>
                        </select>
                        <label htmlFor='sort-filter'>Sort by</label>
                        <select
                            id='sort-filter'
                            value={sort}
                            onChange={event => {
                                setSort(event.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value='newest'>Newest</option>
                            <option value='price_asc'>Price: low to high</option>
                            <option value='price_desc'>Price: high to low</option>
                            <option value='rating_desc'>Rating: high to low</option>
                            <option value='name_asc'>Name: A-Z</option>
                        </select>
                        <button type='button' onClick={resetFilters}>Reset filters</button>
                    </div>

                    {resultPerPage < count && (
                        <div className='paginationBox'>
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={Number(resultPerPage)}
                                totalItemsCount={filteredProductsCount}
                                onChange={setCurrentPageNo}
                                nextPageText='Next'
                                prevPageText='Prev'
                                firstPageText='1st'
                                lastPageText='Last'
                                itemClass='page-item'
                                linkClass='page-link'
                                activeClass='pageItemActive'
                                activeLinkClass='pageLinkActive'
                                hideFirstLastPages={true}
                                hidePrevNextPages={true}
                            />
                        </div>
                    )}
                </Fragment>
            )}
        </Fragment>
    );
};

export default Products;
