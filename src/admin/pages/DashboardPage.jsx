'use client'

import { useEffect, useState } from 'react'
import { categoryService } from '../services/categoryService'
import { productService } from '../services/productService'
import { newsService } from '../services/newsService'
import { applicationService } from '../services/applicationService'
import { contactService } from '../services/contactService'
import { newsletterService } from '../services/newsletterService'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorState from '../components/ui/ErrorState'

function StatCard({ label, value }) {
  return (
    <div className="admin-stat card">
      <div className="card-body">
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState({
    categories: [],
    productGroups: [],
    articles: [],
    applications: [],
    contactMessages: [],
    newsletterStats: { total: 0, active: 0, unsubscribed: 0 },
  })

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [categories, productGroups, articles, applications, contactMessages, newsletterResult] = await Promise.all([
        categoryService.getCategories(),
        productService.getCategoryGroups(),
        newsService.getNews(),
        applicationService.getApplications(),
        contactService.getMessages(),
        newsletterService.getSubscribers({ perPage: 1 }),
      ])
      setData({
        categories,
        productGroups,
        articles,
        applications,
        contactMessages,
        newsletterStats: newsletterResult.stats || { total: 0, active: 0, unsubscribed: 0 },
      })
    } catch {
      setError('Chargement du dashboard impossible.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) return <LoadingSpinner label="Chargement dashboard..." />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <section className="admin-page">
      <h1>Dashboard</h1>
      <div className="admin-stats-grid">
        <StatCard label="Groupes produits" value={data.productGroups.length} />
        <StatCard label="Catégories blog" value={data.categories.length} />
        <StatCard label="Articles" value={data.articles.length} />
        <StatCard label="Abonnés newsletter" value={data.newsletterStats.active} />
        <StatCard label="Messages contact" value={data.contactMessages.filter((m) => !m.isRead).length} />
        <StatCard label="Candidatures" value={data.applications.length} />
      </div>

      <div className="admin-panels-grid">
        <div className="card card-body">
          <h3>Groupes produits récents</h3>
          <ul>
            {data.productGroups.slice(0, 5).map((item) => (
              <li key={`${item.tabId}-${item.categoryIndex}`}>
                {item.title} <small>({item.tabLabel})</small>
              </li>
            ))}
          </ul>
        </div>
        <div className="card card-body">
          <h3>Articles récents</h3>
          <ul>{data.articles.slice(0, 5).map((item) => <li key={item.id}>{item.title}</li>)}</ul>
        </div>
        <div className="card card-body">
          <h3>Messages contact récents</h3>
          <ul>
            {data.contactMessages.slice(0, 5).map((item) => (
              <li key={item.id}>
                {item.name} {!item.isRead && <small style={{ color: '#b30006' }}>(non lu)</small>}
              </li>
            ))}
          </ul>
        </div>
        <div className="card card-body">
          <h3>Candidatures récentes</h3>
          <ul>{data.applications.slice(0, 5).map((item) => <li key={item.id}>{item.name}</li>)}</ul>
        </div>
      </div>
    </section>
  )
}
