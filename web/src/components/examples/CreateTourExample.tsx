import { useState } from 'react';
import { useMutation } from '@/src/hooks/useApi';
import { tourService } from '@/src/services';
import { CreateTourRequestDto } from '@/src/types/api';
import { useToastNotifications } from '@/src/util/useToastNotifications';

export default function CreateTourExample() {
  const { showSuccess, showError } = useToastNotifications();
  const [formData, setFormData] = useState<Partial<CreateTourRequestDto>>({
    title: '',
    slug: '',
    description: '',
    pricePerPerson: 0,
    durationDays: 1,
    durationNights: 0,
    minParticipants: 1,
    maxParticipants: 10,
  });

  const { mutate: createTour, loading, error } = useMutation(
    tourService.create,
    {
      onSuccess: (data) => {
        showSuccess('Tour created successfully!');
        console.log('Created tour:', data);
        // Reset form or redirect
        setFormData({
          title: '',
          slug: '',
          description: '',
          pricePerPerson: 0,
          durationDays: 1,
          durationNights: 0,
          minParticipants: 1,
          maxParticipants: 10,
        });
      },
      onError: (error) => {
        showError(`Failed to create tour: ${error.message}`);
        console.error('Error creating tour:', error);
      }
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.slug) {
      showError('Title and slug are required');
      return;
    }

    await createTour(formData as CreateTourRequestDto);
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Create New Tour</h2>
      
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label htmlFor="title" className="form-label">Tour Title *</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="slug" className="form-label">Slug *</label>
          <input
            type="text"
            className="form-control"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            required
            placeholder="tour-title-slug"
          />
        </div>

        <div className="col-12">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="pricePerPerson" className="form-label">Price Per Person</label>
          <input
            type="number"
            className="form-control"
            id="pricePerPerson"
            name="pricePerPerson"
            value={formData.pricePerPerson}
            onChange={handleInputChange}
            min="0"
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="durationDays" className="form-label">Duration (Days)</label>
          <input
            type="number"
            className="form-control"
            id="durationDays"
            name="durationDays"
            value={formData.durationDays}
            onChange={handleInputChange}
            min="1"
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="durationNights" className="form-label">Duration (Nights)</label>
          <input
            type="number"
            className="form-control"
            id="durationNights"
            name="durationNights"
            value={formData.durationNights}
            onChange={handleInputChange}
            min="0"
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="minParticipants" className="form-label">Min Participants</label>
          <input
            type="number"
            className="form-control"
            id="minParticipants"
            name="minParticipants"
            value={formData.minParticipants}
            onChange={handleInputChange}
            min="1"
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="maxParticipants" className="form-label">Max Participants</label>
          <input
            type="number"
            className="form-control"
            id="maxParticipants"
            name="maxParticipants"
            value={formData.maxParticipants}
            onChange={handleInputChange}
            min="1"
          />
        </div>

        {error && (
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
              {error.message}
            </div>
          </div>
        )}

        <div className="col-12">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creating...
              </>
            ) : (
              'Create Tour'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
