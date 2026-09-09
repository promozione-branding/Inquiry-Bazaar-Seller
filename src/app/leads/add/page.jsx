import React from 'react'
import SupplierSidebar from '@/components/Supplier/SupplierSidebar'
import AddLead from './AddLead'

export default function page() {
    return (<div className='flex'>
        <SupplierSidebar />
        <AddLead />
    </div>
    )
}
