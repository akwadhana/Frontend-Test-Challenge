import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

function ConfirmModal({
  open,
  title,
  message,
  cancelText = "Cancel",
  confirmText = "Delete Campaign",
  confirming = false,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  message: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  confirming?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  React.useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !confirming) onCancel();
    };
    if (open) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onCancel, confirming]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40"
        onClick={() => {
          if (!confirming) onCancel();
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-xl ring-1 ring-black/5 min-h-[280px] flex flex-col"
      >
        <div className="p-6 flex-1 flex flex-col justify-center">
          <h3 className="text-lg font-semibold text-gray-900 text-center">
            {title}
          </h3>
          <div className="my-4 border-t border-gray-100" />
          <div className="text-sm text-gray-600 flex-1 flex items-center justify-center">
            {message}
          </div>
        </div>
        <div className="border-t border-gray-100 px-6 py-4 flex justify-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={confirming}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-60"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={confirming}
            className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-400"
          >
            {confirming ? "Stopping..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// Activation confirmation modal
function ActivateConfirmModal({
  open,
  title,
  message,
  cancelText = "Cancel",
  confirmText = "Activate Campaign",
  confirming = false,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  message: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  confirming?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  React.useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !confirming) onCancel();
    };
    if (open) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onCancel, confirming]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40"
        onClick={() => {
          if (!confirming) onCancel();
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-xl ring-1 ring-black/5 min-h-[280px] flex flex-col"
      >
        <div className="p-6 flex-1 flex flex-col justify-center">
          <h3 className="text-lg font-semibold text-gray-900 text-center">
            {title}
          </h3>
          <div className="my-4 border-t border-gray-100" />
          <div className="text-sm text-gray-600 flex-1 flex items-center justify-center">
            {message}
          </div>
        </div>
        <div className="border-t border-gray-100 px-6 py-4 flex justify-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={confirming}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-60"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={confirming}
            className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:bg-gray-400"
          >
            {confirming ? "Activating..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeletedModal({
  open,
  name,
  onBack,
}: {
  open: boolean;
  name?: string;
  onBack: () => void;
}) {
  React.useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onBack();
    };
    if (open) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onBack]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40" onClick={onBack} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-xl ring-1 ring-black/5 min-h-[280px] flex flex-col justify-center">
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Campaign Deleted
          </h3>
          <div className="my-4 border-t border-gray-100" />
          <p className="text-sm text-gray-600">
            {name || "This"} campaign has been deleted
          </p>
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex justify-center rounded-md bg-teal-700 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
            >
              Go Back to campaign list
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CampaignInformation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [showStopModal, setShowStopModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showDeletedModal, setShowDeletedModal] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) {
        setApiError("No campaign ID provided");
        setLoading(false);
        return;
      }

      setLoading(true);
      setApiError(null);

      try {
        const response = await api.get(`/api/campaign/${id}`);
        if (!response.data) throw new Error("No data in response");
        setCampaign(response.data);
        setForm(response.data);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to load campaign data";
        setApiError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  const updateField = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleStop = () => {
    setShowStopModal(true);
  };

  const handleActivate = () => {
    setShowActivateModal(true);
  };

  const confirmStopCampaign = async () => {
    setSaving(true);
    setApiError(null);

    try {
      const payload = {
        id: parseInt(id || "0"),
        campaignStatus: false,
      };

      await api.put(`/api/campaignStatus/${id}`, payload);

      if (form) {
        const updated = {
          ...form,
          campaignStatus: "INACTIVE",
          CampaignStatus: "INACTIVE",
        };
        setCampaign(updated);
        setForm(updated);
      }

      setShowStopModal(false);
      setSuccessMessage(null);
      setShowDeletedModal(true);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to stop campaign";
      setApiError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const confirmActivateCampaign = async () => {
    setSaving(true);
    setApiError(null);

    try {
      const payload = {
        id: parseInt(id || "0"),
        campaignStatus: true,
      };

      await api.put(`/api/campaignStatus/${id}`, payload);

      if (form) {
        const updated = {
          ...form,
          campaignStatus: "ACTIVE",
          CampaignStatus: "ACTIVE",
        };
        setCampaign(updated);
        setForm(updated);
      }

      setShowActivateModal(false);
      setSuccessMessage("Campaign activated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to activate campaign";
      setApiError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = () => {
    setSaving(true);
    setApiError(null);
    setSuccessMessage(null);

    try {
      setCampaign(form);
      setIsEditing(false);
      setSuccessMessage("Campaign changes saved locally!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      setApiError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <p className="text-center py-10 text-gray-500">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <div className="text-center py-10">
            <p className="text-red-500 mb-4">{apiError}</p>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!campaign || !form) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <p className="text-center py-10 text-red-500">Campaign not found</p>
        </div>
      </div>
    );
  }

  const disabled = !isEditing;
  const isActive = (form.campaignStatus || form.CampaignStatus) === "ACTIVE";

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
        >
          <span aria-hidden>←</span> Back
        </button>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Campaign Information
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Campaign ID: {form.id || form.Id}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Campaign Status</span>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
                isActive
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                  : "bg-red-50 text-red-700 ring-red-600/20"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {apiError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">{apiError}</p>
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-700 text-sm">{successMessage}</p>
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Campaign Name
            </label>
            <input
              type="text"
              value={form.CampaignName || form.campaignName || ""}
              onChange={(e) => updateField("CampaignName", e.target.value)}
              disabled={disabled}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500 disabled:bg-gray-50 disabled:text-gray-600"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                value={(form.StartDate || form.startDate)?.split("T")[0] || ""}
                onChange={(e) => updateField("StartDate", e.target.value)}
                disabled={disabled}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500 disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                value={(form.EndDate || form.endDate)?.split("T")[0] || ""}
                onChange={(e) => updateField("EndDate", e.target.value)}
                disabled={disabled}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500 disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Linked Keywords
            </label>
            <div className="mt-1 rounded-md border border-gray-300 p-2">
              <div className="flex flex-wrap gap-2">
                {(form.LinkedKeywords || form.linkedKeywords || []).map(
                  (keyword: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700"
                    >
                      {keyword}
                      {!disabled && (
                        <button
                          type="button"
                          onClick={() => {
                            const currentKeywords =
                              form.LinkedKeywords || form.linkedKeywords || [];
                            const updated = currentKeywords.filter(
                              (_: string, i: number) => i !== index
                            );
                            updateField("LinkedKeywords", updated);
                          }}
                          className="hover:text-emerald-900"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  )
                )}
                {!disabled && (
                  <input
                    type="text"
                    placeholder="Type a keyword and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const input = e.currentTarget;
                        const newKeyword = input.value.trim();
                        if (newKeyword) {
                          const currentKeywords =
                            form.LinkedKeywords || form.linkedKeywords || [];
                          const updated = [...currentKeywords, newKeyword];
                          updateField("LinkedKeywords", updated);
                          input.value = "";
                        }
                      }
                    }}
                    className=" flex-1 border-0 px-1 py-1 text-sm placeholder-gray-400 focus:ring-0"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Daily Digest
              </label>
              <select
                value={form.DailyDigest ? "true" : "false"}
                onChange={(e) =>
                  updateField("DailyDigest", e.target.value === "true")
                }
                disabled={disabled}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500 disabled:bg-gray-50 disabled:text-gray-600"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Digest Campaign
              </label>
              <select
                value={form.DigestCampaign ? "true" : "false"}
                onChange={(e) =>
                  updateField("DigestCampaign", e.target.value === "true")
                }
                disabled={disabled}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500 disabled:bg-gray-50 disabled:text-gray-600"
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {isActive ? (
              <button
                type="button"
                onClick={handleStop}
                disabled={saving}
                className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-400"
              >
                Stop Campaign
              </button>
            ) : (
              <button
                type="button"
                onClick={handleActivate}
                disabled={saving}
                className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:bg-gray-400"
              >
                Activate Campaign
              </button>
            )}

            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Edit Information
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setForm(campaign);
                    setIsEditing(false);
                    setApiError(null);
                  }}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:bg-gray-400"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        open={showStopModal}
        title="Stop Campaign"
        message={
          <div className="text-center">
            <p>
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {form.CampaignName || form.campaignName || "this"}
              </span>{" "}
              campaign?
            </p>
            <p className="mt-1 text-gray-500">This action cannot be undone.</p>
          </div>
        }
        cancelText="Cancel"
        confirmText="Delete Campaign"
        confirming={saving}
        onCancel={() => setShowStopModal(false)}
        onConfirm={confirmStopCampaign}
      />

      <ActivateConfirmModal
        open={showActivateModal}
        title="Activate Campaign"
        message={
          <div className="text-center">
            <p>
              Are you sure you want to activate{" "}
              <span className="font-semibold">
                {form.CampaignName || form.campaignName || "this"}
              </span>{" "}
              campaign?
            </p>
            <p className="mt-1 text-gray-500">
              This will make the campaign active and start processing.
            </p>
          </div>
        }
        cancelText="Cancel"
        confirmText="Activate Campaign"
        confirming={saving}
        onCancel={() => setShowActivateModal(false)}
        onConfirm={confirmActivateCampaign}
      />

      <DeletedModal
        open={showDeletedModal}
        name={form.CampaignName || form.campaignName}
        onBack={() => {
          navigate(-1);
        }}
      />
    </div>
  );
}