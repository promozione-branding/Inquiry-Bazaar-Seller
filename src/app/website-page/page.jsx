import React from 'react'
import Website from './Website'
import SupplierSidebar from '@/components/Supplier/SupplierSidebar'

export default function page() {
    return (<>
        <div className='flex'>
            <SupplierSidebar />
            <Website />
        </div>
    </>)
}
