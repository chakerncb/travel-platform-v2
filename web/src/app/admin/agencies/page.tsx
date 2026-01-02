"use client";
import { useEffect, useState } from "react";
import { travelAgencyService } from "@/src/services/travelAgencyService";
import { TravelAgencyDto, CreateTravelAgencyDto, UpdateTravelAgencyDto } from "@/src/types/api";
import { toast } from "react-hot-toast";

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<TravelAgencyDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState<TravelAgencyDto | null>(null);
  const [formData, setFormData] = useState<CreateTravelAgencyDto>({
    agencyName: "",
    businessLicense: "",
    description: "",
    logoUrl: "",
    websiteUrl: "",
    address: "",
    city: "",
    stateProvince: "",
    country: "",
    phone: "",
    commissionRate: 0
  });

  useEffect(() => {
    loadAgencies();
  }, []);

  const loadAgencies = async () => {
    try {
      setLoading(true);
      const data = await travelAgencyService.getAllAdmin();
      setAgencies(data);
    } catch (error) {
      toast.error("Failed to load agencies");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVerification = async (id: string, currentStatus: boolean) => {
    try {
      if (!currentStatus) {
        await travelAgencyService.verifyAdmin(id);
        toast.success("Agency verified successfully");
        loadAgencies();
      } else {
        toast.info("Agency already verified");
      }
    } catch (error) {
      toast.error("Failed to update verification status");
      console.error(error);
    }
  };

  const handleEdit = (agency: TravelAgencyDto) => {
    setSelectedAgency(agency);
    setFormData({
      agencyName: agency.agencyName,
      businessLicense: agency.businessLicense || "",
      description: agency.description || "",
      logoUrl: agency.logoUrl || "",
      websiteUrl: agency.websiteUrl || "",
      address: agency.address || "",
      city: agency.city || "",
      stateProvince: agency.stateProvince || "",
      country: agency.country || "",
      phone: agency.phone || "",
      commissionRate: agency.commissionRate || 0
    });
    setShowEditModal(true);
  };

  const handleCreate = () => {
    setFormData({
      agencyName: "",
      businessLicense: "",
      description: "",
      logoUrl: "",
      websiteUrl: "",
      address: "",
      city: "",
      stateProvince: "",
      country: "",
      phone: "",
      commissionRate: 0
    });
    setShowCreateModal(true);
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userId = "placeholder-user-id";
      await travelAgencyService.createAdmin(userId, formData);
      toast.success("Agency created successfully");
      setShowCreateModal(false);
      loadAgencies();
    } catch (error) {
      toast.error("Failed to create agency");
      console.error(error);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgency) return;

    try {
      await travelAgencyService.updateAdmin(selectedAgency.agencyId, formData as UpdateTravelAgencyDto);
      toast.success("Agency updated successfully");
      setShowEditModal(false);
      setSelectedAgency(null);
      loadAgencies();
    } catch (error) {
      toast.error("Failed to update agency");
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this agency?")) return;

    try {
      await travelAgencyService.deleteAdmin(id);
      toast.success("Agency deleted successfully");
      loadAgencies();
    } catch (error) {
      toast.error("Failed to delete agency");
      console.error(error);
    }
  };

  const filteredAgencies = agencies.filter(
    (agency) =>
      agency.agencyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Travel Agencies
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage travel agencies and their verification status
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-2 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search agencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Agency
            </button>
            <button
              onClick={loadAgencies}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-y border-gray-100 dark:border-gray-800">
                <th className="py-3 px-4">
                  <div className="flex items-center">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Agency
                    </p>
                  </div>
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Contact
                    </p>
                  </div>
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Location
                    </p>
                  </div>
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Rating
                    </p>
                  </div>
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Status
                    </p>
                  </div>
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Actions
                    </p>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center">
                    <div className="flex justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredAgencies.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No agencies found
                  </td>
                </tr>
              ) : (
                filteredAgencies.map((agency) => (
                  <tr key={agency.agencyId}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {agency.logoUrl && (
                          <div className="h-12 w-12 overflow-hidden rounded-lg">
                            <img
                              src={agency.logoUrl}
                              alt={agency.agencyName}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                            {agency.agencyName}
                          </p>
                          {agency.businessLicense && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              License: {agency.businessLicense}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        {agency.websiteUrl && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                            {agency.websiteUrl}
                          </p>
                        )}
                        {agency.phone && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {agency.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {agency.city || "N/A"}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {agency.rating.toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        {agency.isVerified ? (
                          <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600 dark:bg-green-500/15 dark:text-green-500">
                            Verified
                          </span>
                        ) : (
                          <span className="rounded-full bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-500">
                            Unverified
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(agency)}
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-600/10"
                          title="Edit agency"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() =>
                            handleToggleVerification(agency.agencyId, agency.isVerified)
                          }
                          className="rounded-lg p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-600/10"
                          title={agency.isVerified ? "Verified" : "Verify agency"}
                          disabled={agency.isVerified}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(agency.agencyId)}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-600/10"
                          title="Delete agency"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Create New Agency
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmitCreate} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Agency Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.agencyName}
                    onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Business License *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.businessLicense}
                    onChange={(e) => setFormData({ ...formData, businessLicense: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Logo URL
                  </label>
                  <input
                    type="url"
                    value={formData.logoUrl}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    State/Province
                  </label>
                  <input
                    type="text"
                    value={formData.stateProvince}
                    onChange={(e) => setFormData({ ...formData, stateProvince: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Commission Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.commissionRate}
                    onChange={(e) => setFormData({ ...formData, commissionRate: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Create Agency
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedAgency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Edit Agency
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedAgency(null);
                }}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmitEdit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Agency Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.agencyName}
                    onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Business License *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.businessLicense}
                    onChange={(e) => setFormData({ ...formData, businessLicense: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Logo URL
                  </label>
                  <input
                    type="url"
                    value={formData.logoUrl}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    State/Province
                  </label>
                  <input
                    type="text"
                    value={formData.stateProvince}
                    onChange={(e) => setFormData({ ...formData, stateProvince: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Commission Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.commissionRate}
                    onChange={(e) => setFormData({ ...formData, commissionRate: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedAgency(null);
                  }}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Update Agency
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
