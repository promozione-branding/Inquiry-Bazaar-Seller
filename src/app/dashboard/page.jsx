import SupplierSidebar from '@/components/Supplier/SupplierSidebar'
import React from 'react'
import Dashboard from './Dashboard'

export default function page() {
    return (<div className='flex'>
        <SupplierSidebar />
        <Dashboard />
    </div>)
}
