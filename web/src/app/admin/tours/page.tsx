"use client";
import { useEffect, useState } from "react";
import { tourService } from "@/src/services/tourService";
import { destinationService } from "@/src/services/destinationService";
import { TourDto, CreateTourRequestDto, UpdateTourRequestDto, TourType, TourStatus, DifficultyLevel, DestinationDto } from "@/src/types/api";
import { toast } from "react-hot-toast";

export default function ToursPage() {
  const [tours, setTours] = useState<TourDto[]>([]);
  const [destinations, setDestinations] = useState<DestinationDto[]>([]);
  const [selectedDestinationIds, setSelectedDestinationIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState<TourDto | null>(null);
  const [formData, setFormData] = useState<CreateTourRequestDto>({
    title: "",
    slug: "",
    description: "",
    tourType: undefined,
    primaryDestinationId: "",
    durationDays: undefined,
    durationNights: undefined,
    pricePerPerson: undefined,
    currency: "USD",
    minParticipants: 1,
    maxParticipants: 10,
    difficultyLevel: undefined,
    isFeatured: false
  });

  useEffect(() => {
    loadTours();
    loadDestinations();
  }, []);

  const loadTours = async () => {
    try {
      setLoading(true);
      const data = await tourService.getAllAdmin();
      setTours(data);
    } catch (error) {
      toast.error("Failed to load tours");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadDestinations = async () => {
    try {
      const data = await destinationService.getAll();
      setDestinations(data);
    } catch (error) {
      toast.error("Failed to load destinations");
      console.error(error);
    }
  };

  const handleEdit = async (tour: TourDto) => {
    setSelectedTour(tour);
    setFormData({
      title: tour.title,
      slug: tour.slug,
      description: tour.description || "",
      tourType: tour.tourType,
      primaryDestinationId: tour.primaryDestinationId || "",
      durationDays: tour.durationDays,
      durationNights: tour.durationNights,
      pricePerPerson: tour.pricePerPerson,
      currency: tour.currency || "USD",
      minParticipants: tour.minParticipants,
      maxParticipants: tour.maxParticipants,
      difficultyLevel: tour.difficultyLevel,
      coverImageUrl: tour.coverImageUrl || "",
      ageRestriction: tour.ageRestriction || "",
      fitnessRequirement: tour.fitnessRequirement || "",
      itinerary: tour.itinerary || "",
      isFeatured: tour.isFeatured
    });
    
    // Load tour destinations before showing the modal
    try {
      const tourDests = await tourService.getDestinations(tour.tourId);
      console.log("Loaded tour destinations:", tourDests); // Debug log
      setSelectedDestinationIds(tourDests.map((d: any) => d.destinationId || d.DestinationId));
    } catch (error) {
      console.error("Failed to load tour destinations:", error);
      setSelectedDestinationIds([]);
    }
    
    // Show modal after destinations are loaded
    setShowEditModal(true);
  };

  const handleCreate = () => {
    setFormData({
      title: "",
      slug: "",
      description: "",
      tourType: undefined,
      primaryDestinationId: "",
      durationDays: undefined,
      durationNights: undefined,
      pricePerPerson: undefined,
      currency: "USD",
      minParticipants: 1,
      maxParticipants: 10,
      difficultyLevel: undefined,
      isFeatured: false
    });
    setSelectedDestinationIds([]);
    setShowCreateModal(true);
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createData: any = {};
      
      if (formData.title) createData.title = formData.title;
      if (formData.slug) createData.slug = formData.slug;
      if (formData.description) createData.description = formData.description;
      if (formData.tourType) createData.tourType = formData.tourType;
      if (selectedDestinationIds.length > 0) createData.primaryDestinationId = selectedDestinationIds[0];
      if (formData.durationDays !== undefined && formData.durationDays !== null) createData.durationDays = formData.durationDays;
      if (formData.durationNights !== undefined && formData.durationNights !== null) createData.durationNights = formData.durationNights;
      if (formData.pricePerPerson !== undefined && formData.pricePerPerson !== null) createData.pricePerPerson = formData.pricePerPerson;
      if (formData.currency) createData.currency = formData.currency;
      if (formData.minParticipants !== undefined && formData.minParticipants !== null) createData.minParticipants = formData.minParticipants;
      if (formData.maxParticipants !== undefined && formData.maxParticipants !== null) createData.maxParticipants = formData.maxParticipants;
      if (formData.difficultyLevel) createData.difficultyLevel = formData.difficultyLevel;
      if (formData.coverImageUrl) createData.coverImageUrl = formData.coverImageUrl;
      if (formData.ageRestriction) createData.ageRestriction = formData.ageRestriction;
      if (formData.fitnessRequirement) createData.fitnessRequirement = formData.fitnessRequirement;
      if (formData.itinerary) createData.itinerary = formData.itinerary;
      if (formData.isFeatured !== undefined) createData.isFeatured = formData.isFeatured;
      
      // Add destinations in the same request
      if (selectedDestinationIds.length > 0) {
        createData.destinations = selectedDestinationIds.map((destId, index) => ({
          destinationId: destId,
          orderIndex: index + 1
        }));
      }
      
      const newTour = await tourService.create(createData);
      
      toast.success("Tour created successfully");
      setShowCreateModal(false);
      loadTours();
    } catch (error: any) {
      toast.error("Failed to create tour");
      console.error("Create error:", error);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTour) return;

    try {
      const updateData: any = {};
      
      if (formData.title) updateData.title = formData.title;
      if (formData.slug) updateData.slug = formData.slug;
      if (formData.description) updateData.description = formData.description;
      if (formData.tourType) updateData.tourType = formData.tourType;
      if (selectedDestinationIds.length > 0) updateData.primaryDestinationId = selectedDestinationIds[0];
      if (formData.durationDays !== undefined && formData.durationDays !== null) updateData.durationDays = formData.durationDays;
      if (formData.durationNights !== undefined && formData.durationNights !== null) updateData.durationNights = formData.durationNights;
      if (formData.pricePerPerson !== undefined && formData.pricePerPerson !== null) updateData.pricePerPerson = formData.pricePerPerson;
      if (formData.currency) updateData.currency = formData.currency;
      if (formData.minParticipants !== undefined && formData.minParticipants !== null) updateData.minParticipants = formData.minParticipants;
      if (formData.maxParticipants !== undefined && formData.maxParticipants !== null) updateData.maxParticipants = formData.maxParticipants;
      if (formData.difficultyLevel) updateData.difficultyLevel = formData.difficultyLevel;
      if (formData.coverImageUrl) updateData.coverImageUrl = formData.coverImageUrl;
      if (formData.ageRestriction) updateData.ageRestriction = formData.ageRestriction;
      if (formData.fitnessRequirement) updateData.fitnessRequirement = formData.fitnessRequirement;
      if (formData.itinerary) updateData.itinerary = formData.itinerary;
      if (formData.isFeatured !== undefined) updateData.isFeatured = formData.isFeatured;
      
      // Update destinations in the same request (replaces all existing destinations)
      if (selectedDestinationIds.length > 0) {
        updateData.destinations = selectedDestinationIds.map((destId, index) => ({
          destinationId: destId,
          orderIndex: index + 1
        }));
      } else {
        // If no destinations selected, send empty array to clear all
        updateData.destinations = [];
      }
      
      await tourService.updateAdmin(selectedTour.tourId, updateData);
      
      toast.success("Tour updated successfully");
      setShowEditModal(false);
      setSelectedTour(null);
      loadTours();
    } catch (error: any) {
      toast.error("Failed to update tour");
      console.error("Update error:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tour?")) return;

    try {
      await tourService.deleteAdmin(id);
      toast.success("Tour deleted successfully");
      loadTours();
    } catch (error) {
      toast.error("Failed to delete tour");
      console.error(error);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await tourService.publish(id);
      toast.success("Tour published successfully");
      loadTours();
    } catch (error) {
      toast.error("Failed to publish tour");
      console.error(error);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await tourService.archive(id);
      toast.success("Tour archived successfully");
      loadTours();
    } catch (error) {
      toast.error("Failed to archive tour");
      console.error(error);
    }
  };

  const filteredTours = tours.filter((tour) => {
    const matchesSearch = 
      tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.primaryDestinationName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || tour.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: TourStatus) => {
    const badges = {
      [TourStatus.Draft]: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
      [TourStatus.PendingApproval]: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500",
      [TourStatus.Published]: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500",
      [TourStatus.Archived]: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-500"
    };
    return badges[status] || badges[TourStatus.Draft];
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-6 shadow-xl">
        <h1 className="text-2xl font-bold text-white">
          Tours Management
        </h1>
        <p className="mt-1 text-sm text-white/80">
          Manage tour packages and itineraries
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 shadow-xl">
        <div className="flex flex-col gap-2 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search tours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-700 bg-gray-800 pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            >
              <option value="all">All Status</option>
              <option value={TourStatus.Draft}>Draft</option>
              <option value={TourStatus.PendingApproval}>Pending Approval</option>
              <option value={TourStatus.Published}>Published</option>
              <option value={TourStatus.Archived}>Archived</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-2.5 text-sm font-semibold text-white hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/50 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Tour
            </button>
            <button
              onClick={loadTours}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-700 bg-transparent px-5 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-800/50">
                <th className="py-3 px-4 text-left">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Title</p>
                </th>
                <th className="py-3 px-4 text-left">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Destination</p>
                </th>
                <th className="py-3 px-4 text-left">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Duration</p>
                </th>
                <th className="py-3 px-4 text-left">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Price</p>
                </th>
                <th className="py-3 px-4 text-left">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Status</p>
                </th>
                <th className="py-3 px-4 text-right">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Actions</p>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-700 border-t-purple-600"></div>
                      <p className="text-sm text-gray-400">Loading tours...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredTours.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <svg className="h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-400">No tours found</p>
                        <button onClick={handleCreate} className="mt-2 text-sm text-purple-400 hover:text-purple-300">
                          Create your first tour
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTours.map((tour) => (
                  <tr key={tour.tourId} className="hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {tour.coverImageUrl && (
                          <div className="h-12 w-12 overflow-hidden rounded-lg ring-2 ring-gray-700">
                            <img src={tour.coverImageUrl} alt={tour.title} className="h-full w-full object-cover" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-white">{tour.title}</p>
                          {tour.isFeatured && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-400">
                              <span className="text-yellow-500">Featured</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-300">
                        {tour.primaryDestinationName || "N/A"}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-300">
                        {tour.durationDays && tour.durationNights
                          ? `${tour.durationDays}D/${tour.durationNights}N`
                          : "N/A"}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm font-medium text-white">
                        {tour.pricePerPerson ? `${tour.currency} ${tour.pricePerPerson}` : "N/A"}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                        tour.status === TourStatus.Published
                          ? 'bg-green-500/10 text-green-400 ring-1 ring-green-500/20'
                          : tour.status === TourStatus.Draft
                          ? 'bg-gray-500/10 text-gray-400 ring-1 ring-gray-500/20'
                          : tour.status === TourStatus.PendingApproval
                          ? 'bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/20'
                          : 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20'
                      }`}>
                        {tour.status === TourStatus.Published && <span className="h-1.5 w-1.5 rounded-full bg-green-400" />}
                        {tour.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        {tour.status === TourStatus.Draft && (
                          <button
                            onClick={() => handlePublish(tour.tourId)}
                            className="rounded-lg p-2 text-green-400 hover:bg-green-500/10 transition-colors"
                            title="Publish tour"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        )}
                        {tour.status === TourStatus.Published && (
                          <button
                            onClick={() => handleArchive(tour.tourId)}
                            className="rounded-lg p-2 text-orange-400 hover:bg-orange-500/10 transition-colors"
                            title="Archive tour"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(tour)}
                          className="rounded-lg p-2 text-blue-400 hover:bg-blue-500/10 transition-colors"
                          title="Edit tour"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(tour.tourId)}
                          className="rounded-lg p-2 text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete tour"
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
              <h2 className="text-xl font-bold text-white">Create New Tour</h2>
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tour Type</label>
                  <select
                    title="Tour Type"
                    value={formData.tourType || ""}
                    onChange={(e) => setFormData({ ...formData, tourType: e.target.value ? e.target.value as TourType : undefined })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  >
                    <option value="">Select Type</option>
                    <option value={TourType.PrePackaged}>Pre-Packaged</option>
                    <option value={TourType.CustomRequest}>Custom Request</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty Level</label>
                  <select
                    title="Difficulty Level"
                    value={formData.difficultyLevel || ""}
                    onChange={(e) => setFormData({ ...formData, difficultyLevel: e.target.value ? e.target.value as DifficultyLevel : undefined })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  >
                    <option value="">Select Difficulty</option>
                    <option value={DifficultyLevel.Easy}>Easy</option>
                    <option value={DifficultyLevel.Moderate}>Moderate</option>
                    <option value={DifficultyLevel.Challenging}>Challenging</option>
                    <option value={DifficultyLevel.Difficult}>Difficult</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Destinations</label>
                  <div className="max-h-48 overflow-y-auto rounded-xl border border-gray-700 bg-gray-800 p-3">
                    {destinations.length === 0 ? (
                      <p className="text-sm text-gray-400">No destinations available</p>
                    ) : (
                      <div className="space-y-2">
                        {destinations.map((dest) => (
                          <label key={dest.destinationId} className="flex items-center gap-2 cursor-pointer hover:bg-gray-700/50 p-2 rounded">
                            <input
                              type="checkbox"
                              checked={selectedDestinationIds.includes(dest.destinationId)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedDestinationIds([...selectedDestinationIds, dest.destinationId]);
                                } else {
                                  setSelectedDestinationIds(selectedDestinationIds.filter(id => id !== dest.destinationId));
                                }
                              }}
                              className="h-5 w-5 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0"
                            />
                            <span className="text-sm text-gray-300">
                              {dest.name} - {dest.country}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    Selected: {selectedDestinationIds.length} destination(s)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.durationDays || ""}
                    onChange={(e) => setFormData({ ...formData, durationDays: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Duration (Nights)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.durationNights || ""}
                    onChange={(e) => setFormData({ ...formData, durationNights: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price Per Person</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.pricePerPerson || ""}
                    onChange={(e) => setFormData({ ...formData, pricePerPerson: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
                  <input
                    type="text"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Min Participants</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.minParticipants}
                    onChange={(e) => setFormData({ ...formData, minParticipants: parseInt(e.target.value) })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Participants</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Cover Image URL</label>
                  <input
                    type="url"
                    value={formData.coverImageUrl}
                    onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
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
                    <span className="text-sm font-medium text-gray-300">Mark as Featured Tour</span>
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
                  Create Tour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedTour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-800 bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Edit Tour</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedTour(null);
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tour Type</label>
                  <select
                    title="Tour Type"
                    value={formData.tourType || ""}
                    onChange={(e) => setFormData({ ...formData, tourType: e.target.value ? e.target.value as TourType : undefined })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">Select Type</option>
                    <option value={TourType.PrePackaged}>Pre-Packaged</option>
                    <option value={TourType.CustomRequest}>Custom Request</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty Level</label>
                  <select
                    title="Difficulty Level"
                    value={formData.difficultyLevel || ""}
                    onChange={(e) => setFormData({ ...formData, difficultyLevel: e.target.value ? e.target.value as DifficultyLevel : undefined })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">Select Difficulty</option>
                    <option value={DifficultyLevel.Easy}>Easy</option>
                    <option value={DifficultyLevel.Moderate}>Moderate</option>
                    <option value={DifficultyLevel.Challenging}>Challenging</option>
                    <option value={DifficultyLevel.Difficult}>Difficult</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Destinations</label>
                  <div className="max-h-48 overflow-y-auto rounded-xl border border-gray-700 bg-gray-800 p-3">
                    {destinations.length === 0 ? (
                      <p className="text-sm text-gray-400">No destinations available</p>
                    ) : (
                      <div className="space-y-2">
                        {destinations.map((dest) => (
                          <label key={dest.destinationId} className="flex items-center gap-2 cursor-pointer hover:bg-gray-700/50 p-2 rounded">
                            <input
                              type="checkbox"
                              checked={selectedDestinationIds.includes(dest.destinationId)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedDestinationIds([...selectedDestinationIds, dest.destinationId]);
                                } else {
                                  setSelectedDestinationIds(selectedDestinationIds.filter(id => id !== dest.destinationId));
                                }
                              }}
                              className="h-5 w-5 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                            />
                            <span className="text-sm text-gray-300">
                              {dest.name} - {dest.country}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    Selected: {selectedDestinationIds.length} destination(s)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.durationDays || ""}
                    onChange={(e) => setFormData({ ...formData, durationDays: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Duration (Nights)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.durationNights || ""}
                    onChange={(e) => setFormData({ ...formData, durationNights: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price Per Person</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.pricePerPerson || ""}
                    onChange={(e) => setFormData({ ...formData, pricePerPerson: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
                  <input
                    type="text"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Min Participants</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.minParticipants}
                    onChange={(e) => setFormData({ ...formData, minParticipants: parseInt(e.target.value) })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Participants</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Cover Image URL</label>
                  <input
                    type="url"
                    value={formData.coverImageUrl}
                    onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
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
                    <span className="text-sm font-medium text-gray-300">Mark as Featured Tour</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedTour(null);
                  }}
                  className="rounded-xl border border-gray-700 bg-gray-800 px-5 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-2.5 text-sm font-semibold text-white hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/50 transition-all"
                >
                  Update Tour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
