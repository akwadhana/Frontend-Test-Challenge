import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaChevronDown,
  FaEye,
  FaEdit,
  FaTrash,
  FaCheckCircle,
} from "react-icons/fa";
import api from "../../api/axios";

type CampaignStatus = "ACTIVE" | "INACTIVE";
type DateFilter =
  | "any"
  | "today"
  | "last7"
  | "last30"
  | "thisMonth"
  | "lastMonth";

interface CampaignApiResponse {
  id: number;
  campaignName: string;
  startDate: string;
  campaignStatus: string;
}

interface Campaign {
  id: string;
  name: string;
  startDate: string;
  status: CampaignStatus;
}

// Delete Confirmation Modal Component
const DeleteModal: React.FC<{
  open: boolean;
  campaignName: string;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ open, campaignName, loading, onClose, onConfirm }) => {
  React.useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    if (open) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose, loading]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40"
        onClick={() => {
          if (!loading) onClose();
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-black/5 min-h-[220px] flex flex-col"
      >
        <div className="p-6 flex-1 flex flex-col justify-center">
          <h3 className="text-lg font-semibold text-gray-900 text-center">
            Delete Campaign
          </h3>
          <div className="my-4 border-t border-gray-100" />
          <div className="text-sm text-gray-600 text-center">
            <p>
              Are you sure you want to delete{" "}
              <span className="font-semibold">"{campaignName}"</span>?
            </p>
            <p className="mt-2 text-gray-500">This action cannot be undone.</p>
          </div>
        </div>
        <div className="border-t border-gray-100 px-6 py-4 flex justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-400"
          >
            {loading ? "Deleting..." : "Delete Campaign"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Success Modal Component
const SuccessModal: React.FC<{
  open: boolean;
  campaignName: string;
  onClose: () => void;
}> = ({ open, campaignName, onClose }) => {
  React.useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-black/5 min-h-[220px] flex flex-col justify-center">
        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <FaCheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Campaign Deleted Successfully
          </h3>
          <div className="my-4 border-t border-gray-100" />
          <p className="text-sm text-gray-600 mb-6">
            <span className="font-semibold">"{campaignName}"</span> has been successfully deleted.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex w-full justify-center rounded-md bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

const PAGE_SIZE = 10;

const transformApiToCampaign = (apiData: CampaignApiResponse): Campaign => {
  const mapStatus = (status: string): CampaignStatus => {
    return status === "ACTIVE" || status === "active" ? "ACTIVE" : "INACTIVE";
  };

  return {
    id: apiData.id.toString(),
    name: apiData.campaignName || "Unnamed Campaign",
    startDate: apiData.startDate,
    status: mapStatus(apiData.campaignStatus),
  };
};

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB").format(new Date(iso));

const isInDateFilter = (date: Date, filter: DateFilter) => {
  if (filter === "any") return true;
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  switch (filter) {
    case "today":
      return date >= startOfToday;
    case "last7":
      return (
        date >= new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
      );
    case "last30":
      return (
        date >= new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30)
      );
    case "thisMonth":
      return date >= new Date(now.getFullYear(), now.getMonth(), 1);
    case "lastMonth":
      const startOfLastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      return date >= startOfLastMonth && date <= endOfLastMonth;
    default:
      return true;
  }
};

const StatusBadge: React.FC<{ status: CampaignStatus }> = ({ status }) => (
  <span
    className={`rounded px-2 py-0.5 text-xs font-semibold ${
      status === "ACTIVE"
        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
        : "bg-red-50 text-red-700 ring-1 ring-red-600/20"
    }`}
  >
    {status === "ACTIVE" ? "Active" : "Inactive"}
  </span>
);

export const CampaignsTable: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<"all" | CampaignStatus>(
    "all"
  );
  const [search, setSearch] = useState("");
  const [dateOpen, setDateOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilter>("any");
  const [page, setPage] = useState(1);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);
  const [deletedCampaignName, setDeletedCampaignName] = useState("");

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/campaign");
      const transformedData = response.data.map(
        (apiCampaign: CampaignApiResponse) =>
          transformApiToCampaign(apiCampaign)
      );
      setCampaigns(transformedData);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
      alert("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Open delete confirmation modal
  const openDeleteModal = (campaign: Campaign) => {
    setCampaignToDelete(campaign);
    setDeleteModalOpen(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    if (!deleteLoading) {
      setDeleteModalOpen(false);
      setCampaignToDelete(null);
    }
  };

  // Close success modal
  const closeSuccessModal = () => {
    setSuccessModalOpen(false);
    setDeletedCampaignName("");
  };

  // Actual delete operation
  const handleDelete = async () => {
    if (!campaignToDelete) return;

    setDeleteLoading(campaignToDelete.id);
    try {
      await api.delete(`/api/campaign/${campaignToDelete.id}`);
      setCampaigns((prev) => prev.filter((c) => c.id !== campaignToDelete.id));
      
      // Store the deleted campaign name for success modal
      setDeletedCampaignName(campaignToDelete.name);
      
      // Close delete modal and open success modal
      setDeleteModalOpen(false);
      setSuccessModalOpen(true);
      setCampaignToDelete(null);
      
    } catch (error) {
      console.error("Failed to delete campaign:", error);
      alert("Failed to delete campaign");
    } finally {
      setDeleteLoading(null);
    }
  };

  const counts = useMemo(() => {
    const active = campaigns.filter((d) => d.status === "ACTIVE").length;
    const inactive = campaigns.length - active;
    return { all: campaigns.length, active, inactive };
  }, [campaigns]);

  const filtered = useMemo(() => {
    let out = campaigns.slice();

    if (statusFilter !== "all") {
      out = out.filter((c) => c.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter((c) => c.name.toLowerCase().includes(q));
    }
    if (dateFilter !== "any") {
      out = out.filter((c) =>
        isInDateFilter(new Date(c.startDate), dateFilter)
      );
    }
    return out;
  }, [campaigns, statusFilter, search, dateFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(Math.max(1, page), pageCount);
  const items = useMemo(
    () => filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE),
    [filtered, pageSafe]
  );

  useEffect(() => {
    setPage(1);
  }, [statusFilter, search, dateFilter]);

  const TabButton: React.FC<{
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }> = ({ active, onClick, children }) => (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-3 py-1.5 text-sm ${
        active
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );

  if (loading) {
    return (
      <div className="w-full rounded-xl bg-white p-6 ring-1 ring-black/5">
        <div className="flex items-center justify-center py-10">
          <p className="text-gray-500">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full rounded-xl bg-white p-4 sm:p-6 ring-1 ring-black/5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-gray-900">All Campaigns</h2>

          <div className="flex flex-wrap items-center gap-2">
            <TabButton
              active={statusFilter === "all"}
              onClick={() => setStatusFilter("all")}
            >
              All ({counts.all})
            </TabButton>
            <TabButton
              active={statusFilter === "INACTIVE"}
              onClick={() => setStatusFilter("INACTIVE")}
            >
              Inactive ({counts.inactive})
            </TabButton>
            <TabButton
              active={statusFilter === "ACTIVE"}
              onClick={() => setStatusFilter("ACTIVE")}
            >
              Active ({counts.active})
            </TabButton>

            <div className="relative ml-2">
              <FaSearch className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search.."
                className="w-48 sm:w-56 rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setDateOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                Filter by date{dateFilter !== "any" ? `: ${dateFilter}` : ""}
                <FaChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {dateOpen && (
                <div
                  className="absolute right-0 z-10 mt-2 w-44 rounded-md border border-gray-200 bg-white p-1 shadow-lg"
                  onMouseLeave={() => setDateOpen(false)}
                >
                  {(
                    [
                      "any",
                      "today",
                      "last7",
                      "last30",
                      "thisMonth",
                      "lastMonth",
                    ] as DateFilter[]
                  ).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setDateFilter(opt);
                        setDateOpen(false);
                      }}
                      className={`w-full rounded px-2 py-2 text-left text-sm capitalize ${
                        opt === dateFilter
                          ? "bg-emerald-50 text-emerald-700"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {opt === "any"
                        ? "Any time"
                        : opt.replace(/([A-Z])/g, " $1").toLowerCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-600">
                <th className="w-[70px] px-4 py-3 font-medium">S/N</th>
                <th className="px-4 py-3 font-medium">Campaign Name</th>
                <th className="px-4 py-3 font-medium">Start Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white text-sm">
              {items.map((c, idx) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">
                    {(pageSafe - 1) * PAGE_SIZE + idx + 1}.
                  </td>
                  <td className="px-4 py-3 text-gray-900">{c.name}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {formatDate(c.startDate)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 text-gray-500">
                      <button className="hover:text-gray-700" aria-label="View">
                        <FaEye className="h-5 w-5" />
                      </button>

                      <Link
                        to={`/dashboard/campaigninformation/${c.id}`}
                        className="hover:text-gray-700"
                        aria-label="Edit"
                      >
                        <FaEdit className="h-5 w-5" />
                      </Link>

                      <button
                        className="hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => openDeleteModal(c)}
                        disabled={deleteLoading === c.id}
                        aria-label="Delete"
                      >
                        {deleteLoading === c.id ? (
                          <span className="text-sm">Deleting...</span>
                        ) : (
                          <FaTrash className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    {campaigns.length === 0
                      ? "No campaigns found."
                      : "No campaigns match your filters."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        open={deleteModalOpen}
        campaignName={campaignToDelete?.name || ""}
        loading={deleteLoading === campaignToDelete?.id}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />

      {/* Success Modal */}
      <SuccessModal
        open={successModalOpen}
        campaignName={deletedCampaignName}
        onClose={closeSuccessModal}
      />
    </>
  );
};

export default CampaignsTable;