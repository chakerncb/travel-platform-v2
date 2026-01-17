import NewsletterSubscribe from '../elements/NewsletterSubscribe'

export default function Subscriber2() {
    return (
        <>
            <section className="section-box box-subscriber background-body">
                <div className="container">
                    <div className="block-subscriber">
                        <div className="subscriber-left"><span className="btn btn-brand-secondary">Join our newsletter</span>
                            <h5 className="mt-15 mb-30 neutral-1000">Subscribe to see secret deals prices drop the moment you
                                sign up!</h5>
                            <NewsletterSubscribe />
                        </div>
                        <div className="subscriber-right" />
                    </div>
                </div>
            </section>
        </>
    )
}
