import { X } from 'lucide-react'
import React from 'react'

export default function FilterSidebar({ open, setOpen }) {
    return (<>
        {open && (
            <div
                onClick={() => setOpen(false)}
                className="fixed inset-0 bg-black/30 z-40"
            />
        )}

        <div
            className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 
  transform transition-transform duration-300 flex flex-col
  ${open ? "translate-x-0" : "translate-x-full"}`}
        >

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-b-gray-300">
                <h2 className="text-lg font-semibold">Filters</h2>
                <X className="cursor-pointer" onClick={() => setOpen(false)} />
            </div>

            {/* Content */}
            <div className="p-4 space-y-5 overflow-y-auto flex-1">

                {/* Location */}
                <div>
                    <p className="font-medium mb-2">Location</p>
                    <input
                        type="text"
                        placeholder="Enter location"
                        className="input"
                    />
                </div>

                {/* Category */}
                <div>
                    <p className="font-medium mb-2">Category</p>
                    <select className="input">
                        <option>All</option>
                        <option>Stationery</option>
                        <option>Electronics</option>
                    </select>
                </div>

                {/* Value */}
                <div>
                    <p className="font-medium mb-2">Value</p>
                    <select className="input">
                        <option>Relevant</option>
                        <option>Low to High</option>
                        <option>High to Low</option>
                        <option>Under 10000</option>
                        <option>Above 10000</option>
                    </select>
                </div>

                {/* Product */}
                <div>
                    <p className="font-medium mb-2">Product</p>
                    <input
                        type="text"
                        placeholder="Search product"
                        className="input"
                    />
                </div>

            </div>

            {/* Footer */}
            <div className="p-4 flex gap-2 border-t border-gray-300">
                <button className="w-50! icon-btn-blue">Reset</button>
                <button className="w-50! icon-btn-red">
                    Apply
                </button>
            </div>
        </div>
    </>)
}
