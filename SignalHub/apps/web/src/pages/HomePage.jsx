import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPinIcon, BellAlertIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import useReportStore from '../context/reportStore'
import MainLayout from '../layouts/MainLayout'
import Pagination from '../components/Pagination'
import ReportFilters from '../components/ReportFilters'
import { useGeolocation } from '../hooks/useGeolocation'

// Configuration de Mapbox
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const features = [
  {
    name: 'Signalement facile',
    description: 'Signalez rapidement les problèmes urbains avec notre interface intuitive. Ajoutez photos et descriptions en quelques clics.',
    icon: BellAlertIcon,
  },
  {
    name: 'Suivi en temps réel',
    description: 'Suivez l\'évolution de vos signalements et restez informé des actions entreprises par les services de la ville.',
    icon: ChartBarIcon,
  },
  {
    name: 'Cartographie interactive',
    description: 'Visualisez tous les signalements sur une carte interactive et découvrez les zones qui nécessitent le plus d\'attention.',
    icon: MapPinIcon,
  },
]

export default function HomePage() {
  const [showMap, setShowMap] = useState(false)
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
        <div class="p-2">
          <h3 class="font-bold text-lg">${report.type}</h3>
          <p class="text-sm text-gray-600">${report.description}</p>
          ${report.photo_url ? `<img src="${report.photo_url}" alt="Photo" class="mt-2 rounded-md w-full">` : ''}
          <p class="text-xs text-gray-500 mt-2">
            Statut: ${
              report.status === 'resolved' ? 'Résolu' :
              report.status === 'in_progress' ? 'En cours' : 'Nouveau'
            }
          </p>
        </div>
      `)

      // Ajouter le marqueur à la carte
      const marker = new mapboxgl.Marker(el)
        .setLngLat([report.longitude, report.latitude])
        .setPopup(popup)
        .addTo(map.current)

      markers.current.push(marker)
    })
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
    }
  }

  return (
    <MainLayout>
      {showMap ? (
        <div className="h-[calc(100vh-4rem)]">
          <div className="mb-4 flex items-center justify-between">
            <ReportFilters
              filters={filters}
              onFilterChange={setFilters}
              onLocationFilterChange={(locationFilter) =>
                setFilters({ ...filters, location: locationFilter })
              }
            />
            <button
              onClick={handleLocationFilter}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Filtrer par ma position
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
      ) : (
        <div className="relative isolate">
          {/* Hero section */}
          <div className="relative pt-14">
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
              <div
                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-200 to-primary-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                }}
              />
            </div>

            <div className="py-24 sm:py-32 lg:pb-40">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                    Améliorez votre ville avec SignalHub
                  </h1>
                  <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
                    Participez à l'amélioration de votre cadre de vie en signalant les problèmes urbains.
                    Une solution simple et efficace pour une ville plus agréable.
                  </p>
                  <div className="mt-10 flex items-center justify-center gap-x-6">
                    <button
                      onClick={() => setShowMap(true)}
                      className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                    >
                      Voir la carte des signalements
                    </button>
                    <Link
                      to="/report"
                      className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
                    >
                      Signaler un problème <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features section */}
          <div className="py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl lg:text-center">
                <h2 className="text-base font-semibold leading-7 text-primary-600">Fonctionnalités</h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                  Tout ce dont vous avez besoin pour améliorer votre ville
                </p>
                <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
                  SignalHub vous offre tous les outils nécessaires pour participer activement à l'amélioration de votre environnement urbain.
                </p>
              </div>
              <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                  {features.map((feature) => (
                    <div key={feature.name} className="flex flex-col">
                      <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                        <feature.icon className="h-5 w-5 flex-none text-primary-600" aria-hidden="true" />
                        {feature.name}
                      </dt>
                      <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                        <p className="flex-auto">{feature.description}</p>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  )
}
