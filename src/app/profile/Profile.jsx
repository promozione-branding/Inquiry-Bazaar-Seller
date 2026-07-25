"use client";
import { useEffect, useState } from "react";
import {
  Building2,
  Landmark,
  Star,
  Share2,
  Phone,
  Mail,
  ChartLine,
  Link,
  File,
  Edit,
  MessageCircle,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Camera,
  User,
  CreditCard,
} from "lucide-react";
import BusinessForm from "@/components/Supplier/Profile/BusinessForm";
import BankForm from "@/components/Supplier/Profile/BankForm";
import { useSelector, useDispatch } from "react-redux";
import AdditionalInfoForm from "@/components/Supplier/Profile/AdditionalInfoForm";
import SocialForm from "@/components/Supplier/Profile/SocialForm";
import EditModal from "@/components/Supplier/Profile/EditModal";
import toast from "react-hot-toast";
import axios from "axios";
import { setUser } from "@/redux/slices/authSlice";
import Review from "@/components/Supplier/Profile/Review";
import Docs from "@/components/Supplier/Profile/Docs";
import { FaArrowRight, FaCrown } from "react-icons/fa";
import Modal from "@/components/Modal/Modal";
import SelectInput from "@/components/Inputs/SelectInput";
import Input from "@/components/Inputs/FormInput";

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("business");
  const [editModal, setEditModal] = useState(false);
  const [businessDetails, setBusinessDetails] = useState("");
  const [modelOpen, setModelOper] = useState(false)
  const [plan, setPlan] = useState("")
  const [loading1, setLoading1] = useState(false);

  const tabs = [
    { id: "business", label: "Business", icon: Building2 },
    { id: "bank", label: "Bank", icon: Landmark },
    { id: "additional-info", label: "Additional Info", icon: Link },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "performance", label: "Performance", icon: ChartLine },
    { id: "docs", label: "Docs", icon: File },
    { id: "social", label: "Social", icon: Share2 },
  ];

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    otherEmail: "",
    otherPhone: "",
    profileImage: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = async () => {
    try {
      const res = await axios.put("/api/auth/update", form,
        { headers: { "x-user-id": user?._id, }, }
      );
      const updatedUser = res.data?.data;
      if (updatedUser) {
        dispatch(setUser(updatedUser));
      }
      toast.success("Profile updated");
      setEditModal(false)
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    }
  }

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        otherEmail: user.otherEmail || "",
        otherPhone: user.otherPhone || "",
        profileImage: user.profileImage || "",
      });
    }
  }, [user, editModal]);

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadImage = async () => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("/api/upload", formData, {
        headers: { "x-user-id": user?._id, },
      });

      if (!res?.data?.success) {
        throw new Error(res?.data?.error || "Upload failed");
      }

      const { url } = res.data;
      dispatch(setUser({
        ...user,
        profileImage: url,
      }));

      return true;
    };

    await toast.promise(uploadImage(), {
      loading: "Uploading profile image...",
      success: "Profile image updated!",
      error: (err) => err.message || "Upload failed",
    });
  };

  const handleSubmit = async () => {
    if (plan === "") return toast.error("Select your plan first")

    const data = {
      supplierToken: "7303486777",
      platform: "Seller Profile",
      platformEmail: "lead.inquirybazaar@gmail.com",
      name: user?.name || "NA",
      email: user?.email || "NA",
      company: businessDetails?.companyName || "NA",
      phone: user?.phone || "NA",
      product: `${plan} plan` || "NA",
      place: businessDetails?.address || "NA",
      message: "Inquiry for membership plan",
    };

    // if (!/^\d{10}$/.test(user?.phone)) {
    //   return toast.error("Enter a valid 10-digit phone number");
    // }

    try {
      setLoading1(true);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_LEAD_BACKEND_BASE_URL}/api/form/add`, data,
        { validateStatus: (status) => status >= 200 && status < 500 }
      );
      if (res.status >= 200 && res.status < 300) {
        toast.success("Message send successfully");
        setTimeout(() => {
          setModelOper(false);
        }, 1000);
        setPlan("")
      }
    } catch (err) {
      console.log("ERROR:", err?.response || err.message);
      toast.error("Something went wrong");
    } finally {
      setLoading1(false);
    }
  };

  return (
    <div className="p-2 xl:p-6 w-full bg-gray-100">
      <div className="grid lg:grid-cols-3 xl:gap-5 gap-3">
        <div className="bg-white p-6 rounded-xl shadow space-y-4 h-fit relative">
          <div onClick={() => setEditModal(true)} className="absolute top-2 right-2 rounded-full p-2 bg-blue-50 hover:bg-[#def1ff] text-[#0a5183]">
            <Edit size={16} />
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="flex flex-col items-center gap-3 relative">
              {user?.profileImage ? (
                <img
                  src={user?.profileImage}
                  className="w-20 h-20 rounded-full object-contain border border-gray-300"
                  alt=""
                />
              ) : (
                <div className="border border-blue-300 w-25 h-25 rounded-full bg-gray-50 text-black flex items-center justify-center text-4xl font-semibold">
                  {getInitial(user?.name)}
                </div>
              )}
              <label className="absolute bottom-1 right-0 z-40 rounded-full p-1.5 bg-[#0a5183] hover:bg-[#0a4169] text-white cursor-pointer">
                <Camera size={16} />
                <input type="file" className="hidden" onChange={handleImageChange} />
              </label>
            </div>

            <h1 className="text-xl font-semibold mt-2">{user?.name || "-"}</h1>
            <p className="text-base text-gray-600">{businessDetails?.companyName || "-"}</p>
          </div>
          <div className="space-y-3 text-base grid lg:grid-cols-2">
            <p className="flex items-center gap-2">
              <Phone size={18} className="text-[#0a5183]" /> {user?.phone || "-"}
            </p>
            <p className="flex items-center gap-2">
              <Phone size={18} className="text-[#0a5183]" /> {user?.otherPhone || "-"}
            </p>
            <p className="flex items-center gap-2 lg:col-span-2">
              <Mail size={18} className="text-[#0a5183]" /> {user?.email || "-"}
            </p>
            <p className="flex items-center gap-2 lg:col-span-2">
              <Mail size={18} className="text-[#0a5183]" /> {user?.otherEmail || "-"}
            </p>
          </div>
          <div className="flex justify-center gap-5 pt-3 border-t border-t-gray-300 mt-3">
            {businessDetails?.social?.whatsapp &&
              <a
                href={businessDetails?.social?.whatsapp || "#"}
                target="_blank"
                className="socialIcon"
              >
                <MessageCircle size={18} />
              </a>}

            {businessDetails?.social?.linkedin &&
              <a
                href={businessDetails?.social?.linkedin || "#"}
                target="_blank"
                className="socialIcon"
              >
                <Linkedin size={18} />
              </a>}

            {businessDetails?.social?.instagram &&
              <a
                href={businessDetails?.social?.instagram || "#"}
                target="_blank"
                className="socialIcon"
              >
                <Instagram size={18} />
              </a>}

            {businessDetails?.social?.facebook &&
              <a
                href={businessDetails?.social?.facebook || "#"}
                target="_blank"
                className="socialIcon"
              >
                <Facebook size={18} />
              </a>}

            {businessDetails?.social?.youtube &&
              <a
                href={businessDetails?.social?.youtube || "#"}
                target="_blank"
                className="socialIcon"
              >
                <Youtube size={18} />
              </a>}

            {businessDetails?.social?.twitter &&
              <a
                href={businessDetails?.social?.twitter || "#"}
                target="_blank"
                className="socialIcon"
              >
                <Twitter size={18} />
              </a>}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow p-2 md:flex hidden flex-wrap gap-1.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
                     ${activeTab === tab.id ? "bg-[#D01132] text-white hover:bg-[#c10f2c]" : "hover:bg-[#fbe9ec] text-[#D01132] border-[0.5] border-[#D01132]"}`}>
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex md:hidden justify-between">
            <div className="w-full"></div>
            <select onChange={(e) => setActiveTab(e.target.value)} className="input w-50! bg-white">
              {tabs.map((i) => (
                <option key={i.id} value={i.id}>{i.label}</option>
              ))}
            </select>
          </div>

          {/* Content Box */}
          <div className="bg-white p-6 rounded-xl shadow">
            {activeTab === "business" && (
              <BusinessForm user={user} setBusinessDetails={setBusinessDetails} />
            )}

            {activeTab === "bank" && (
              <BankForm user={user} />
            )}

            {activeTab === "additional-info" && (
              <AdditionalInfoForm user={user} />
            )}

            {activeTab === "social" && (
              <SocialForm user={user} businessId={businessDetails?._id} />
            )}

            {activeTab === "reviews" && (
              <Review user={user} businessId={businessDetails?._id} />
            )}

            {activeTab === "docs" && (
              <Docs user={user._id} />
            )}

            {activeTab === "performance" && (
              <div className="flex items-center justify-center py-0 px-4">
                <div className="max-w-lg w-full rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-8 text-center shadow-sm">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                    <FaCrown className="text-3xl text-amber-500" />
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900">
                    Upgrade Your Account
                  </h2>

                  <p className="mt-3 text-gray-600">
                    Performance analytics are available exclusively for Premium members.
                    Upgrade your account to unlock detailed insights, advanced reports, and
                    additional features.
                  </p>

                  <button onClick={() => setModelOper(true)} // Change route if needed
                    className="mt-8 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 font-medium text-white transition hover:bg-amber-600"
                  >
                    Upgrade Now
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal open={modelOpen} onClose={() => setModelOper(false)}>
        <Modal.Header title="Contact Us" />
        <Modal.Body>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <SelectInput
                label="Membership Plan"
                Icon={CreditCard}
                name="membershipPlan"
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                options={["Elite", "Pro", "Growth", "Starter"].map((c) => ({
                  label: c,
                  value: c,
                }))}
              />
              <Input
                label="Your Name"
                type="text"
                Icon={User}
                name="name"
                disabled
                value={user?.name}
              // onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Your Phone"
                type="tel"
                Icon={Phone}
                name="phone"
                disabled
                value={user?.phone}
              // onChange={handleChange}
              />
              <Input
                label="Your Email"
                type="text"
                Icon={Mail}
                name="email"
                disabled
                value={user?.email}
              // onChange={handleChange}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className='flex justify-end gap-2'>
            <button disabled={loading1} onClick={handleSubmit} className="px-4 py-2 rounded-md text-white bg-[#f45a06] hover:bg-[#e45407]">
              {loading1 ? "Sending..." : "Send"}
            </button>
            <button onClick={() => setModelOper(false)} className="border border-gray-300 px-4 py-2 rounded-md text-black bg-gray-100 hover:bg-gray-200">
              Close
            </button>
          </div>
        </Modal.Footer>
      </Modal>

      <EditModal
        open={editModal}
        onClose={() => setEditModal(false)}
        handleEdit={handleEdit}
        user={user}
        form={form}
        handleChange={handleChange}
        getInitial={getInitial}
      />
    </div>
  );
}