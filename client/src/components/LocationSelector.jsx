import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function LocationSelector({ location, onChange }) {
  const [districts, setDistricts] = useState([]);
  const [subcounties, setSubcounties] = useState([]);
  const [parishes, setParishes] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiBase = import.meta.env.VITE_API_URL || '';

  // Fetch districts on mount
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${apiBase}/api/reference/districts`);
        const data = await res.json();
        if (data.success) {
          setDistricts(data.districts || []);
        }
      } catch (error) {
        console.error('Error fetching districts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
  }, [apiBase]);

  // Fetch subcounties when district changes
  useEffect(() => {
    if (location.district) {
      const fetchSubcounties = async (district) => {
        try {
          setLoading(true);
          const res = await fetch(`${apiBase}/api/reference/districts/${encodeURIComponent(district)}/subcounties`);
          const data = await res.json();
          if (data.success) {
            setSubcounties(data.subcounties || []);
          }
        } catch (error) {
          console.error('Error fetching subcounties:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchSubcounties(location.district);
    } else {
      setSubcounties([]);
      setParishes([]);
    }
  }, [location.district, apiBase]);

  // Fetch parishes when subcounty changes
  useEffect(() => {
    if (location.district && location.subcounty) {
      const fetchParishes = async (district, subcounty) => {
        try {
          setLoading(true);
          const res = await fetch(`${apiBase}/api/reference/districts/${encodeURIComponent(district)}/subcounties/${encodeURIComponent(subcounty)}/parishes`);
          const data = await res.json();
          if (data.success) {
            setParishes(data.parishes || []);
          }
        } catch (error) {
          console.error('Error fetching parishes:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchParishes(location.district, location.subcounty);
    } else {
      setParishes([]);
    }
  }, [location.district, location.subcounty, apiBase]);

  

  const handleDistrictChange = (e) => {
    const district = e.target.value;
    onChange({
      district,
      subcounty: '',
      parish: '',
      village: ''
    });
  };

  const handleSubcountyChange = (e) => {
    const subcounty = e.target.value;
    onChange({
      ...location,
      subcounty,
      parish: '',
      village: ''
    });
  };

  const handleParishChange = (e) => {
    const parish = e.target.value;
    onChange({
      ...location,
      parish,
      village: ''
    });
  };

  const handleVillageChange = (e) => {
    const village = e.target.value;
    onChange({
      ...location,
      village
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-ui-primary mb-4">📍 Location</h3>

      {/* District (Required) */}
      <div>
        <label htmlFor="district" className="block text-sm font-medium text-ui-muted mb-2">District <span className="text-red-500">*</span></label>
        <select
          id="district"
          value={location.district || ''}
          onChange={handleDistrictChange}
          required
          disabled={loading}
          className="w-full p-3 border border-ui rounded-lg focus-ring text-base min-h-[48px]"
        >
          <option value="">Select District</option>
          {districts.map((d) => (
            <option key={d._id || d.name} value={d.name}>
              {d.name} ({d.region})
            </option>
          ))}
        </select>
      </div>

      {/* Subcounty (Required) */}
      <div>
        <label htmlFor="subcounty" className="block text-sm font-medium text-ui-muted mb-2">Subcounty <span className="text-red-500">*</span></label>
        <select
          id="subcounty"
          value={location.subcounty || ''}
          onChange={handleSubcountyChange}
          required
          disabled={!location.district || loading}
          className="w-full p-3 border border-ui rounded-lg focus-ring text-base min-h-[48px] disabled:bg-surface"
        >
          <option value="">Select Subcounty</option>
          {subcounties.map((s) => (
            <option key={s.name} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Parish (Optional) */}
      <div>
        <label htmlFor="parish" className="block text-sm font-medium text-ui-muted mb-2">Parish (Optional)</label>
        <select
          id="parish"
          value={location.parish || ''}
          onChange={handleParishChange}
          disabled={!location.subcounty || loading}
          className="w-full p-3 border border-ui rounded-lg focus-ring text-base min-h-[48px] disabled:bg-surface"
        >
          <option value="">Select Parish</option>
          {parishes.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Village (Optional) */}
      <div>
        <label htmlFor="village" className="block text-sm font-medium text-ui-muted mb-2">Village (Optional)</label>
        <input
          type="text"
          id="village"
          value={location.village || ''}
          onChange={handleVillageChange}
          placeholder="Enter village name"
          disabled={!location.subcounty}
          className="w-full p-3 border border-ui rounded-lg focus-ring text-base min-h-[48px] disabled:bg-surface"
        />
      </div>

      {/* Location Summary */}
      {location.district && location.subcounty && (
        <div className="mt-4 p-3 bg-secondary border border-ui rounded-lg">
          <div className="text-sm text-ui-muted">
            <span className="font-medium text-ui-primary">Location:</span>{' '}
            {[location.village, location.parish, location.subcounty, location.district]
              .filter(Boolean)
              .join(', ')}
          </div>
        </div>
      )}
    </div>
  );
}

LocationSelector.propTypes = {
  location: PropTypes.shape({
    district: PropTypes.string,
    subcounty: PropTypes.string,
    parish: PropTypes.string,
    village: PropTypes.string
  }).isRequired,
  onChange: PropTypes.func.isRequired
};
