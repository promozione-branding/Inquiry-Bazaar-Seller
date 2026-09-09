import React from 'react'
import SupplierSidebar from '@/components/Supplier/SupplierSidebar'
import Edit from './Edit'

export default function page() {
    return (<div className='flex'>
        <SupplierSidebar />
        <Edit />
    </div>
    )
}
