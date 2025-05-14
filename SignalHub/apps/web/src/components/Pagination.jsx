import { useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onLimitChange,
  className = '',
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  
  // Mettre à jour la page si elle est invalide
  useEffect(() => {
    if (currentPage > totalPages) {
      onPageChange(totalPages)
    }
  }, [currentPage, totalPages, onPageChange])

  // Générer la liste des pages à afficher
  const getPageNumbers = () => {
    const delta = 2 // Nombre de pages à afficher avant/après la page courante
    const pages = []
    
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      pages.push(i)
    }

    // Ajouter les ellipses si nécessaire
    if (currentPage - delta > 2) {
      pages.unshift('...')
    }
    if (currentPage + delta < totalPages - 1) {
      pages.push('...')
    }

    // Toujours afficher la première et la dernière page
    if (totalPages > 1) {
      pages.unshift(1)
      pages.push(totalPages)
    }

    return pages
  }

  if (totalItems <= itemsPerPage) return null

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex flex-1 items-center justify-between">
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Affichage de{' '}
            <span className="font-medium">
              {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}
            </span>{' '}
            à{' '}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, totalItems)}
            </span>{' '}
            sur <span className="font-medium">{totalItems}</span> résultats
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed dark:ring-gray-600 dark:hover:bg-gray-700"
            >
              <span className="sr-only">Précédent</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            
            {getPageNumbers().map((pageNumber, index) => (
              pageNumber === '...' ? (
                <span
                  key={`ellipsis-${index}`}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0 dark:text-gray-300 dark:ring-gray-600"
                >
                  ...
                </span>
              ) : (
                <button
                  key={pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    pageNumber === currentPage
                      ? 'z-10 bg-primary-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                      : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:text-gray-300 dark:ring-gray-600 dark:hover:bg-gray-700'
                  }`}
                >
                  {pageNumber}
                </button>
              )
            ))}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed dark:ring-gray-600 dark:hover:bg-gray-700"
            >
              <span className="sr-only">Suivant</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}
