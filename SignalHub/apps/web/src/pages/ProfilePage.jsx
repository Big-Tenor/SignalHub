import { useEffect } from 'react'
import useAuthStore from '../context/authStore'
import useReportStore from '../context/reportStore'
import MainLayout from '../layouts/MainLayout'

export default function ProfilePage() {
  const { user } = useAuthStore()
  const { reports, loading, error, fetchReports } = useReportStore()

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const userReports = reports.filter((report) => report.user_id === user?.id)

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
      default:
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Profil Utilisateur
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Informations personnelles et signalements
            </p>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {user?.email}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Nombre de signalements
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {userReports.length}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Mes Signalements
            </h3>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            {error && (
              <div className="p-4 bg-red-50 text-red-700">{error}</div>
            )}
            {loading ? (
              <div className="p-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : userReports.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                Vous n'avez pas encore fait de signalement
              </div>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {userReports.map((report) => (
                  <li key={report.id} className="p-4">
                    <div className="flex items-start space-x-4">
                      {report.photo_url && (
                        <div className="flex-shrink-0">
                          <img
                            src={report.photo_url}
                            alt=""
                            className="h-16 w-16 object-cover rounded"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {report.type}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {report.description}
                        </p>
                        <div className="mt-2 flex items-center space-x-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                              report.status
                            )}`}
                          >
                            {report.status === 'resolved'
                              ? 'Résolu'
                              : report.status === 'in_progress'
                              ? 'En cours'
                              : 'Nouveau'}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(report.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
