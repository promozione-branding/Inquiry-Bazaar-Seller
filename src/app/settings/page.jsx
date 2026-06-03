import SupplierSidebar from '@/components/Supplier/SupplierSidebar'
import React from 'react'
import Settings from './Settings'

export default function page() {
    return (<div className='flex'>
        <SupplierSidebar />
        <Settings />
    </div>)
}
