'use client'
import ByActivities from '@/src/components/Filter/ByActivities'
import ByAttraction from '@/src/components/Filter/ByAttraction'
import ByDuration from '@/src/components/Filter/ByDuration'
import ByGroupSize from '@/src/components/Filter/ByGroupSize'
import ByLanguage from '@/src/components/Filter/ByLanguage'
import ByName from '@/src/components/Filter/ByName'
import ByPagination from '@/src/components/Filter/ByPagination'
import ByPrice from '@/src/components/Filter/ByPrice'
import ByRating from '@/src/components/Filter/ByRating'
import SortToursFilter from '@/src/components/elements/SortToursFilter'
import Layout from '@/src/components/layout/Layout'
import rawToursData from "@/src/util/tours.json"
import useTourFilter from '@/src/util/useTourFilter'
import React from 'react'


const toursData = rawToursData.map(tour => ({
	...tour,
	duration: parseFloat(tour.duration as string),
	groupSize: parseInt(tour.groupSize as unknown as string),
	rating: parseFloat(tour.rating as string)
}))

const ToursFilter: React.FC = () => {
	const {
		filter,
		setFilter,
		sortCriteria,
		setSortCriteria,
		itemsPerPage,
		setItemsPerPage,
		currentPage,
		setCurrentPage,
		uniqueNames,
		uniqueActivities,
		uniqueLanguages,
		uniqueAttractions,
		uniqueRatings,
		uniqueDurations,
		uniqueGroupSizes,
		filteredTours,
		sortedTours,
		totalPages,
		startIndex,
		endIndex,
		paginatedTours,
		handleCheckboxChange,
		handleSortChange,
		handlePriceRangeChange,
		handleDurationRangeChange,
		handleItemsPerPageChange,
		handlePageChange,
		handlePreviousPage,
		handleNextPage,
		handleClearFilters,
		startItemIndex,
		endItemIndex,
	} = useTourFilter(toursData)
	return (
		<>
			<Layout headerStyle={1} footerStyle={1}>
				<div className='container'>
					<div className="row">
						<div className="col-xl-4">
							<ByName
								uniqueNames={uniqueNames}
								filter={filter}
								handleCheckboxChange={handleCheckboxChange}
							/>
							<ByActivities
								uniqueActivities={uniqueActivities}
								filter={filter}
								handleCheckboxChange={handleCheckboxChange}
							/>
							<ByLanguage
								uniqueLanguages={uniqueLanguages}
								filter={filter}
								handleCheckboxChange={handleCheckboxChange}
							/>
							<ByAttraction
								uniqueAttractions={uniqueAttractions}
								filter={filter}
								handleCheckboxChange={handleCheckboxChange}
							/>
							<ByGroupSize
								uniqueGroupSizes={uniqueGroupSizes}
								filter={filter}
								handleCheckboxChange={handleCheckboxChange}
							/>
							<ByDuration
								filter={filter}
								handleDurationRangeChange={handleDurationRangeChange}
							/>
							<ByPrice filter={filter} handlePriceRangeChange={handlePriceRangeChange} />
							<ByRating
								uniqueRatings={uniqueRatings}
								filter={filter}
								handleCheckboxChange={handleCheckboxChange}
							/>

						</div>
						<div className="col-xl-8">
							<SortToursFilter
								sortCriteria={sortCriteria}
								handleSortChange={handleSortChange}
								itemsPerPage={itemsPerPage}
								handleItemsPerPageChange={handleItemsPerPageChange}
								handleClearFilters={handleClearFilters}
								startItemIndex={startItemIndex}
								endItemIndex={endItemIndex}
								sortedTours={sortedTours}
							/>



							<ul>
								{paginatedTours.map((tour) => (
									<li key={tour.id}>
										{tour.name}, {tour.activities}, {tour.language}, {tour.attraction}, ${tour.price}, {tour.duration} days, {tour.rating} stars
									</li>
								))}
							</ul>
							<ByPagination
								handlePreviousPage={handlePreviousPage}
								totalPages={totalPages}
								currentPage={currentPage}
								handleNextPage={handleNextPage}
								handlePageChange={handlePageChange} />
						</div>
					</div>
				</div>
			</Layout>
		</>
	)
}

export default ToursFilter
