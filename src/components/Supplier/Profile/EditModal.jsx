import Modal from '@/components/Modal/Modal'
import React from 'react'
import {
    User,
    Mail,
    Phone,
} from "lucide-react";

export default function EditModal({ open, onClose, handleEdit, user, handleChange, form, getInitial }) {
    return (<>
        <Modal open={open} onClose={onClose}>
            <Modal.Header title="Edit Profile Here" />
            <Modal.Body>
                <div className="space-y-4">
                    <div className="flex flex-col items-center gap-3">
                        {user?.profileImage ? (
                            <img
                                src={form?.profileImage}
                                className="w-20 h-20 rounded-full object-cover border"
                                alt=""
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-[#0a5183] text-white flex items-center justify-center text-2xl font-semibold">
                                {getInitial(user?.name)}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Full Name"
                            name="name"
                            value={form?.name}
                            icon={<User size={18} />}
                            onChange={handleChange}
                            placeholder="Enter your name"
                        />

                        <Input
                            label="Email"
                            name="email"
                            value={form?.email}
                            icon={<Mail size={18} />}
                            onChange={handleChange}
                            placeholder="Enter email"
                        />

                        <Input
                            label="Phone"
                            name="phone"
                            value={form?.phone}
                            icon={<Phone size={18} />}
                            onChange={handleChange}
                            placeholder="Enter phone"
                        />

                        <Input
                            label="Other Email"
                            name="otherEmail"
                            value={form?.otherEmail}
                            icon={<Mail size={18} />}
                            onChange={handleChange}
                            placeholder="Alternate email"
                        />

                        <Input
                            label="Other Phone"
                            name="otherPhone"
                            value={form?.otherPhone}
                            icon={<Phone size={18} />}
                            onChange={handleChange}
                            placeholder="Alternate phone"
                        />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className='flex justify-end gap-2'>
                    <button onClick={handleEdit} className="px-4 py-2 rounded-md text-white bg-[#0a5183] hover:bg-[#074977]">
                        Save
                    </button>
                    <button onClick={onClose} className="border border-gray-300 px-4 py-2 rounded-md text-black bg-gray-100 hover:bg-gray-200">
                        Close
                    </button>
                </div>
            </Modal.Footer>
        </Modal>
    </>)
}

function Input({ label, icon, ...props }) {
    return (
        <div>
            <label className="label">{label}</label>
            <div className="relative">
                <div className="icon">{icon}</div>
                <input
                    className="input !pl-8"
                    {...props}
                />
            </div>
        </div>
    );
}
