import { motion } from "framer-motion";
import {
  User,
  Phone,
  Mail,
  MapPin,
  IndianRupee,
  MessageSquare,
  Building2,
  Globe,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function LeadList({ user, filter }) {
  const [leadsData, setLeadsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_LEAD_BACKEND_BASE_URL}/api/form/get-forms/${user?._id}?filter=${filter}`
        );

        if (response.data.success) {
          setLeadsData(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching leads:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchLeads();
    }
  }, [user, filter]);

  // Skeleton Loader Card
  const SkeletonCard = () => (
    <div className="rounded-xl p-2 animate-pulse">
      <div className="bg-white rounded-xl p-4 h-full shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="h-5 w-32 bg-gray-200 rounded"></div>
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
        </div>

        <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>

        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          <div className="h-4 bg-gray-200 rounded w-3/6"></div>
        </div>

        <div className="mt-5 p-3 border rounded-lg border-gray-300">
          <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      {loading ? (
        <>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </>
      ) : leadsData?.length > 0 ? (
        leadsData.map((lead, index) => (
          <motion.div key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25 }}
            className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-xl bg-[#074977]/10 border border-[#074977]/10 flex items-center justify-center">
                      <User
                        size={20}
                        className="text-[#074977]"
                      />
                    </div>

                    <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white bg-green-500" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-[16px] font-semibold text-gray-800 truncate">
                      {lead.name}
                    </h3>

                    <div className="flex items-center gap-2 mt-0.5">
                      <Globe
                        size={13}
                        className="text-[#074977]"
                      />

                      <p className="text-sm text-gray-500 truncate">
                        {lead.platform?.replace("https://", "")}
                      </p>
                    </div>
                  </div>
                </div>

                <button onClick={() => window.open(`tel:${lead.phone}`)}
                  className="w-10 h-10 rounded-xl bg-[#D01132]/10 hover:bg-[#D01132]/20 flex items-center justify-center transition shrink-0"
                >
                  <Phone
                    size={18}
                    className="text-[#D01132]"
                  />
                </button>
              </div>
            </div>

            <div className="px-4 py-2.5 space-y-3">
              <div className="space-y-2.5">
                {lead.platformEmail && (
                  <div className="border border-gray-100 flex items-center gap-3 bg-gray-50 hover:bg-blue-50 transition rounded-xl px-4 py-2">
                    <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                      <Mail
                        size={17}
                        className="text-blue-600"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-gray-800 mb-0.5">
                        Platform Email
                      </p>

                      <p className="text-sm font-medium text-gray-800 truncate">
                        {lead.platformEmail}
                      </p>
                    </div>
                  </div>
                )}

                <div className="border border-gray-100 flex items-center gap-3 bg-gray-50 hover:bg-red-50 transition rounded-xl px-4 py-2">
                  <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                    <Phone
                      size={17}
                      className="text-[#D01132]"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-gray-800 mb-0.5">
                      Phone
                    </p>

                    <p className="text-sm font-medium text-gray-800">
                      {lead.phone}
                    </p>
                  </div>
                </div>

                {lead.email && (
                  <div className="border border-gray-100 flex items-center gap-3 bg-gray-50 hover:bg-cyan-50 transition rounded-xl px-4 py-2">
                    <div className="w-11 h-11 rounded-xl bg-cyan-100 flex items-center justify-center shrink-0">
                      <Mail
                        size={17}
                        className="text-cyan-600"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-gray-800 mb-0.5">
                        User Email
                      </p>

                      <p className="text-sm font-medium text-gray-800 truncate">
                        {lead.email}
                      </p>
                    </div>
                  </div>
                )}

                {lead.place && (
                  <div className="border border-gray-100 flex items-center gap-3 bg-gray-50 hover:bg-orange-50 transition rounded-xl px-4 py-2">
                    <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                      <MapPin
                        size={17}
                        className="text-orange-600"
                      />
                    </div>

                    <div>
                      <p className="text-xs text-gray-800 mb-0.5">
                        Location
                      </p>

                      <p className="text-sm font-medium text-gray-800">
                        {lead.place}
                      </p>
                    </div>
                  </div>
                )}

                {lead.priceRange && (
                  <div className="border border-gray-100 flex items-center gap-3 bg-gray-50 hover:bg-green-50 transition rounded-xl px-4 py-2">
                    <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                      <IndianRupee
                        size={17}
                        className="text-green-600"
                      />
                    </div>

                    <div>
                      <p className="text-xs text-gray-800 mb-0.5">
                        Budget
                      </p>

                      <p className="text-sm font-medium text-gray-800">
                        {lead.priceRange}
                      </p>
                    </div>
                  </div>
                )}

                {lead.product && (
                  <div className="border border-gray-100 flex items-center gap-3 bg-gray-50 hover:bg-indigo-50 transition rounded-xl px-4 py-2">
                    <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                      <Building2
                        size={17}
                        className="text-indigo-600"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-gray-800 mb-0.5">
                        Product
                      </p>

                      <p className="text-sm font-medium text-gray-800 truncate">
                        {lead.product}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {lead.message && (
                <div className="rounded-xl border border-[#074977]/10 bg-gradient-to-br from-[#074977]/5 to-[#D01132]/5 px-4 py-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <MessageSquare
                      size={16}
                      className="text-[#074977]"
                    />

                    <p className="text-sm font-semibold text-gray-800">
                      Message
                    </p>
                  </div>

                  <p className="text-sm text-gray-600 leading-6">
                    {lead.message}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ))
      ) : (
        <p className="text-2xl font-bold text-gray-800 text-center col-span-3">
          No leads found
        </p>
      )}
    </div>
  );
}