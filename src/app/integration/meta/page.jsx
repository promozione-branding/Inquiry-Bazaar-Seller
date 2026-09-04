import React from 'react'
import Meta from './Meta'
import SupplierSidebar from '@/components/Supplier/SupplierSidebar'

export default function page() {
    return (<div className='flex'>
        <SupplierSidebar />
        <Meta />
    </div>
    )
}
