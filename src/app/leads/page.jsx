import React from 'react'
import Leads from './Leads'
import SupplierSidebar from '@/components/Supplier/SupplierSidebar'

export default function page() {
    return (<div className='flex'>
            <SupplierSidebar />
            <Leads />
        </div>
    )
}
