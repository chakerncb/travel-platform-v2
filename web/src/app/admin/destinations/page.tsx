"use client";
import { useEffect, useState } from "react";
import { destinationService } from "@/src/services/destinationService";
import { DestinationDto, CreateDestinationDto, UpdateDestinationDto, DestinationType } from "@/src/types/api";
import { toast } from "react-hot-toast";

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<DestinationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<DestinationDto | null>(null);
  const [formData, setFormData] = useState<CreateDestinationDto>({
    name: "",
    nameAr: "",
    nameFr: "",
    slug: "",
    destinationType: undefined,
    country: "",
    latitude: undefined,
    longitude: undefined,
    nearestAirportCode: "",
    airportDistanceKm: undefined,
    description: "",
    shortDescription: "",
    thumbnailUrl: "",
    coverImageUrl: "",
    metaTitle: "",
    metaDescription: "",
    isFeatured: false
  });

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    try {
      setLoading(true);
      const data = await destinationService.getAll();
      setDestinations(data);
    } catch (error) {
      toast.error("Failed to load destinations");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (destination: DestinationDto) => {
    setSelectedDestination(destination);
    setFormData({
      name: destination.name,
      nameAr: destination.nameAr || "",
      nameFr: destination.nameFr || "",
      slug: destination.slug,
      destinationType: destination.destinationType || undefined,
      country: destination.country || "",
      latitude: destination.latitude,
      longitude: destination.longitude,
      nearestAirportCode: destination.nearestAirportCode || "",
      airportDistanceKm: destination.airportDistanceKm,
      description: destination.description || "",
      shortDescription: destination.shortDescription || "",
      thumbnailUrl: destination.thumbnailUrl || "",
      coverImageUrl: destination.coverImageUrl || "",
      metaTitle: destination.metaTitle || "",
      metaDescription: destination.metaDescription || "",
      isFeatured: destination.isFeatured
    });
    setShowEditModal(true);
  };

  const handleCreate = () => {
    setFormData({
      name: "",
      nameAr: "",
      nameFr: "",
      slug: "",
      destinationType: undefined,
      country: "",
      latitude: undefined,
      longitude: undefined,
      nearestAirportCode: "",
      airportDistanceKm: undefined,
      description: "",
      shortDescription: "",
      thumbnailUrl: "",
      coverImageUrl: "",
      metaTitle: "",
      metaDescription: "",
      isFeatured: false
    });
    setShowCreateModal(true);
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Build create object - only include fields that have values
      const createData: any = {};
      
      if (formData.name) createData.name = formData.name;
      if (formData.nameAr) createData.nameAr = formData.nameAr;
      if (formData.nameFr) createData.nameFr = formData.nameFr;
      if (formData.slug) createData.slug = formData.slug;
      if (formData.destinationType) createData.destinationType = formData.destinationType;
      if (formData.country) createData.country = formData.country;
      if (formData.latitude !== undefined && formData.latitude !== null) createData.latitude = formData.latitude;
      if (formData.longitude !== undefined && formData.longitude !== null) createData.longitude = formData.longitude;
      if (formData.nearestAirportCode) createData.nearestAirportCode = formData.nearestAirportCode;
      if (formData.airportDistanceKm !== undefined && formData.airportDistanceKm !== null) createData.airportDistanceKm = formData.airportDistanceKm;
      if (formData.description) createData.description = formData.description;
      if (formData.shortDescription) createData.shortDescription = formData.shortDescription;
      if (formData.thumbnailUrl) createData.thumbnailUrl = formData.thumbnailUrl;
      if (formData.coverImageUrl) createData.coverImageUrl = formData.coverImageUrl;
      if (formData.metaTitle) createData.metaTitle = formData.metaTitle;
      if (formData.metaDescription) createData.metaDescription = formData.metaDescription;
      if (formData.isFeatured !== undefined) createData.isFeatured = formData.isFeatured;
      
      await destinationService.create(createData);
      toast.success("Destination created successfully");
      setShowCreateModal(false);
      loadDestinations();
    } catch (error: any) {
      toast.error("Failed to create destination");
      console.error("Create error:", error);
      console.error("Error response:", error.response?.data);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDestination) return;

    try {
      // Build update object - only include fields that have values
      const updateData: any = {};
      
      if (formData.name) updateData.name = formData.name;
      if (formData.nameAr) updateData.nameAr = formData.nameAr;
      if (formData.nameFr) updateData.nameFr = formData.nameFr;
      if (formData.slug) updateData.slug = formData.slug;
      if (formData.destinationType) updateData.destinationType = formData.destinationType;
      if (formData.country) updateData.country = formData.country;
      if (formData.latitude !== undefined && formData.latitude !== null) updateData.latitude = formData.latitude;
      if (formData.longitude !== undefined && formData.longitude !== null) updateData.longitude = formData.longitude;
      if (formData.nearestAirportCode) updateData.nearestAirportCode = formData.nearestAirportCode;
      if (formData.airportDistanceKm !== undefined && formData.airportDistanceKm !== null) updateData.airportDistanceKm = formData.airportDistanceKm;
      if (formData.description) updateData.description = formData.description;
      if (formData.shortDescription) updateData.shortDescription = formData.shortDescription;
      if (formData.thumbnailUrl) updateData.thumbnailUrl = formData.thumbnailUrl;
      if (formData.coverImageUrl) updateData.coverImageUrl = formData.coverImageUrl;
      if (formData.metaTitle) updateData.metaTitle = formData.metaTitle;
      if (formData.metaDescription) updateData.metaDescription = formData.metaDescription;
      if (formData.isFeatured !== undefined) updateData.isFeatured = formData.isFeatured;
      
      await destinationService.update(selectedDestination.destinationId, updateData);
      toast.success("Destination updated successfully");
      setShowEditModal(false);
      setSelectedDestination(null);
      loadDestinations();
    } catch (error: any) {
      toast.error("Failed to update destination");
      console.error("Update error:", error);
      console.error("Error response:", error.response?.data);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this destination?")) return;

    try {
      await destinationService.delete(id);
      toast.success("Destination deleted successfully");
      loadDestinations();
    } catch (error) {
      toast.error("Failed to delete destination");
      console.error(error);
    }
  };

  const filteredDestinations = destinations.filter(
    (dest) =>
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header with gradient background */}
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Destinations Management
        </h1>
        <p className="text-purple-100">
          Manage and organize all your travel destinations
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm shadow-xl">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between border-b border-gray-800">
          <div className="relative flex-1 max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-700 bg-gray-800 pl-10 pr-4 py-3 text-sm text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadDestinations}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-3 text-sm font-semibold text-white hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/50 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Destination
            </button>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Destination
                  </span>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Country
                  </span>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Type
                  </span>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Status
                  </span>
                </th>
                <th className="px-6 py-4 text-right">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Actions
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-700 border-t-purple-600"></div>
                      <p className="text-sm text-gray-400">Loading destinations...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredDestinations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <svg className="h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-sm font-medium text-gray-400">No destinations found</p>
                      <button onClick={handleCreate} className="mt-2 text-sm text-purple-400 hover:text-purple-300">
                        Create your first destination
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDestinations.map((destination) => (
                  <tr key={destination.destinationId} className="group hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {destination.thumbnailUrl && (
                          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg ring-2 ring-gray-700">
                            <img
                              src={destination.thumbnailUrl}
                              alt={destination.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-white">
                            {destination.name}
                          </p>
                          {destination.shortDescription && (
                            <p className="text-xs text-gray-400 line-clamp-1">
                              {destination.shortDescription}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-300">
                        {destination.country || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {destination.destinationType ? (
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-500/10 text-blue-400 ring-1 ring-inset ring-blue-500/20">
                          {destination.destinationType}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {destination.isActive ? (
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-500/10 text-green-400 ring-1 ring-inset ring-green-500/20">
                            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-400"></span>
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-500/10 text-gray-400 ring-1 ring-inset ring-gray-500/20">
                            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-gray-400"></span>
                            Inactive
                          </span>
                        )}
                        {destination.isFeatured && (
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-500/10 text-yellow-400 ring-1 ring-inset ring-yellow-500/20">
                            ⭐ Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(destination)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-blue-500/10 hover:text-blue-400 transition-colors"
                          title="Edit destination"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(destination.destinationId)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                          title="Delete destination"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-800 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">
                Create New Destination
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmitCreate} className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="e.g., Paris"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="e.g., paris"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="e.g., France"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Destination Type
                  </label>
                  <select
                    title="Destination Type"
                    value={formData.destinationType || ""}
                    onChange={(e) => setFormData({ ...formData, destinationType: e.target.value ? e.target.value as DestinationType : undefined })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  >
                    <option value="">Select Type</option>
                    <option value={DestinationType.City}>City</option>
                    <option value={DestinationType.Region}>Region</option>
                    <option value={DestinationType.NaturalSite}>Natural Site</option>
                    <option value={DestinationType.Landmark}>Landmark</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Short Description
                  </label>
                  <input
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="Brief description..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="Full description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Thumbnail URL
                  </label>
                  <input
                    type="url"
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.coverImageUrl}
                    onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude || ""}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="e.g., 48.8566"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude || ""}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="e.g., 2.3522"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nearest Airport Code
                  </label>
                  <input
                    type="text"
                    value={formData.nearestAirportCode}
                    onChange={(e) => setFormData({ ...formData, nearestAirportCode: e.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="e.g., CDG"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Airport Distance (km)
                  </label>
                  <input
                    type="number"
                    value={formData.airportDistanceKm || ""}
                    onChange={(e) => setFormData({ ...formData, airportDistanceKm: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="e.g., 25"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center gap-3 rounded-xl bg-gray-800/50 p-4 cursor-pointer hover:bg-gray-800 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="h-5 w-5 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0"
                    />
                    <span className="text-sm font-medium text-gray-300">
                      Mark as Featured Destination
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border border-gray-700 bg-gray-800 px-5 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2.5 text-sm font-semibold text-white hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/50 transition-all"
                >
                  Create Destination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedDestination && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-800 bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">
                Edit Destination
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedDestination(null);
                }}
                className="rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmitEdit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Destination Type
                  </label>
                  <select
                    title="Destination Type"
                    value={formData.destinationType || ""}
                    onChange={(e) => setFormData({ ...formData, destinationType: e.target.value ? e.target.value as DestinationType : undefined })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">Select Type</option>
                    <option value={DestinationType.City}>City</option>
                    <option value={DestinationType.Region}>Region</option>
                    <option value={DestinationType.NaturalSite}>Natural Site</option>
                    <option value={DestinationType.Landmark}>Landmark</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Short Description
                  </label>
                  <input
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Thumbnail URL
                  </label>
                  <input
                    type="url"
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.coverImageUrl}
                    onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude || ""}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude || ""}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nearest Airport Code
                  </label>
                  <input
                    type="text"
                    value={formData.nearestAirportCode}
                    onChange={(e) => setFormData({ ...formData, nearestAirportCode: e.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Airport Distance (km)
                  </label>
                  <input
                    type="number"
                    value={formData.airportDistanceKm || ""}
                    onChange={(e) => setFormData({ ...formData, airportDistanceKm: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center gap-3 rounded-xl bg-gray-800/50 p-4 cursor-pointer hover:bg-gray-800 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="h-5 w-5 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                    />
                    <span className="text-sm font-medium text-gray-300">
                      Mark as Featured Destination
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedDestination(null);
                  }}
                  className="rounded-xl border border-gray-700 bg-gray-800 px-5 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-2.5 text-sm font-semibold text-white hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/50 transition-all"
                >
                  Update Destination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
