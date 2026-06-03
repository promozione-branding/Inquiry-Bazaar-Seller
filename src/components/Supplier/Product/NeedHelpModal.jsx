import Modal from '@/components/Modal/Modal'
import React, { useState } from 'react'
import { Captions, MessageCircle, } from "lucide-react";
import toast from 'react-hot-toast';
import Input from '@/components/Inputs/FormInput';
import axios from 'axios';

export default function NeedHelpModal({ open, onClose, user }) {
    const [form, setForm] = useState({
        subject: "",
        description: "",
        issueType: "CATEGORY",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        try {
            if (!form.subject || !form.description) {
                return toast.error("All fields are required");
            }
            // console.log(form);
            const res = await axios.post("/api/help", form, {
                headers: { "x-user-id": user?._id, },
            });
            const data = res.data;
            toast.success("Help request submitted");
            // reset form
            setForm({
                subject: "",
                description: "",
                supplierId: user?._id,
                issueType: "CATEGORY",
            });
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Modal.Header title="Send Message" />
            <Modal.Body>
                <div>
                    <Input
                        label="Subject"
                        Icon={Captions}
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="label">Message</label>
                    <div className="relative">
                        <MessageCircle size={18} className="icon" />
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange} cols={6} rows={6}
                            className="input pl-8!"
                            placeholder="Enter your Message"
                        />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className='flex justify-end gap-2'>
                    <button onClick={handleSave} className="px-4 py-2 rounded-md text-white bg-[#0a5183] hover:bg-[#074977]">
                        Save
                    </button>
                    <button onClick={onClose} className="border border-gray-300 px-4 py-2 rounded-md text-black bg-gray-100 hover:bg-gray-200">
                        Close
                    </button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}
