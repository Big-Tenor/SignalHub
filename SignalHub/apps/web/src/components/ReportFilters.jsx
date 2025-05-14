import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { FunnelIcon } from '@heroicons/react/24/outline'

const reportTypes = [
  { id: 'road', name: 'Route endommagée' },
  { id: 'electricity', name: 'Coupure d\'électricité' },
  { id: 'waste', name: 'Déchets/Insalubrité' },
  { id: 'water', name: 'Problème d\'eau' },
  { id: 'other', name: 'Autre' },
]

const reportStatuses = [
  { id: 'new', name: 'Nouveau' },
  { id: 'in_progress', name: 'En cours' },
  { id: 'resolved', name: 'Résolu' },
]

export default function ReportFilters({
  filters,
  onFilterChange,
  onLocationFilterChange,
  className = '',
}) {
  const handleTypeChange = (type) => {
    onFilterChange({ ...filters, type: type === filters.type ? null : type })
  }

  const handleStatusChange = (status) => {
    onFilterChange({ ...filters, status: status === filters.status ? null : status })
  }

  const handleRadiusChange = (event) => {
    const radius = parseInt(event.target.value)
    if (filters.location) {
      onLocationFilterChange({
        ...filters.location,
        radius,
      })
    }
  }

  return (
    <Popover className={`relative ${className}`}>
      {({ open }) => (
        <>
          <Popover.Button
            className={`
              ${open ? 'text-primary-600' : 'text-gray-700 dark:text-gray-300'}
              group inline-flex items-center px-3 py-2 text-sm font-medium hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            `}
          >
            <FunnelIcon
              className="mr-2 h-5 w-5 flex-none"
              aria-hidden="true"
            />
            Filtres
            {(filters.type || filters.status || filters.location) && (
              <span className="ml-2 flex h-2 w-2 rounded-full bg-primary-600" />
            )}
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0">
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="relative bg-white dark:bg-gray-800 p-7">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Type de problème
                      </h3>
                      <div className="mt-2 space-y-2">
                        {reportTypes.map((type) => (
                          <button
                            key={type.id}
                            onClick={() => handleTypeChange(type.id)}
                            className={`
                              ${
                                filters.type === type.id
                                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-400'
                                  : 'text-gray-700 hover:text-primary-600 dark:text-gray-300'
                              }
                              block w-full text-left px-3 py-2 text-sm rounded-md
                            `}
                          >
                            {type.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Statut
                      </h3>
                      <div className="mt-2 space-y-2">
                        {reportStatuses.map((status) => (
                          <button
                            key={status.id}
                            onClick={() => handleStatusChange(status.id)}
                            className={`
                              ${
                                filters.status === status.id
                                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-400'
                                  : 'text-gray-700 hover:text-primary-600 dark:text-gray-300'
                              }
                              block w-full text-left px-3 py-2 text-sm rounded-md
                            `}
                          >
                            {status.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {filters.location && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          Rayon de recherche
                        </h3>
                        <div className="mt-2">
                          <select
                            value={filters.location.radius || 10}
                            onChange={handleRadiusChange}
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700"
                          >
                            <option value="1">1 km</option>
                            <option value="5">5 km</option>
                            <option value="10">10 km</option>
                            <option value="20">20 km</option>
                            <option value="50">50 km</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}
