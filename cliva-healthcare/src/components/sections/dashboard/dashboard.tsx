'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Search, Plus, Minus, Eye, Filter } from 'lucide-react';
import { apiClient } from '@/lib/utils/api-client';
import 'leaflet/dist/leaflet.css';
import useAuth from '@/lib/auth/hooks/useAuth';

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
  type: 'hospital' | 'clinic' | 'mobile_clinic' | 'pustu';
  latitude: number;
  longitude: number;
  regency_id: string;
  regency_name?: string;
  sub_district_id?: string;
  sub_district_name?: string;
  [key: string]: any;
}

interface BoundingBoxResponse {
  primary_region: {
    type: string;
    id: string;
    name: string;
    coverage_percentage: number;
    intersection_area_km2: number;
    total_area_km2: number;
    parent_region_id: string;
    parent_region_name: string;
  };
  intersecting_regions: Array<{
    type: string;
    id: string;
    name: string;
    coverage_percentage: number;
    intersection_area_km2: number;
    total_area_km2: number;
    parent_region_id: string;
    parent_region_name: string;
  }>;
  bounding_box: {
    north_east_lat: number;
    north_east_lng: number;
    south_west_lat: number;
    south_west_lng: number;
  };
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
  population_outside_radius: number;
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

interface AnalysisData {
  coveragePercent: number;
  averageDistance: string;
  averageTime: string;
}

interface FacilityTypes {
  hospital: boolean;
  clinic: boolean;
  mobile_clinic: boolean;
  pustu: boolean;
}

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(() => 
  import('react-leaflet').then(mod => mod.MapContainer), 
  { 
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full">Loading map...</div>
  }
);
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

let useMapEvents: any = null;
if (typeof window !== 'undefined') {
  import('react-leaflet').then(mod => {
    useMapEvents = mod.useMapEvents;
  });
}

const Dashboard: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const { userName } = useAuth();
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [subdistricts, setSubdistricts] = useState<SubDistrict[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedRegency, setSelectedRegency] = useState<string>('');
  const [selectedSubdistricts, setSelectedSubdistricts] = useState<string[]>([]);
  const [budget, setBudget] = useState<string>('10000000000');
  const [activeTab, setActiveTab] = useState<'Analysis' | 'Simulation' | null>(null);
  const [selectedFacilityTypes, setSelectedFacilityTypes] = useState<FacilityTypes>({
    hospital: true,
    clinic: true,
    mobile_clinic: true,
    pustu: true
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

  const [currentBounds, setCurrentBounds] = useState<any>(null);
  const [loadedRegions, setLoadedRegions] = useState<Set<string>>(new Set());
  const [isLoadingBounds, setIsLoadingBounds] = useState<boolean>(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const mapRef = useRef<any>(null);


  const iconsCache = useRef<Map<string, any>>(new Map());

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

  const fetchFacilitiesByBoundingBox = async (bounds: any): Promise<void> => {
    if (!bounds) return;
    
    setIsLoadingBounds(true);
    try {
      console.log('🔍 Fetching facilities for bounding box:', bounds);
      
      const northEast = bounds.getNorthEast();
      const southWest = bounds.getSouthWest();
      
      console.log('📍 Bounds coordinates:', {
        north_east_lat: northEast.lat,
        north_east_lng: northEast.lng,
        south_west_lat: southWest.lat,
        south_west_lng: southWest.lng
      });
      

      if (!northEast.lat || !northEast.lng || !southWest.lat || !southWest.lng ||
          isNaN(northEast.lat) || isNaN(northEast.lng) || isNaN(southWest.lat) || isNaN(southWest.lng)) {
        console.error('❌ Invalid bounds coordinates:', { northEast, southWest });
        setIsLoadingBounds(false);
        return;
      }
      

      const queryParams = new URLSearchParams({
        north_east_lat: northEast.lat.toFixed(6),
        north_east_lng: northEast.lng.toFixed(6),
        south_west_lat: southWest.lat.toFixed(6),
        south_west_lng: southWest.lng.toFixed(6),
        min_coverage_percentage: '10'
      });
      
      console.log('🌐 API URL:', `/regions/search-by-bounding-box?${queryParams.toString()}`);
      
      const regionsResponse = await apiClient.get<BoundingBoxResponse>(`/regions/search-by-bounding-box?${queryParams.toString()}`);

      const regionsData = regionsResponse.data;
      console.log('📍 Found regions:', regionsData);

      const regencyIds = new Set<string>();
      
      if (regionsData?.primary_region.type === 'regency') {
        regencyIds.add(regionsData.primary_region.id);
      }
      
      regionsData?.intersecting_regions.forEach(region => {
        if (region.type === 'regency') {
          regencyIds.add(region.id);
        }
        else if (region.type === 'subdistrict' && region.parent_region_id) {
          regencyIds.add(region.parent_region_id);
        }
      });

      console.log('🏢 Regency IDs to fetch facilities for:', Array.from(regencyIds));

      if (regencyIds.size === 0) {
        console.log('🔄 No direct regencies found, trying to get regencies from subdistricts...');
        
        const parentRegencyIds = new Set<string>();
        regionsData?.intersecting_regions.forEach(region => {
          if (region.parent_region_id) {
            parentRegencyIds.add(region.parent_region_id);
          }
        });
        
        if (regionsData?.primary_region.parent_region_id) {
          parentRegencyIds.add(regionsData.primary_region.parent_region_id);
        }
        
        console.log('🏢 Parent regency IDs found:', Array.from(parentRegencyIds));
        
        parentRegencyIds.forEach(id => regencyIds.add(id));
      }

      if (regencyIds.size === 0) {
        console.warn('⚠️ Still no regency IDs found after trying parent regions. Cannot fetch facilities.');
        console.log('Available region data:', regionsData);
        setIsLoadingBounds(false);
        return;
      }

      const newFacilities: Facility[] = [];
      const newlyLoadedRegions = new Set<string>();

      for (const regencyId of Array.from(regencyIds)) {
        if (loadedRegions.has(regencyId)) {
          console.log(`⏭️ Skipping already loaded regency: ${regencyId}`);
          continue;
        }

        try {
          const facilitiesResponse = await apiClient.get<{ 
            facilities: any[]; 
            total: number; 
            regency_id: string 
          }>(`/regions/facilities?regency_id=${regencyId}`);
          
          console.log(`📡 Facilities API response for regency ${regencyId}:`, facilitiesResponse);
          
          if (facilitiesResponse.data?.facilities) {
            const transformedFacilities: Facility[] = facilitiesResponse.data.facilities.map((facility: any) => ({
              id: facility.id,
              name: facility.name || 'Unknown Facility',
              type: (facility.type || 'clinic').toLowerCase() as 'hospital' | 'clinic' | 'mobile_clinic' | 'pustu',
              latitude: facility.latitude || facility.lat || 0,
              longitude: facility.longitude || facility.lng || 0,
              regency_id: facility.regency_id || regencyId,
              regency_name: facility.regency_name || regionsData?.intersecting_regions.find(r => r.id === regencyId)?.name,
              sub_district_id: facility.sub_district_id || facility.subdistrict_id || undefined,
              sub_district_name: facility.sub_district_name || facility.subdistrict_name || undefined,
            }));
            
            console.log(`✅ Transformed ${transformedFacilities.length} facilities for regency ${regencyId}:`, transformedFacilities.slice(0, 2));
            newFacilities.push(...transformedFacilities);
            newlyLoadedRegions.add(regencyId);
          } else {
            console.warn(`⚠️ No facilities data in API response for regency ${regencyId}:`, facilitiesResponse.data);
          }
        } catch (error) {
          console.warn(`⚠️ Failed to fetch facilities for regency ${regencyId}:`, error);
        }
      }

      const facilitiesInBounds = newFacilities.filter(facility => {
        const facilityLatLng = { lat: facility.latitude, lng: facility.longitude };
        return bounds.contains([facilityLatLng.lat, facilityLatLng.lng]);
      });

      console.log('🏥 Total new facilities loaded:', newFacilities.length, 'in bounds:', facilitiesInBounds.length);

      facilitiesInBounds.slice(0, 3).forEach((facility, index) => {
        console.log(`Facility ${index + 1}:`, {
          name: facility.name,
          coordinates: [facility.latitude, facility.longitude],
          type: facility.type,
          regency_id: facility.regency_id
        });
      });

      setFacilities(prevFacilities => {
        const otherFacilities = prevFacilities.filter(f => !newlyLoadedRegions.has(f.regency_id));
        const updatedFacilities = [...otherFacilities, ...facilitiesInBounds];
        console.log('🔄 Updated facilities array:', updatedFacilities.length, 'total facilities');
        return updatedFacilities;
      });
      
      setLoadedRegions(prev => new Set([
        ...Array.from(prev),
        ...Array.from(newlyLoadedRegions),
        ]));
        
    } catch (error) {
      console.error('❌ Error fetching facilities by bounding box:', error);
    } finally {
      setIsLoadingBounds(false);
    }
  };


  const handleMapMove = useCallback((map: any) => {
    if (!map) return;
    
    const bounds = map.getBounds();
    setCurrentBounds(bounds);
    
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    debounceTimer.current = setTimeout(() => {
      fetchFacilitiesByBoundingBox(bounds);
    }, 500);
    
  }, [loadedRegions]);

  const fetchFacilities = async (regencyId: string): Promise<void> => {
    if (!regencyId) return;
    try {
      console.log('🔍 Fetching facilities for specific regency:', regencyId);
      
      const response = await apiClient.get<{ facilities: any[]; total: number; regency_id: string }>(`/regions/facilities?regency_id=${regencyId}`);
      console.log('✅ Facilities API response:', response.data);
      
      if (response.data?.facilities) {
        const transformedFacilities: Facility[] = response.data.facilities.map((facility: any) => ({
          id: facility.id,
          name: facility.name || 'Unknown Facility',
          type: facility.type || 'clinic',
          latitude: facility.latitude || facility.lat || 0,
          longitude: facility.longitude || facility.lng || 0,
          regency_id: facility.regency_id || regencyId,
          regency_name: facility.regency_name || undefined,
          sub_district_id: facility.sub_district_id || facility.subdistrict_id || undefined,
          sub_district_name: facility.sub_district_name || facility.subdistrict_name || undefined,
        }));
        
        console.log(`🏥 Transformed ${transformedFacilities.length} facilities:`, transformedFacilities);
        setFacilities(transformedFacilities);
        setLoadedRegions(new Set([regencyId]));
      } else {
        console.warn('⚠️ No facilities data in response');
        setFacilities([]);
      }
    } catch (error) {
      console.error('❌ Error fetching facilities:', error);
      setFacilities([]);
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
      const convertedResult: SimulationResult = {
        regency_id: selectedRegency,
        regency_name: regencies.find(r => r.id === selectedRegency)?.name || '',
        total_budget: parseFloat(budget),
        budget_used: data.simulation_summary.total_cost,
        facilities_recommended: data.recommendations.length,
        total_population_covered: 0,
        coverage_percentage: data.simulation_summary.projected_coverage,
        optimized_facilities: data.recommendations.map(rec => ({
          latitude: rec.coordinates.lat,
          longitude: rec.coordinates.lon,
          sub_district_id: rec.subdistrict_id,
          sub_district_name: rec.location_name,
          estimated_cost: rec.estimated_cost,
          population_covered: 0,
          coverage_radius_km: 5,
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
        const fullUrl = data.download_url.startsWith('http')
          ? data.download_url
          : `${process.env.NEXT_PUBLIC_API_BASE_URL}${data.download_url}`;
        window.open(fullUrl, '_blank');
      }
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      fetchRegencies(selectedProvince);
      setSelectedRegency('');
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedRegency) {
      fetchSubdistricts(selectedRegency);
      fetchFacilities(selectedRegency);
      fetchHeatmapData(selectedRegency);
      fetchPriorityScore(selectedRegency);
      fetchAnalysisSummary(selectedRegency);

      if (facilities.length > 0) {
        focusMapOnRegency();
      }
    }
  }, [selectedRegency]);

  useEffect(() => {
    if (facilities.length > 0 && selectedRegency) {
      focusMapOnRegency();
    }
  }, [facilities]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const focusMapOnRegency = useCallback((): void => {
    if (facilities.length === 0) return;

    const latitudes = facilities.map(f => f.latitude);
    const longitudes = facilities.map(f => f.longitude);
    
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    setMapCenter([centerLat, centerLng]);

    const latSpread = maxLat - minLat;
    const lngSpread = maxLng - minLng;
    const maxSpread = Math.max(latSpread, lngSpread);

    let newZoom = 10;
    if (maxSpread < 0.01) newZoom = 14;
    else if (maxSpread < 0.05) newZoom = 12;
    else if (maxSpread < 0.1) newZoom = 11;
    else if (maxSpread < 0.2) newZoom = 10;
    else newZoom = 9;

    setMapZoom(newZoom);
  }, [facilities]);

  const getIconByType = useCallback((type: string): string => {
    const icons: Record<string, string> = {
      'hospital': 'H',
      'clinic': 'C', 
      'mobile_clinic': 'M',
      'pustu': 'Pu'
    };
    return icons[type.toLowerCase()] || 'H';
  }, []);

  const getColorByType = useCallback((type: string): string => {
    const colors: Record<string, string> = {
      'hospital': '#dc2626',
      'clinic': '#f59e0b',
      'mobile_clinic': '#3b82f6',
      'pustu': '#10b981'
    };
    return colors[type.toLowerCase()] || '#dc2626';
  }, []);

  const handleSubdistrictToggle = useCallback((subdistrictId: string): void => {
    setSelectedSubdistricts(prev => 
      prev.includes(subdistrictId) 
        ? prev.filter(id => id !== subdistrictId)
        : [...prev, subdistrictId]
    );
  }, []);

  const handleFacilityTypeToggle = useCallback((type: keyof FacilityTypes): void => {
    setSelectedFacilityTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  }, []);

  const createCustomIcon = useCallback((type: string, isHighlighted = false) => {
  if (typeof window === 'undefined' || !('L' in window)) return null;

  const iconClass = `custom-marker${isHighlighted ? ' pulse' : ''}`;
  const iconLabel = getIconByType(type);

  const iconHtml = `<div class="${iconClass}">${iconLabel}</div>`;

  const icon = new window.L.DivIcon({
    html: iconHtml,
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  return icon;
}, [getIconByType]);


  const filteredFacilities = useMemo(() => {
    return facilities.filter(facility => selectedFacilityTypes[facility.type]);
  }, [facilities, selectedFacilityTypes]);

  useEffect(() => {
    return () => {
      iconsCache.current.clear();
    };
  }, []);

  const MapEventHandler = () => {
    if (typeof window === 'undefined' || !useMapEvents) return null;
    
    const MapEvents = () => {
      useMapEvents({
        moveend: (e: any) => {
          const map = e.target;
          console.log('🗺️ Map moved, getting bounds...');
          setTimeout(() => handleMapMove(map), 100);
        },
        zoomend: (e: any) => {
          const map = e.target;
          console.log('🔍 Map zoomed, getting bounds...');
          setTimeout(() => handleMapMove(map), 100);
        },
        load: (e: any) => {
          const map = e.target;
          console.log('📍 Map loaded, getting initial bounds...');
          setTimeout(() => handleMapMove(map), 500);
        }
      });
      
      return null;
    };
    
    return <MapEvents />;
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
                  <p className="font-semibold">{userName}</p>
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

      <div className="max-w-full mx-auto px-4 py-6">
        <div className="relative w-full">
          {/* Main Map Container */}
          <div className={`bg-white rounded-lg shadow-sm border overflow-hidden transition-all duration-300 ${
            activeTab ? 'mr-[420px]' : 'mr-0'
          }`}>
            <div className="relative h-[calc(100vh-140px)]">
              {/* Search Bar Overlay */}
              <div className="absolute top-4 left-4 z-[1000]">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-80 pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-lg">
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Location Selection Overlay */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000]">
                <div className="bg-white rounded-lg p-3 shadow-lg border flex items-center space-x-3">
                  <select 
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm min-w-[150px]"
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
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm min-w-[150px]"
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

                  <div className="text-sm text-gray-600 whitespace-nowrap px-2">
                    {subdistricts.length} subdistricts
                  </div>
                </div>
              </div>

              {/* Loading Indicator for Bounding Box */}
              {isLoadingBounds && (
                <div className="absolute top-20 right-4 z-[1000] bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span className="text-sm">Loading facilities...</span>
                  </div>
                </div>
              )}

              {/* Dynamic Facilities Info */}
              <div className="absolute top-20 left-4 z-[1000] bg-white border rounded-lg p-4 shadow-lg min-w-[280px]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg text-gray-800">
                    Current View
                  </h3>
                  <button 
                    onClick={() => {
                      setFacilities([]);
                      setLoadedRegions(new Set());
                      setSelectedRegency('');
                      setSelectedProvince('');
                    }}
                    className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-600">Healthcare Facilities:</span>
                    <span className="font-medium text-blue-600">{filteredFacilities.length}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-600">Loaded Regions:</span>
                    <span className="font-medium text-green-600">{loadedRegions.size}</span>
                  </div>
                  {Object.entries(selectedFacilityTypes).map(([type, enabled]) => {
                    const count = facilities.filter(f => f.type === type && enabled).length;
                    if (count === 0) return null;
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span
                            className="w-4 h-4 rounded-full text-xs flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: getColorByType(type) }}
                          >
                            {getIconByType(type)}
                          </span>
                          <span className="capitalize text-gray-700">{type.replace('_', ' ')}s</span>
                        </div>
                        <span className="font-medium">{count}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded p-2">
                  🗺️ Facilities load automatically as you explore the map
                </div>
              </div>

              {/* Facility Filter Overlay */}
              <div className="absolute top-4 right-4 z-[1000]">
                <div className="bg-white border rounded-lg p-3 shadow-lg min-w-[180px]">
                  <div className="flex items-center space-x-2 mb-3">
                    <Eye className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Facilities</span>
                  </div>
                  {Object.entries(selectedFacilityTypes).map(([type, checked]) => (
                    <label key={type} className="flex items-center space-x-2 text-sm mb-2 last:mb-0">
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
                      <span className="capitalize">{type.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Leaflet Map */}
              {typeof window !== 'undefined' && (
                <MapContainer
                  center={mapCenter}
                  zoom={mapZoom}
                  style={{ height: '100%', width: '100%', zIndex: 1 }}
                  whenCreated={(mapInstance: any) => {
                    mapRef.current = mapInstance;
                    console.log('Map created successfully');
                  }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  
                  {/* Map Event Handler for dynamic loading */}
                  <MapEventHandler />
                  
                  {/* Debug: Log filtered facilities before rendering */}
                  {console.log('🎯 Rendering markers for facilities:', filteredFacilities.length, filteredFacilities.slice(0, 2))}
                  
                  {filteredFacilities.map((facility, index) => {
                    // Additional validation for coordinates
                    if (!facility.latitude || !facility.longitude || 
                        facility.latitude === 0 || facility.longitude === 0 ||
                        isNaN(facility.latitude) || isNaN(facility.longitude)) {
                      console.warn('⚠️ Invalid coordinates for facility:', facility.name, facility.latitude, facility.longitude);
                      return null;
                    }

                    return (
                      <Marker
                        key={`facility-${facility.id}-${facility.regency_id}-${index}`}
                        position={[facility.latitude, facility.longitude]}
                        icon={createCustomIcon(facility.type, !!selectedRegency && facility.regency_id === selectedRegency)}
                      >
                        <Popup>
                          <div className="p-3">
                            <div className="flex items-center space-x-2 mb-2">
                              <span
                                className="w-6 h-6 rounded-full text-xs flex items-center justify-center text-white font-bold"
                                style={{ backgroundColor: getColorByType(facility.type) }}
                              >
                                {getIconByType(facility.type)}
                              </span>
                              <h3 className="font-semibold text-lg">{facility.name}</h3>
                            </div>
                            <div className="space-y-1 text-sm">
                              <p><span className="font-medium">Type:</span> <span className="capitalize">{facility.type.replace('_', ' ')}</span></p>
                              <p><span className="font-medium">Regency:</span> {facility.regency_name || 'Unknown'}</p>
                              {facility.sub_district_name && (
                                <p><span className="font-medium">Sub-district:</span> {facility.sub_district_name}</p>
                              )}
                              <p><span className="font-medium">Location:</span> {facility.latitude.toFixed(4)}, {facility.longitude.toFixed(4)}</p>
                            </div>
                            {selectedRegency && facility.regency_id === selectedRegency && (
                              <div className="mt-2 px-2 py-1 bg-yellow-100 border border-yellow-300 rounded text-xs text-yellow-800">
                                📍 Selected regency facility
                              </div>
                            )}
                            {!selectedRegency && (
                              <div className="mt-2 px-2 py-1 bg-blue-100 border border-blue-300 rounded text-xs text-blue-800">
                                🗺️ Dynamically loaded
                              </div>
                            )}
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}

                  {/* Simulation result markers */}
                  {simulationResult?.optimized_facilities?.map((facility, index) => (
                    <Marker
                      key={`simulation-${index}-${simulationResult.regency_id}`}
                      position={[facility.latitude, facility.longitude]}
                      icon={createCustomIcon(facility.type || 'hospital', true)}
                    >
                      <Popup>
                        <div className="p-3">
                          <h3 className="font-semibold text-lg text-green-600">Recommended Facility</h3>
                          <div className="space-y-1 text-sm mt-2">
                            <p><span className="font-medium">Type:</span> <span className="capitalize">{facility.type?.replace('_', ' ')}</span></p>
                            <p><span className="font-medium">Location:</span> {facility.sub_district_name || 'Unknown area'}</p>
                            <p><span className="font-medium">Cost:</span> IDR {facility.estimated_cost?.toLocaleString() || 'TBD'}</p>
                            <p><span className="font-medium">Coverage:</span> {facility.coverage_radius_km || 5}km radius</p>
                          </div>
                          <div className="mt-2 px-2 py-1 bg-green-100 border border-green-300 rounded text-xs text-green-800">
                            🎯 Optimization result
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              )}
              
              {/* Debug info panel */}
              {process.env.NODE_ENV === 'development' && (
                <div className="absolute bottom-4 right-20 z-[1000] bg-black text-white p-3 rounded text-xs max-w-xs">
                  <h4 className="font-bold mb-1">Debug Info:</h4>
                  <div className="space-y-1">
                    <div>Province: {selectedProvince}</div>
                    <div>Regency: {selectedRegency}</div>
                    <div>Total Facilities: {facilities.length}</div>
                    <div>Filtered: {filteredFacilities.length}</div>
                    <div>Loaded Regions: {loadedRegions.size}</div>
                    <div>Loading: {isLoadingBounds ? 'Yes' : 'No'}</div>
                    <div>Center: [{mapCenter[0].toFixed(3)}, {mapCenter[1].toFixed(3)}]</div>
                    <div>Zoom: {mapZoom}</div>
                  </div>
                </div>
              )}

              {/* Map controls */}
              <div className="absolute bottom-20 right-4 flex flex-col space-y-2 z-[1000]">
                <button 
                  className="bg-white border shadow-lg p-3 rounded hover:bg-gray-50 transition-colors"
                  onClick={() => setMapZoom(prev => Math.min(prev + 1, 18))}
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button 
                  className="bg-white border shadow-lg p-3 rounded hover:bg-gray-50 transition-colors"
                  onClick={() => setMapZoom(prev => Math.max(prev - 1, 1))}
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-4 left-4 z-[1000]">
                <div className="flex space-x-2">
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm shadow-lg hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      // Reset to show all loaded facilities
                      setSelectedRegency('');
                      setSelectedProvince('');
                    }}
                  >
                    Show All
                  </button>
                  <button 
                    className="px-4 py-2 bg-white border text-gray-700 rounded-lg text-sm shadow-lg hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      // Clear all loaded data
                      setFacilities([]);
                      setLoadedRegions(new Set());
                    }}
                  >
                    Clear Map
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Toggle Button */}
          <button
            onClick={() => {
              setActiveTab(activeTab ? null : 'Analysis');
            }}
            className="fixed top-1/2 right-0 transform -translate-y-1/2 bg-blue-600 text-white px-3 py-8 rounded-l-lg shadow-lg z-[1001] hover:bg-blue-700 transition-all duration-300"
          >
            <div className="flex flex-col items-center space-y-1">
              <span className="text-xs font-medium transform -rotate-90 whitespace-nowrap">
                {activeTab ? 'Close' : 'Analysis'}
              </span>
              <div className="text-xs">
                {activeTab ? '×' : '→'}
              </div>
            </div>
          </button>

          {/* Collapsible Right Sidebar */}
          <div className={`fixed top-0 right-0 h-full bg-white shadow-xl border-l transform transition-all duration-300 ease-in-out z-[1002] ${
            activeTab ? 'translate-x-0' : 'translate-x-full'
          }`} style={{ width: '420px' }}>
            
            {activeTab && (
              <div className="h-full flex flex-col">
                <div className="absolute top-4 right-4 z-10">
                  <button
                    onClick={() => setActiveTab(null)}
                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <span className="text-lg leading-none">×</span>
                  </button>
                </div>

                {/* Tab Navigation */}
                <div className="border-b bg-gray-50 flex-shrink-0">
                  <div className="flex">
                    {(['Analysis', 'Simulation'] as const).map(tab => (
                      <button
                        key={tab}
                        className={`px-6 py-4 font-medium text-sm flex-1 transition-colors ${
                          activeTab === tab
                            ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6 overflow-y-auto flex-1 pt-12">
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
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;