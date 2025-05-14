import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import useReportStore from '../context/reportStore'
import { useGeolocation } from '../hooks/useGeolocation'
import MainLayout from '../layouts/MainLayout'
import { uploadImage } from '../utils/cloudinary'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_DESCRIPTION_LENGTH = 500
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const reportTypes = [
  { id: 'road', name: 'Route endommagée' },
  { id: 'electricity', name: 'Coupure d\'électricité' },
  { id: 'waste', name: 'Déchets/Insalubrité' },
  { id: 'water', name: 'Problème d\'eau' },
  { id: 'other', name: 'Autre' },
]

export default function ReportPage() {
  const navigate = useNavigate()
  const { location, error: geoError, loading: geoLoading, getCurrentPosition } = useGeolocation()
  const { createReport, loading } = useReportStore()
  const mapContainer = useRef(null)
  const map = useRef(null)
  
  const [type, setType] = useState('road')
  const [description, setDescription] = useState('')
  const [photo, setPhoto] = useState(null)
  const [error, setError] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)

  // Initialisation et mise à jour de la mini-carte
  useEffect(() => {
    if (location && mapContainer.current) {
      if (!map.current) {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [location.longitude, location.latitude],
          zoom: 15,
          interactive: false
        })

        new mapboxgl.Marker()
          .setLngLat([location.longitude, location.latitude])
          .addTo(map.current)
      } else {
        map.current.setCenter([location.longitude, location.latitude])
        
        // Mettre à jour le marqueur
        const markers = document.getElementsByClassName('mapboxgl-marker')
        if (markers[0]) markers[0].remove()
        
        new mapboxgl.Marker()
          .setLngLat([location.longitude, location.latitude])
          .addTo(map.current)
      }
    }

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [location])

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validation du type de fichier
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setError('Format de fichier non supporté. Utilisez JPG, PNG ou WebP.')
      return
    }

    // Validation de la taille
    if (file.size > MAX_FILE_SIZE) {
      setError('La taille du fichier ne doit pas dépasser 5MB.')
      return
    }

    setError(null)
    setPhoto(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPhotoPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleDescriptionChange = (e) => {
    const value = e.target.value
    if (value.length <= MAX_DESCRIPTION_LENGTH) {
      setDescription(value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!location) {
      setError('La localisation est requise pour créer un signalement')
      return
    }

    if (!description.trim()) {
      setError('Veuillez ajouter une description')
      return
    }

    setError(null)
    const formData = {
      type,
      description: description.trim(),
      latitude: location.latitude,
      longitude: location.longitude,
      status: 'new',
    }

    try {
      // Si une photo est présente, l'uploader vers Cloudinary
      if (photo) {
        const { url } = await uploadImage(photo)
        formData.photo_url = url
      }

      const { error } = await createReport(formData)
      if (error) throw error

      navigate('/')
    } catch (err) {
      setError(err.message || "Une erreur s'est produite lors de l'envoi du signalement")
    }
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Signaler un problème
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Type de problème
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              {reportTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              value={description}
              onChange={handleDescriptionChange}
              rows={4}
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Décrivez le problème en détail..."
              required
            />
            <div className="mt-1 text-sm text-gray-500 flex justify-end">
              {description.length}/{MAX_DESCRIPTION_LENGTH} caractères
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Photo
              <span className="ml-1 text-sm text-gray-500">
                (JPG, PNG ou WebP, max 5MB)
              </span>
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {photoPreview ? (
                  <div className="relative">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="mx-auto h-32 w-auto rounded"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPhoto(null)
                        setPhotoPreview(null)
                      }}
                      className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                        <span>Télécharger une photo</span>
                        <input
                          type="file"
                          accept={ACCEPTED_FILE_TYPES.join(',')}
                          className="sr-only"
                          onChange={handlePhotoChange}
                        />
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Localisation
            </label>
            <div className="mt-1">
              {location ? (
                <>
                  <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                    Latitude: {location.latitude.toFixed(6)}
                    <br />
                    Longitude: {location.longitude.toFixed(6)}
                    <br />
                    Précision: ±{Math.round(location.accuracy)}m
                  </div>
                  <div 
                    ref={mapContainer} 
                    className="h-48 rounded-lg overflow-hidden mb-2"
                  />
                  <button
                    type="button"
                    onClick={getCurrentPosition}
                    className="text-sm text-primary-600 hover:text-primary-500"
                  >
                    Mettre à jour la position
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={getCurrentPosition}
                  disabled={geoLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {geoLoading ? 'Localisation en cours...' : 'Obtenir ma position'}
                </button>
              )}
              {geoError && (
                <p className="mt-2 text-sm text-red-600">{geoError}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !location}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? 'Envoi en cours...' : 'Envoyer le signalement'}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  )
}
