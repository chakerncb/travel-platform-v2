import Layout from "@/src/components/layout/Layout"

import Category from "@/src/components/sections/Category"
import FilterSearch from "@/src/components/sections/FilterSearch"
import Flights1 from "@/src/components/sections/Flights1"
import News1 from "@/src/components/sections/News1"
import Payments1 from "@/src/components/sections/Payments1"
import PopularDestinations1 from "@/src/components/sections/PopularDestinations1"
import Subscriber1 from "@/src/components/sections/Subscriber1"
import Testimonials1 from "@/src/components/sections/Testimonials1"
import TopRated1 from "@/src/components/sections/TopRated1"
import WhyChooseUs1 from "@/src/components/sections/WhyChooseUs1"
import YourJourney from "@/src/components/sections/YourJourney"
export default function Home() {

    return (
        <>

            <Layout headerStyle={1} footerStyle={1}>
                <FilterSearch />
                <YourJourney />
                <PopularDestinations1 />
                <TopRated1 />
                <WhyChooseUs1 />
                {/* <Flights1 /> */}
                {/* <Category /> */}
                <Payments1 />
                <Testimonials1 />
                <News1 />
                <Subscriber1 />
            </Layout>
        </>
    )
}