import { Link } from 'react-router-dom'
import { MapPinIcon, BellAlertIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import MainLayout from '../layouts/MainLayout'

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
  return (
    <MainLayout>
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
                  <Link
                    to="/map"
                    className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  >
                    Voir la carte des signalements
                  </Link>
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

        {/* Statistics section */}
        <div className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:max-w-none">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                  Notre impact sur la communauté
                </h2>
                <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-400">
                  Des résultats concrets pour une ville plus agréable
                </p>
              </div>
              <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col bg-gray-400/5 p-8">
                  <dt className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-400">Signalements résolus</dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">2,500+</dd>
                </div>
                <div className="flex flex-col bg-gray-400/5 p-8">
                  <dt className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-400">Utilisateurs actifs</dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">15,000+</dd>
                </div>
                <div className="flex flex-col bg-gray-400/5 p-8">
                  <dt className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-400">Quartiers couverts</dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">50+</dd>
                </div>
                <div className="flex flex-col bg-gray-400/5 p-8">
                  <dt className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-400">Temps de résolution moyen</dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">48h</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
