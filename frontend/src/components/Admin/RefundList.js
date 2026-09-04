import React, { Fragment } from 'react';
import MetaData from '../layout/MetaData';

const RefundList = () => (
    <Fragment>
        <MetaData title='Refund List - Admin' />
        <div className='productListContainer'>
            <h1 id='productListHeading'>REFUNDS</h1>
            <p>Refund data is available from the backend API when configured.</p>
        </div>
    </Fragment>
);

export default RefundList;
