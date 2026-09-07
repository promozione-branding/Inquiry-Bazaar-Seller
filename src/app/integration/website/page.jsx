import React from 'react'
import SupplierSidebar from '@/components/Supplier/SupplierSidebar'
import Website from './Website'

export default function page() {
    return (<div className='flex'>
        <SupplierSidebar />
        <Website />
    </div>
    )
}
