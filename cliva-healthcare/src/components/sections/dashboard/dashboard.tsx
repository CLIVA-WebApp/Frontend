'use client';

// components/HealthcareMapper.tsx
import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Search, Plus, Minus, Eye, Filter } from 'lucide-react';
import { apiClient } from '@/lib/utils/api-client';

// Types based on your API schemas
interface Province {
  id: string;
  name: string;
  pum_code?: string;
  province_name?: string;
  area_km2?: number;
}

interface Regency {
  id: string;
  name: string;
  pum_code?: string;
  province_id: string;
  province_name?: string;
  area_km2?: number;
}

interface SubDistrict {
  id: string;
  name: string;
  pum_code?: string;
  regency_id: string;
  regency_name?: string;
  population_count?: number;
  poverty_level?: number;
  area_km2?: number;
}

interface Facility {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'mobile_clinic';
  latitude: number;
  longitude: number;
  regency_id: string;
  regency_name?: string;
  sub_district_id?: string;
  sub_district_name?: string;
}

interface HeatmapPoint {
  latitude: number;
  longitude: number;
  population_density: number;
  access_score: number;
  distance_to_facility: number;
}

interface HeatmapData {
  regency_id: string;
  regency_name: string;
  total_population: number;
  average_distance_to_facility: number;
  service_radius_km: number;
  heatmap_points: HeatmapPoint[];
}

interface SubDistrictScore {
  sub_district_id: string;
  sub_district_name: string;
  gap_factor: number;
  efficiency_factor: number;
  vulnerability_factor: number;
  composite_score: number;
  rank: number;
}

interface PriorityData {
  regency_id: string;
  regency_name: string;
  total_sub_districts: number;
  sub_districts: SubDistrictScore[];
}

interface OptimizedFacility {
  latitude: number;
  longitude: number;
  sub_district_id: string;
  sub_district_name: string;
  estimated_cost: number;
  population_covered: number;
  coverage_radius_km: number;
  type?: string;
}

interface SimulationResult {
  regency_id: string;
  regency_name: string;
  total_budget: number;
  budget_used: number;
  facilities_recommended: number;
  total_population_covered: number;
  coverage_percentage: number;
  optimized_facilities: OptimizedFacility[];
}

interface SubDistrictDetails {
  sub_district_id: string;
  sub_district_name: string;
  regency_id: string;
  regency_name: string;
  population: number;
  area_km2: number;
  population_density: number;
  poverty_rate: number;
  existing_facilities_count: number;
  existing_facilities: Array<{
    name: string;
    type: string;
    latitude: number;
    longitude: number;
  }>;
  gap_factor: number;
  efficiency_factor: number;
  vulnerability_factor: number;
  composite_score: number;
  rank: number;
}

interface ApiError {
  detail: Array<{
    loc?: string[];
    msg: string;
    type?: string;
  }>;
}

interface AnalysisData {
  coveragePercent: number;
  averageDistance: string;
  averageTime: string;
}

interface FacilityTypes {
  hospital: boolean;
  clinic: boolean;
  mobile_clinic: boolean;
}
interface ApiRequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

// Dynamically import map to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

const Dashboard: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [subdistricts, setSubdistricts] = useState<SubDistrict[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedRegency, setSelectedRegency] = useState<string>('');
  const [selectedSubdistricts, setSelectedSubdistricts] = useState<string[]>([]);
  const [budget, setBudget] = useState<string>('10000000000');
  const [activeTab, setActiveTab] = useState<'Analysis' | 'Simulation'>('Analysis');
const [selectedFacilityTypes, setSelectedFacilityTypes] = useState<FacilityTypes>({
  hospital: true,
  clinic: true,
  mobile_clinic: true
});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([-6.9175, 107.6191]); // Bandung coordinates
  const [mapZoom, setMapZoom] = useState<number>(12);
  const [heatmapData, setHeatmapData] = useState<HeatmapData | null>(null);
  const [priorityData, setPriorityData] = useState<PriorityData | null>(null);
  const [subdistrictDetails, setSubdistrictDetails] = useState<SubDistrictDetails | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData>({
    coveragePercent: 50,
    averageDistance: '5KM',
    averageTime: '6H'
  });

const fetchProvinces = async (): Promise<void> => {
  try {
    const response = await apiClient.get<{ provinces: Province[]; total: number }>('/regions/provinces');
    setProvinces(response.data!.provinces || []);
  } catch (error) {
    console.error('Error fetching provinces:', error);
  }
};

const fetchRegencies = async (provinceId: string): Promise<void> => {
  if (!provinceId) return;
  try {
    const response = await apiClient.get<{ regencies: Regency[]; total: number; province_id: string }>(`/regions/regencies?province_id=${provinceId}`);
    setRegencies(response.data!.regencies || []);
  } catch (error) {
    console.error('Error fetching regencies:', error);
  }
};

const fetchSubdistricts = async (regencyId: string): Promise<void> => {
  if (!regencyId) return;
  try {
    const response = await apiClient.get<{ sub_districts: SubDistrict[]; total: number; regency_id: string }>(`/regions/subdistricts?regency_id=${regencyId}`);
    setSubdistricts(response.data!.sub_districts || []);
  } catch (error) {
    console.error('Error fetching subdistricts:', error);
  }
};

const fetchFacilities = async (regencyId: string): Promise<void> => {
  if (!regencyId) return;
  try {
    const response = await apiClient.get<{ facilities: Facility[]; total: number; regency_id: string }>(`/regions/facilities?regency_id=${regencyId}`);
    setFacilities(response.data!.facilities || []);
  } catch (error) {
    console.error('Error fetching facilities:', error);
  }
};

const fetchHeatmapData = async (regencyId: string): Promise<void> => {
  if (!regencyId) return;
  try {
    const response = await apiClient.get<{
      regency_id: string;
      regency_name: string;
      total_population: number;
      population_outside_radius: number;
      service_radius_km: number;
      heatmap_points: HeatmapPoint[];
    }>(`/analysis/heatmap?regency_id=${regencyId}`);
    setHeatmapData(response.data!);
  } catch (error) {
    console.error('Error fetching heatmap data:', error);
  }
};

const fetchPriorityScore = async (regencyId: string): Promise<void> => {
  if (!regencyId) return;
  try {
    const response = await apiClient.get<{
      regency_id: string;
      regency_name: string;
      total_sub_districts: number;
      sub_districts: SubDistrictScore[];
    }>(`/analysis/priority-score?regency_id=${regencyId}`);
    setPriorityData(response.data!);
  } catch (error) {
    console.error('Error fetching priority score:', error);
  }
};

const fetchAnalysisSummary = async (regencyId: string): Promise<void> => {
  if (!regencyId) return;
  try {
    const response = await apiClient.get<{
      regency_name: string;
      summary_metrics: {
        coverage_percentage: number;
        average_distance_km: number;
        average_travel_time_hours: number;
      };
      facility_overview: Array<{
        id: string;
        name: string;
        type: string;
        rating: number;
      }>;
    }>(`/analysis/summary?regency_id=${regencyId}`);
    
    // Update analysis data with real values
    const data = response.data!;
    setAnalysisData({
      coveragePercent: Math.round(data.summary_metrics.coverage_percentage),
      averageDistance: `${data.summary_metrics.average_distance_km.toFixed(1)}KM`,
      averageTime: `${(data.summary_metrics.average_travel_time_hours * 60).toFixed(0)}MIN`
    });
  } catch (error) {
    console.error('Error fetching analysis summary:', error);
  }
};

const fetchSubdistrictDetails = async (subdistrictId: string): Promise<void> => {
  if (!subdistrictId) return;
  try {
    const response = await apiClient.get<SubDistrictDetails>(`/analysis/subdistrict-details?subdistrict_id=${subdistrictId}`);
    setSubdistrictDetails(response.data!);
  } catch (error) {
    console.error('Error fetching subdistrict details:', error);
  }
};

const runSimulation = async (): Promise<void> => {
  if (!selectedRegency || selectedSubdistricts.length === 0) {
    alert('Please select regency and subdistricts first');
    return;
  }

  setLoading(true);
  try {
    const requestBody = {
      geographic_level: "subdistrict" as const,
      area_ids: selectedSubdistricts,
      budget: parseFloat(budget),
      facility_types: Object.keys(selectedFacilityTypes)
        .filter(key => selectedFacilityTypes[key as keyof FacilityTypes])
        .map(type => {
          // Map to API expected values
          const typeMap: Record<string, string> = {
            'hospital': 'Hospital',
            'clinic': 'Clinic',
            'mobile_clinic': 'Mobile clinic'
          };
          return typeMap[type] || type;
        })
    };

    const response = await apiClient.post<{
      simulation_summary: {
        initial_coverage: number;
        projected_coverage: number;
        coverage_increase_percent: number;
        total_cost: number;
        budget_remaining: number;
      };
      recommendations: Array<{
        type: string;
        subdistrict_id: string;
        location_name: string;
        coordinates: { lat: number; lon: number };
        estimated_cost: number;
      }>;
      automated_reasoning: string;
    }>('/simulation/run', requestBody);

    const data = response.data!;

    // Convert to format expected by UI
    const convertedResult: SimulationResult = {
      regency_id: selectedRegency,
      regency_name: regencies.find(r => r.id === selectedRegency)?.name || '',
      total_budget: parseFloat(budget),
      budget_used: data.simulation_summary.total_cost,
      facilities_recommended: data.recommendations.length,
      total_population_covered: 0, // Would need to calculate or get from API
      coverage_percentage: data.simulation_summary.projected_coverage,
      optimized_facilities: data.recommendations.map(rec => ({
        latitude: rec.coordinates.lat,
        longitude: rec.coordinates.lon,
        sub_district_id: rec.subdistrict_id,
        sub_district_name: rec.location_name,
        estimated_cost: rec.estimated_cost,
        population_covered: 0, // Would need from API
        coverage_radius_km: 5, // Default value
        type: rec.type.toLowerCase()
      }))
    };

    setSimulationResult(convertedResult);
  } catch (error) {
    console.error('Error running simulation:', error);
  } finally {
    setLoading(false);
  }
};

  const exportReport = async (): Promise<void> => {
  try {
    const requestBody = {
      report_type: 'simulation_results',
      data: simulationResult || priorityData || {},
      format: 'pdf'
    };

    const response = await apiClient.post<{
      filename: string;
      download_url: string;
      file_size_bytes: number;
      generated_at: string;
    }>('/reports/export', requestBody);

    const data = response.data!;
    if (data.download_url) {
      // Construct full URL if needed
      const fullUrl = data.download_url.startsWith('http')
        ? data.download_url
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}${data.download_url}`;
      window.open(fullUrl, '_blank');
    }
  } catch (error) {
    console.error('Error exporting report:', error);
  }
};

// Add chatbot integration functions
const startChatSession = async (): Promise<void> => {
  try {
    const response = await apiClient.post<{
      bot_response: string;
      recent_simulations: any[];
      suggested_actions: Array<{
        action_type: string;
        description: string;
        parameters?: any;
      }>;
    }>('/chatbot/start_chat');

    const data = response.data!;
    console.log('Chat started:', data.bot_response);
    // You can integrate this with a chat UI component
  } catch (error) {
    console.error('Error starting chat:', error);
  }
};

const sendChatMessage = async (message: string): Promise<void> => {
  try {
    const requestBody = {
      user_message: message,
      session_context: {
        last_simulation_result: simulationResult ? {
          regency_name: simulationResult.regency_name,
          budget_used: simulationResult.budget_used,
          facilities_recommended: simulationResult.facilities_recommended,
          coverage_percentage: simulationResult.coverage_percentage
        } : null,
        previous_messages: [] // You'd maintain chat history here
      }
    };

    const response = await apiClient.post<{
      bot_response: string;
      suggested_actions: Array<{
        action_type: string;
        description: string;
        parameters?: any;
      }>;
    }>('/chatbot/assist', requestBody);

    const data = response.data!;
    console.log('Bot response:', data.bot_response);
    // You can integrate this with a chat UI component
  } catch (error) {
    console.error('Error sending chat message:', error);
  }
};


  // Initialize auth check
  useEffect(() => {
  // Since this component is wrapped in ProtectedRoute,
  // we know the user is authenticated, so just fetch data
  fetchProvinces();
}, []);

  useEffect(() => {
    if (selectedProvince) {
      fetchRegencies(selectedProvince);
      setSelectedRegency('');
      setFacilities([]);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedRegency) {
      fetchSubdistricts(selectedRegency);
      fetchFacilities(selectedRegency);
      fetchHeatmapData(selectedRegency);
      fetchPriorityScore(selectedRegency);
      fetchAnalysisSummary(selectedRegency); // Add this for real coverage data
    }
  }, [selectedRegency]);

  const getIconByType = (type: string): string => {
    const icons: Record<string, string> = {
      'hospital': 'H',
      'clinic': 'C', 
      'mobile_clinic': 'M',
      'pustu': 'Pu'
    };
    return icons[type.toLowerCase()] || 'H';
  };

  const getColorByType = (type: string): string => {
    const colors: Record<string, string> = {
      'hospital': '#dc2626', // red
      'clinic': '#f59e0b', // yellow/orange
      'mobile_clinic': '#3b82f6',  // cyan
      'pustu': '#10b981' // green
    };
    return colors[type.toLowerCase()] || '#dc2626';
  };

  const handleSubdistrictToggle = (subdistrictId: string): void => {
    setSelectedSubdistricts(prev => 
      prev.includes(subdistrictId) 
        ? prev.filter(id => id !== subdistrictId)
        : [...prev, subdistrictId]
    );
  };

  const handleFacilityTypeToggle = (type: keyof FacilityTypes): void => {
    setSelectedFacilityTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const CustomIcon = ({ type }: { type: string }) => {
    if (typeof window === 'undefined') return null;
    
    const iconHtml = `
      <div style="
        background-color: ${getColorByType(type)};
        color: white;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 14px;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      ">
        ${getIconByType(type)}
      </div>
    `;
    
    return new (window as any).L.DivIcon({
      html: iconHtml,
      className: 'custom-marker-icon',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                <div>
                  <p className="font-semibold">Evelyn Yo</p>
                  <p className="text-xs text-gray-500">Pro plan</p>
                </div>
              </div>
            </div>
            <nav className="flex space-x-8">
              <a href="#" className="text-gray-500">Home</a>
              <a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-1">Dashboard</a>
              <a href="#" className="text-gray-500">Profile</a>
              <a href="#" className="text-gray-500">About Us</a>
            </nav>
            <div className="w-8 h-8 bg-blue-600 rounded"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Map Section */}
          <div className="col-span-8">
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {/* Search Bar and Location Selector */}
              <div className="p-4 border-b">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-lg">
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Facility Filter */}
                  <div className="relative">
                    <div className="bg-white border rounded-lg p-2 shadow-sm">
                      <div className="flex items-center space-x-2 mb-2">
                        <Eye className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium">Facilities</span>
                      </div>
                      {Object.entries(selectedFacilityTypes).map(([type, checked]) => (
                        <label key={type} className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleFacilityTypeToggle(type as keyof FacilityTypes)}
                            className="rounded border-gray-300"
                          />
                          <span className={`w-4 h-4 rounded text-xs flex items-center justify-center text-white`}
                                style={{ backgroundColor: getColorByType(type) }}>
                            {getIconByType(type)}
                          </span>
                          <span className="capitalize">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Location Selection */}
                <div className="grid grid-cols-3 gap-4">
                  <select 
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                  >
                    <option value="">Select Province</option>
                    {provinces.map(province => (
                      <option key={province.id} value={province.id}>
                        {province.name}
                      </option>
                    ))}
                  </select>

                  <select 
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={selectedRegency}
                    onChange={(e) => setSelectedRegency(e.target.value)}
                    disabled={!selectedProvince}
                  >
                    <option value="">Select Regency</option>
                    {regencies.map(regency => (
                      <option key={regency.id} value={regency.id}>
                        {regency.name}
                      </option>
                    ))}
                  </select>

                  <div className="text-sm text-gray-600 flex items-center">
                    {subdistricts.length} subdistricts available
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="relative h-96">
                {typeof window !== 'undefined' && (
                  <MapContainer
                    center={mapCenter}
                    zoom={mapZoom}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    
                    {facilities
                      .filter(facility => selectedFacilityTypes[facility.type])
                      .map(facility => (
                        <Marker
                          key={facility.id}
                          position={[facility.latitude, facility.longitude]}
                          icon={CustomIcon({ type: facility.type })}
                        >
                          <Popup>
                            <div className="p-2">
                              <h3 className="font-semibold">{facility.name}</h3>
                              <p className="text-sm text-gray-600">Type: {facility.type}</p>
                              <p className="text-sm">Regency: {facility.regency_name}</p>
                              <p className="text-sm">Sub-district: {facility.sub_district_name}</p>
                            </div>
                          </Popup>
                        </Marker>
                      ))}

                    {/* Heatmap points */}
                    {heatmapData?.heatmap_points?.map((point, index) => (
                      <Marker
                        key={`heatmap-${index}`}
                        position={[point.latitude, point.longitude]}
                        icon={new (window as any).L.Circle([point.latitude, point.longitude], {
                          radius: point.distance_to_facility * 100,
                          color: point.access_score > 0.5 ? 'green' : 'red',
                          fillOpacity: 0.3
                        })}
                      />
                    ))}
                  </MapContainer>
                )}
                
                {/* Map Controls */}
                <div className="absolute right-4 top-4 flex flex-col space-y-2">
                  <button 
                    className="bg-white border shadow-sm p-2 rounded hover:bg-gray-50"
                    onClick={() => setMapZoom(prev => Math.min(prev + 1, 18))}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button 
                    className="bg-white border shadow-sm p-2 rounded hover:bg-gray-50"
                    onClick={() => setMapZoom(prev => Math.max(prev - 1, 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bottom Controls */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">District</button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm">City</button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm">Province</button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="col-span-4">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm border mb-6">
              <div className="border-b">
                <div className="flex">
                  {(['Analysis', 'Simulation'] as const).map(tab => (
                    <button
                      key={tab}
                      className={`px-6 py-3 font-medium text-sm ${
                        activeTab === tab
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'Analysis' && (
                  <div className="space-y-6">
                    {/* Coverage Statistics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="relative w-20 h-20 mx-auto mb-2">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle
                              cx="40"
                              cy="40"
                              r="30"
                              stroke="#e5e7eb"
                              strokeWidth="8"
                              fill="none"
                            />
                            <circle
                              cx="40"
                              cy="40"
                              r="30"
                              stroke="#3b82f6"
                              strokeWidth="8"
                              fill="none"
                              strokeDasharray={`${analysisData.coveragePercent * 1.88} 188`}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-semibold">{analysisData.coveragePercent}%</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">Coverage percent</p>
                      </div>
                      <div className="space-y-2">
                        <div className="bg-blue-600 text-white p-3 rounded-lg text-center">
                          <div className="text-lg font-semibold">{analysisData.averageDistance}</div>
                          <div className="text-xs">Average Distance</div>
                        </div>
                        <div className="bg-blue-600 text-white p-3 rounded-lg text-center">
                          <div className="text-lg font-semibold">{analysisData.averageTime}</div>
                          <div className="text-xs">Average Travel Time</div>
                        </div>
                      </div>
                    </div>

                    {/* Priority Districts */}
                    {priorityData && (
                      <div>
                        <h3 className="font-semibold mb-3 text-red-600">Least Coverage Districts</h3>
                        <div className="space-y-2">
                          {priorityData.sub_districts?.slice(0, 4).map((district, index) => (
                            <div key={district.sub_district_id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-sm">{index + 1}. {district.sub_district_name}</span>
                              <div className="flex items-center space-x-1">
                                <span className="text-xs">Score: {district.composite_score?.toFixed(1)}</span>
                                <span className="text-xs">Rank: {district.rank}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Healthcare Centers List */}
                    <div>
                      <h3 className="font-semibold mb-3">List of Healthcare Centers</h3>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {facilities.slice(0, 10).map(facility => (
                          <div key={facility.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center space-x-2">
                              <span
                                className="w-6 h-6 rounded text-xs flex items-center justify-center text-white"
                                style={{ backgroundColor: getColorByType(facility.type) }}
                              >
                                {getIconByType(facility.type)}
                              </span>
                              <span className="text-sm text-blue-600">{facility.name}</span>
                            </div>
                            <span className="text-xs text-gray-500">{facility.type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'Simulation' && (
                  <div className="space-y-6">
                    {/* Selected Areas */}
                    <div>
                      <h3 className="font-medium mb-3">Selected Sub-districts:</h3>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {subdistricts.map(subdistrict => (
                          <label key={subdistrict.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={selectedSubdistricts.includes(subdistrict.id)}
                              onChange={() => handleSubdistrictToggle(subdistrict.id)}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm">{subdistrict.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Budget Input */}
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm">IDR</span>
                        <input
                          type="number"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm"
                          placeholder="Insert your budget"
                        />
                      </div>
                    </div>

                    {/* Facility Type Selection */}
                    <div className="space-y-2">
                      {Object.entries(selectedFacilityTypes).map(([type, checked]) => (
                        <label key={type} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleFacilityTypeToggle(type as keyof FacilityTypes)}
                            className="rounded border-gray-300"
                          />
                          <span
                            className="w-6 h-6 rounded text-xs flex items-center justify-center text-white"
                            style={{ backgroundColor: getColorByType(type) }}
                          >
                            {getIconByType(type)}
                          </span>
                          <span className="text-sm capitalize">{type}</span>
                        </label>
                      ))}
                    </div>

                    {/* Simulate Button */}
                    <button 
                      onClick={runSimulation}
                      disabled={loading || !selectedRegency || selectedSubdistricts.length === 0}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Running Simulation...' : 'Simulate'}
                    </button>

                    {/* Simulation Results */}
                    {simulationResult && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium">Simulation Results</span>
                          <span className="text-sm text-gray-500">
                            Budget Used: IDR {simulationResult.budget_used?.toLocaleString()}
                          </span>
                        </div>
                        
                        <p className="text-xs text-gray-500 mb-3">
                          Coverage: {simulationResult.coverage_percentage}% | 
                          Population: {simulationResult.total_population_covered?.toLocaleString()}
                        </p>

                        <div className="space-y-2">
                          <div className="grid grid-cols-4 gap-2 text-xs font-medium text-gray-600 mb-2">
                            <span>Type</span>
                            <span>Location</span>
                            <span>Cost</span>
                            <span>Coverage</span>
                          </div>
                          
                          {simulationResult.optimized_facilities?.slice(0, 5).map((facility, index) => (
                            <div key={index} className="grid grid-cols-4 gap-2 text-xs py-2 border-b border-gray-100">
                              <div className="flex items-center space-x-1">
                                <span
                                  className="w-4 h-4 rounded text-xs flex items-center justify-center text-white"
                                  style={{ backgroundColor: getColorByType(facility.type || 'hospital') }}
                                >
                                  {getIconByType(facility.type || 'hospital')}
                                </span>
                              </div>
                              <span>{facility.sub_district_name}</span>
                              <span>IDR {facility.estimated_cost?.toLocaleString()}</span>
                              <span>{facility.coverage_radius_km}km</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <button 
                        onClick={exportReport}
                        disabled={!selectedRegency}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        📊 Export PDF Report
                      </button>
                      <button 
                        onClick={startChatSession}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium"
                      >
                        💬 Chat with Ceeva
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;