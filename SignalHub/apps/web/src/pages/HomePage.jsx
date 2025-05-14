import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import useReportStore from '../context/reportStore'
import MainLayout from '../layouts/MainLayout'

// Configuration de Mapbox
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

export default function HomePage() {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const { reports, loading, error, fetchReports, subscribeToReports } = useReportStore()

  useEffect(() => {
    // Initialisation de la carte
    if (map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12/sdk=js-3.12.0',
      center: [-13.7, 9.5], // Centre sur la Guinée
      zoom: 6,
    })

    // Contrôles de navigation
    map.current.addControl(new mapboxgl.NavigationControl())
    map.current.addControl(new mapboxgl.FullscreenControl())

    // Chargement des données
    fetchReports()

    // Abonnement aux mises à jour en temps réel
    const unsubscribe = subscribeToReports()

    return () => {
      unsubscribe()
      map.current?.remove()
    }
  }, [])

  // Mise à jour des marqueurs quand les reports changent
  useEffect(() => {
    if (!map.current || !reports.length) return

    // Supprimer les marqueurs existants
    const markers = document.getElementsByClassName('mapboxgl-marker')
    while (markers[0]) {
      markers[0].remove()
    }

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
      new mapboxgl.Marker(el)
        .setLngLat([report.longitude, report.latitude])
        .setPopup(popup)
        .addTo(map.current)
    })
  }, [reports])

  return (
    <MainLayout>
      <div className="h-[calc(100vh-4rem)]">
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md mb-4">
            {error}
          </div>
        )}
        <div ref={mapContainer} className="w-full h-full rounded-lg overflow-hidden">
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
