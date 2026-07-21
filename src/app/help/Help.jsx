"use client";
import React, { useEffect, useState } from "react";
import {
  LayoutGrid,
  Package,
  CreditCard,
  User,
  AlertCircle,
  HelpCircle,
  Eye
} from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import Modal from "@/components/Modal/Modal";
import NeedHelpModal from "@/components/Supplier/Product/NeedHelpModal";

const helpItems = [
  { name: "CATEGORY", icon: LayoutGrid, color: "bg-blue-100 text-blue-600" },
  { name: "PRODUCT", icon: Package, color: "bg-green-100 text-green-600" },
  { name: "PAYMENT", icon: CreditCard, color: "bg-yellow-100 text-yellow-600" },
  { name: "PROFILE", icon: User, color: "bg-purple-100 text-purple-600" },
  { name: "COMPLAINT", icon: AlertCircle, color: "bg-red-100 text-red-600" },
  { name: "OTHER", icon: HelpCircle, color: "bg-gray-100 text-gray-600" },
];

export default function Help() {
  const { user } = useSelector((state) => state.auth);
  const [helps, setHelps] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedHelp, setSelectedHelp] = useState(null);
  const [needHelp, setNeedHelp] = useState(false);
  const [issueType, setIssueType] = useState(null);

  const handleView = (help) => {
    setSelectedHelp(help);
    setOpenModal(true);
  };

  useEffect(() => {
    if (user?._id) {
      fetchHelps();
    }
  }, [user]);

  const fetchHelps = async () => {
    try {
      const res = await axios.get("/api/help", {
        headers: { "x-user-id": user?._id, },
      });
      const data = res.data;
      setHelps(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  // console.log(helps)

  return (
    <div className="flex flex-col w-full md:p-4 p-2 md:gap-8 gap-3 bg-gray-100">
      <div className="grid grid-cols-3 lg:grid-cols-6 md:gap-5 gap-2">
        {helpItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} onClick={() => { setNeedHelp(true); setIssueType(item.name) }}
              className="md:h-46 h-30 flex flex-col items-center justify-center md:p-6 p-2 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-white hover:scale-105"
            >
              <div className={`p-4 rounded-full mb-3 ${item.color}`}>
                <Icon size={28} />
              </div>
              <p className="text-sm font-semibold text-gray-700">
                {item.name}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-white shadow-md rounded-xl md:p-4 p-2">
        <h2 className="text-lg font-semibold mb-4">My Help Requests</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Subject</th>
                <th className="p-3">Issue</th>
                <th className="p-3">Description</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {helps.length > 0 ? (
                helps.map((item) => (
                  <tr key={item._id} className="border-b border-gray-300 hover:bg-gray-50 text-sm">
                    <td className="p-3">{item.subject}</td>
                    <td className="p-3">{item.issueType}</td>
                    <td className="p-3 text-nowrap" title={item.description}>{item.description.length > 30 ? item.description.slice(0, 30) + "..." : item.description}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${item.status === "OPEN"
                          ? "bg-blue-100 text-[#0a5183]"
                          : item.status === "IN_PROGRESS"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600"
                          }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <button onClick={() => handleView(item)} className="bg-[#0a5183] hover:bg-[#054776] text-white px-2 p-1.5 text-sm font-semibold rounded-md">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500">
                    No help requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={openModal} onClose={() => { setOpenModal(false); setSelectedHelp(null); }}>
        <Modal.Header title="Help Request Details" />

        <Modal.Body>
          {selectedHelp && (
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-800">Subject</p>
                <p className="font-medium">{selectedHelp.subject}</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-800">Issue</p>
                  <p className="font-medium">{selectedHelp.issueType}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-800">Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${selectedHelp.status === "OPEN"
                      ? "bg-blue-100 text-blue-700"
                      : selectedHelp.status === "IN_PROGRESS"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                      }`}
                  >
                    {selectedHelp.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-800">Description</p>
                <div className="mt-1 rounded-lg border border-gray-300 bg-gray-50 p-3">
                  {selectedHelp.description}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-800">Admin Reply</p>

                <div className="mt-1 rounded-lg border bg-green-50 border-green-200 p-3">
                  {selectedHelp.adminReply ? (
                    selectedHelp.adminReply
                  ) : (
                    <span className="text-gray-500 italic">
                      No reply from admin yet.
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-800">Created</p>
                  <p>
                    {new Date(selectedHelp.createdAt).toLocaleString()}
                  </p>
                </div>

                {selectedHelp.repliedAt && (
                  <div>
                    <p className="text-gray-500">Replied At</p>
                    <p>
                      {new Date(selectedHelp.repliedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <button
            onClick={() => {
              setOpenModal(false);
              setSelectedHelp(null);
            }}
            className="px-4 py-2 rounded-lg bg-[#0a5183] text-white hover:bg-[#08436d]"
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>

      <NeedHelpModal issueType={issueType} open={needHelp} onClose={() => { setNeedHelp(false); fetchHelps() }} user={user} />
    </div>
  );
}