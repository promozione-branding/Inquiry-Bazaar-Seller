import SupplierSidebar from '@/components/Supplier/SupplierSidebar'
import React from 'react'
import Profile from './Profile'

export default function page() {
    return (<div className='flex'>
        <SupplierSidebar />
        <Profile />
    </div>)
}
