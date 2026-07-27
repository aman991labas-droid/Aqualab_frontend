import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SkipToContent from '@/components/layout/SkipToContent'
import { getAllCategories } from '@/lib/server-data'
import ChatbotClient from '@/components/Chatbot/ChatbotClient'

export default async function SiteLayout({ children }) {
    const categories = await getAllCategories()

    return (
        <>
            <SkipToContent />
            <Navbar />
            <main id="main-content" tabIndex={-1}>
                {children}
            </main>
            <ChatbotClient />
            <Footer productCategories={categories} />
        </>
    )
}
