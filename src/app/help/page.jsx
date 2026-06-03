import SupplierSidebar from '@/components/Supplier/SupplierSidebar'
import React from 'react'
import Help from './Help'

export default function page() {
    return (<div className='flex'>
        <SupplierSidebar />
        <Help />
    </div>)
}
