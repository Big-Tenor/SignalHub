import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import useReportStore from '../context/reportStore'
import MainLayout from '../layouts/MainLayout'
import Pagination from '../components/Pagination'
import ReportFilters from '../components/ReportFilters'
import { useGeolocation } from '../hooks/useGeolocation'

// Configuration de Mapbox
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

export default function MapPage() {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const markers = useRef([])
  const {
    reports,
    total,
    page,
    limit,
    filters,
    loading,
    error,
    fetchReports,
    setPage,
    setLimit,
    setFilters,
    subscribeToReports
  } = useReportStore()
  const { location, getCurrentPosition } = useGeolocation()

  // Effet pour initialiser la carte
  useEffect(() => {
    if (map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-13.7, 9.5], // Centre sur la Guinée
      zoom: 6,
    })

    // Contrôles de navigation
    map.current.addControl(new mapboxgl.NavigationControl())
    map.current.addControl(new mapboxgl.FullscreenControl())
    
    // Bouton de géolocalisation personnalisé
    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    })
    map.current.addControl(geolocateControl)

    // Nettoyer la carte lors du démontage
    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  // Effet pour charger les signalements
  useEffect(() => {
    fetchReports()
  }, [fetchReports, page, limit, filters])

  // Effet pour s'abonner aux mises à jour en temps réel
  useEffect(() => {
    const unsubscribe = subscribeToReports()
    return () => unsubscribe()
  }, [subscribeToReports])

  // Effet pour mettre à jour les marqueurs
  useEffect(() => {
    if (!map.current || !reports.length) return

    // Supprimer les marqueurs existants
    markers.current.forEach(marker => marker.remove())
    markers.current = []

    // Ajouter les nouveaux marqueurs
    reports.forEach((report) => {
      const el = document.createElement('div')
      el.className = 'marker'
      el.innerHTML = `
        <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white cursor-pointer
          ${report.status === 'resolved' ? 'bg-green-500' : 
            report.status === 'in_progress' ? 'bg-yellow-500' : 'bg-red-500'}">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
      `

      // Popup avec les détails du signalement
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-4">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-bold text-lg text-gray-900">${report.type}</h3>
            <span class="px-2 py-1 text-xs font-medium rounded-full ${
              report.status === 'resolved' ? 'bg-green-100 text-green-800' : 
              report.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'
            }">
              ${report.status === 'resolved' ? 'Résolu' :
                report.status === 'in_progress' ? 'En cours' : 'Nouveau'}
            </span>
          </div>
          <p class="text-sm text-gray-600 mb-3">${report.description}</p>
          ${report.photo_url ? `
            <div class="relative rounded-lg overflow-hidden mb-3">
              <img src="${report.photo_url}" alt="Photo du signalement" class="w-full h-32 object-cover">
            </div>
          ` : ''}
          <div class="text-xs text-gray-500 flex justify-between items-center">
            <span>Signalé le ${new Date(report.created_at).toLocaleDateString()}</span>
            <button 
              onclick="window.location.href='/report/${report.id}'"
              class="text-primary-600 hover:text-primary-800 font-medium"
            >
              Voir les détails
            </button>
          </div>
        </div>
      `)

      // Ajouter le marqueur à la carte
      const marker = new mapboxgl.Marker(el)
        .setLngLat([report.longitude, report.latitude])
        .setPopup(popup)
        .addTo(map.current)

      markers.current.push(marker)
    })

    // Ajuster la vue pour montrer tous les marqueurs si nécessaire
    if (reports.length > 0 && !filters.location) {
      const bounds = new mapboxgl.LngLatBounds()
      reports.forEach(report => {
        bounds.extend([report.longitude, report.latitude])
      })
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      })
    }
  }, [reports])

  // Gérer le changement de localisation
  const handleLocationFilter = () => {
    getCurrentPosition()
    if (location) {
      setFilters({
        ...filters,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          radius: 10
        }
      })
      
      // Centrer la carte sur la position de l'utilisateur
      map.current?.flyTo({
        center: [location.longitude, location.latitude],
        zoom: 13
      })
    }
  }

  return (
    <MainLayout>
      <div className="h-[calc(100vh-4rem)]">
        <div className="mb-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="w-full sm:w-auto">
            <ReportFilters
              filters={filters}
              onFilterChange={setFilters}
              onLocationFilterChange={(locationFilter) =>
                setFilters({ ...filters, location: locationFilter })
              }
            />
          </div>
          <button
            onClick={handleLocationFilter}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Ma position
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md mb-4">
            {error}
          </div>
        )}

        <div ref={mapContainer} className="w-full h-full rounded-lg overflow-hidden relative">
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          )}
        </div>

        <div className="mt-4">
          <Pagination
            currentPage={page}
            totalItems={total}
            itemsPerPage={limit}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        </div>
      </div>
    </MainLayout>
  )
}
