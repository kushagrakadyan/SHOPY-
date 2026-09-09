import React, { Fragment } from 'react';
import MetaData from '../layout/MetaData';

const ReturnList = () => (
    <Fragment>
        <MetaData title='Return List - Admin' />
        <div className='productListContainer'>
            <h1 id='productListHeading'>RETURNS</h1>
            <p>Return records are loaded from the backend when available.</p>
        </div>
    </Fragment>
);

export default ReturnList;
