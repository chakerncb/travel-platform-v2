
import BlogPost from '@/src/components/blog/BlogPost'
import Layout from '@/src/components/layout/Layout'

export default function Blog() {
    return (
        <>
            <Layout>
                <BlogPost showItem={6} style={1} showPagination />
            </Layout>
        </>
    )
}
