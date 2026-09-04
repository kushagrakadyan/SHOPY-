import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBar from 'react-top-loading-bar';
import { Typography, Slider } from '@mui/material';
import Pagination from 'react-js-pagination';

import { clearErrors, searchProducts } from '../../actions/productAction';
import ProductCard from '../Home/ProductCard';
import MetaData from '../layout/MetaData';

import './Products.css';

const DEFAULT_PRICE = [0, 100000];

const SearchResult = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQueryString = searchParams.toString();
    const keyword = searchParams.get('keyword') || '';
    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [price, setPrice] = useState([
        Number(searchParams.get('priceMin')) || DEFAULT_PRICE[0],
        Number(searchParams.get('priceMax')) || DEFAULT_PRICE[1]
    ]);
    const [ratings, setRatings] = useState(Number(searchParams.get('ratingMin')) || 0);
    const [availability, setAvailability] = useState(searchParams.get('availability') || 'all');
    const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);

    const { loading, error, products, facets, filteredProductsCount, resultPerPage } = useSelector(
        state => state.searchResults
    );

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }
    }, [dispatch, error]);

    useEffect(() => {
        const nextParams = new URLSearchParams(searchQueryString);
        const values = {
            category,
            priceMin: price[0] || '',
            priceMax: price[1] || '',
            ratingMin: ratings || '',
            availability: availability === 'all' ? '' : availability,
            sort: sort === 'newest' ? '' : sort,
            page: currentPage === 1 ? '' : currentPage
        };

        Object.entries(values).forEach(([key, value]) => {
            if (value === '') nextParams.delete(key);
            else nextParams.set(key, value);
        });
        setSearchParams(nextParams, { replace: true });

        dispatch(searchProducts({
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
    }, [dispatch, keyword, category, price, ratings, availability, sort, currentPage, searchQueryString, setSearchParams]);

    const categories = facets?.categories?.buckets || [];

    const resetFilters = () => {
        setCategory('');
        setPrice(DEFAULT_PRICE);
        setRatings(0);
        setAvailability('all');
        setSort('newest');
        setCurrentPage(1);
    };

    return (
        <Fragment>
            {loading ? (
                <LoadingBar color='red' progress={100} />
            ) : (
                <Fragment>
                    <MetaData title={`Search Results for "${keyword}"`} />
                    <h2 className='productsHeading'>Search Results</h2>

                    <div className='search-page-container'>
                        <div className='filterBox'>
                            <Typography>Categories</Typography>
                            <ul className='categoryBox'>
                                {categories.map(categoryOption => (
                                    <li
                                        className='category-link'
                                        key={categoryOption.key}
                                        onClick={() => {
                                            setCategory(categoryOption.key);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        {categoryOption.key}
                                    </li>
                                ))}
                            </ul>

                            <fieldset className='filter-group'>
                                <Typography component='legend'>Price</Typography>
                                <Slider
                                    value={price}
                                    onChange={(event, newPrice) => {
                                        setPrice(newPrice);
                                        setCurrentPage(1);
                                    }}
                                    valueLabelDisplay='auto'
                                    aria-labelledby='range-slider'
                                    min={0}
                                    max={100000}
                                />
                            </fieldset>

                            <fieldset className='filter-group'>
                                <Typography component='legend'>Ratings Above</Typography>
                                <Slider
                                    value={ratings}
                                    onChange={(event, newRating) => {
                                        setRatings(newRating);
                                        setCurrentPage(1);
                                    }}
                                    aria-labelledby='continuous-slider'
                                    valueLabelDisplay='auto'
                                    min={0}
                                    max={5}
                                />
                            </fieldset>

                            <label htmlFor='search-availability'>Availability</label>
                            <select
                                id='search-availability'
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

                            <label htmlFor='search-sort'>Sort by</label>
                            <select
                                id='search-sort'
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

                        <div className='products'>
                            {products && products.length > 0 ? (
                                products.map(product => <ProductCard key={product._id} product={product} />)
                            ) : (
                                <p className='no-products-found'>No products found for your search.</p>
                            )}
                        </div>
                    </div>

                    {resultPerPage < filteredProductsCount && (
                        <div className='paginationBox'>
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={Number(resultPerPage)}
                                totalItemsCount={filteredProductsCount}
                                onChange={setCurrentPage}
                                nextPageText='Next'
                                prevPageText='Prev'
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

export default SearchResult;
