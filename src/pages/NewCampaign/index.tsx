import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import api from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";

interface CreateCampaignFormProps {
  onSubmit?: (form: any) => void | Promise<void>;
  onCancel?: () => void;
}

type FormState = {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  dailyDigest: boolean;
  keywords: string[];
  frequency: string;
};

const INITIAL: FormState = {
  name: "",
  description: "",
  startDate: "",
  endDate: "",
  dailyDigest: false,
  keywords: [],
  frequency: "daily",
};

export default function CreateCampaignForm({
  onSubmit,
  onCancel,
}: CreateCampaignFormProps) {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [keywordInput, setKeywordInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const update =
    (field: keyof FormState) =>
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleAddKeyword = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const k = keywordInput.trim();
      if (k && !form.keywords.includes(k)) {
        setForm((f) => ({ ...f, keywords: [...f.keywords, k] }));
      }
      setKeywordInput("");
    }
  };

  const handleBackspaceToRemove = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !keywordInput && form.keywords.length) {
      e.preventDefault();
      setForm((f) => ({ ...f, keywords: f.keywords.slice(0, -1) }));
    }
  };

  const removeKeyword = (k: string) =>
    setForm((f) => ({ ...f, keywords: f.keywords.filter((x) => x !== k) }));

  const toggleDigest = () =>
    setForm((f) => ({ ...f, dailyDigest: !f.dailyDigest }));

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Campaign name is required.";
    if (!form.description.trim())
      errs.description = "Campaign description is required.";
    if (!form.startDate) errs.startDate = "Start date is required.";
    if (!form.endDate) errs.endDate = "End date is required.";
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      errs.endDate = "End date cannot be before start date.";
    }
    if (form.dailyDigest && !form.frequency) {
      errs.frequency = "Frequency is required when daily digest is enabled.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const transformFormToApi = (formData: FormState) => {
    const startDate = formData.startDate
      ? new Date(`${formData.startDate}T00:00:00`).toISOString()
      : "";
    const endDate = formData.endDate
      ? new Date(`${formData.endDate}T23:59:59`).toISOString()
      : "";

    return {
      campaignName: formData.name,
      CampaignDescription: formData.description,
      startDate,
      endDate,
      digestCampaign: formData.dailyDigest,
      linkedKeywords: formData.keywords,
      dailyDigest: formData.dailyDigest ? formData.frequency : "",
    };
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    try {
      setIsSubmitting(true);

      const apiData = transformFormToApi(form);

      await api.post("/api/campaign", apiData);

      await onSubmit?.(form);
      setShowSuccess(true);
    } catch (err: any) {
      if (err?.response?.data?.errors) {
        const backendErrors = err.response.data.errors;
        const formattedErrors: Record<string, string> = {};

        if (backendErrors.CampaignDescription)
          formattedErrors.description = backendErrors.CampaignDescription[0];
        if (backendErrors.campaignName)
          formattedErrors.name = backendErrors.campaignName[0];
        if (backendErrors.startDate)
          formattedErrors.startDate = backendErrors.startDate[0];
        if (backendErrors.endDate)
          formattedErrors.endDate = backendErrors.endDate[0];

        setErrors(formattedErrors);
      }

      const msg =
        err?.response?.data?.title ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create campaign. Please try again.";
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setForm(INITIAL);
    if (onCancel) onCancel();
    else navigate("/campaigns");
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e as any).key === "Escape") setShowSuccess(false);
    };
    if (showSuccess) window.addEventListener("keydown", onKey as any);
    return () => window.removeEventListener("keydown", onKey as any);
  }, [showSuccess]);

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
        <h1 className="text-lg font-semibold text-gray-900">
          Create New Campaign
        </h1>

        <form onSubmit={submit} className="mt-6 space-y-6">
          <div>
            <label className="block text-sm font-medium  text-gray-700">
              Campaign Name<span className="text-red-500"> *</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={update("name")}
              placeholder="e.g. The Future is now"
              className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 text-sm focus:border-emerald-600 focus:ring-emerald-600"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Campaign Description<span className="text-red-500"> *</span>
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={update("description")}
              placeholder="Please add a description to your campaign"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-600 focus:ring-emerald-600"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date<span className="text-red-500"> *</span>
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={update("startDate")}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-600 focus:ring-emerald-600"
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date<span className="text-red-500"> *</span>
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={update("endDate")}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-600 focus:ring-emerald-600"
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Want to receive daily digest about the campaign?
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={form.dailyDigest}
              onClick={toggleDigest}
              className={`${
                form.dailyDigest ? "bg-emerald-700" : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
            >
              <span
                className={`${
                  form.dailyDigest ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Linked Keywords
            </label>
            <div className="mt-1 rounded-md border border-gray-300 p-2">
              <div className="flex flex-wrap gap-2">
                {form.keywords.map((k) => (
                  <span
                    key={k}
                    className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700"
                  >
                    {k}
                    <button
                      type="button"
                      onClick={() => removeKeyword(k)}
                      className="text-emerald-700/70 hover:text-emerald-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) => {
                    handleAddKeyword(e);
                    handleBackspaceToRemove(e);
                  }}
                  placeholder="Type keyword and press Enter"
                  className="flex-1  border-0 px-1 py-1 text-sm focus:ring-0"
                />
              </div>
            </div>
          </div>

          {form.dailyDigest && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Kindly select how often you want to receive daily digest
                <span className="text-red-500"> *</span>
              </label>
              <select
                value={form.frequency}
                onChange={update("frequency")}
                className="mt-1 block w-56 rounded-md border-gray-300 bg-white px-3 py-2 text-sm focus:border-emerald-600 focus:ring-emerald-600"
              >
                <option value="daily">Daily</option>
                <option value="every-3-days">Every 3 days</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              {errors.frequency && (
                <p className="mt-1 text-sm text-red-600">{errors.frequency}</p>
              )}
            </div>
          )}

          {serverError && <p className="text-sm text-red-600">{serverError}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-800 disabled:opacity-60"
            >
              {isSubmitting ? "Creating..." : "Create Campaign"}
            </button>
          </div>
        </form>
      </div>

      {showSuccess && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          onClick={handleSuccessClose}
        >
          <div
            className="rounded-1xl bg-white p-10 text-center shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-700">
              <svg
                viewBox="0 0 24 24"
                className="h-10 w-10 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  d="M20 6L9 17l-5-5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-800">
              Campaign Successfully Created!
            </p>
            <Link
              to={`/dashboard/campaign`}
              className="mt-6 inline-flex w-64 justify-center rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-800 text-center"
            >
              Go Back to Campaign List
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
