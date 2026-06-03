import SupplierSidebar from '@/components/Supplier/SupplierSidebar'
import React from 'react'
import Products from './Products'

export default function page() {
    return (<div className='flex'>
        <SupplierSidebar />
        <Products />
    </div>)
}
