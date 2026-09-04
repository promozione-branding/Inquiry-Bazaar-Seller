import React from 'react'
import SupplierSidebar from '@/components/Supplier/SupplierSidebar'
import Webhook from './Webhook'

export default function page() {
    return (<div className='flex'>
            <SupplierSidebar />
            <Webhook />
        </div>
    )
}
