'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MapPin, Phone, Mail, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import PageHero from '@/components/layout/PageHero'
import { PageTransition, SlideInLeft, SlideInRight } from '@/components/ui/Animations'
import { Linkedin } from '@/components/ui/SocialIcons'
import { parseContactPayload, submitContact } from '@/services/forms'
import './Contact.css'

const contactInfo = [
    {
        icon: MapPin,
        label: 'Adresse',
        value: '409, Ambassadeur Ben Aicha, Roches Noires, Casablanca – Maroc',
        href: 'https://maps.app.goo.gl/kb8kMKr1e1NRfcMi7',
        external: true,
    },
    { icon: Phone, label: 'Téléphone', value: '05 22 30 96 50', href: 'tel:+212522309650' },
    { icon: Mail, label: 'Email', value: 'info@aqualab.ma', href: 'mailto:info@aqualab.ma' },
    {
        icon: Linkedin,
        label: 'LinkedIn',
        value: 'Aqualab Technologie',
        href: 'https://www.linkedin.com/company/aqualab-technologie/',
        external: true,
    },
]

const breadcrumbs = [{ label: 'Contact' }]

export default function ContactPage() {
    const formRef = useRef(null)
    const [sending, setSending] = useState(false)
    const [success, setSuccess] = useState(false)
    const [errors, setErrors] = useState({})

    const validate = (data) => {
        const e = {}
        if (!data.name?.trim()) e.name = 'Veuillez entrer votre nom.'
        if (!data.email?.trim()) e.email = 'Veuillez entrer votre email.'
        else if (!/\S+@\S+\.\S+/.test(data.email)) e.email = 'Email invalide.'
        if (!data.message?.trim()) e.message = 'Veuillez entrer votre message.'
        return e
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const form = formRef.current
        const data = Object.fromEntries(new FormData(form))
        const errs = validate(data)

        if (Object.keys(errs).length) {
            setErrors(errs)
            return
        }
        setErrors({})
        setSending(true)

        try {
            await submitContact({
                form,
                payload: parseContactPayload(data),
            })
            setSuccess(true)
            form.reset()
            toast.success('Message envoyé avec succès !')
        } catch {
            toast.error('Une erreur est survenue. Veuillez réessayer.')
        } finally {
            setSending(false)
        }
    }

    return (
        <PageTransition>
            <PageHero
                title="Contactez-Nous"
                subtitle="Notre équipe d'experts est à votre disposition pour répondre à toutes vos demandes."
                tag="Nous contacter"
                breadcrumbs={breadcrumbs}
            />

            <section className="contact-page section-py">
                <div className="container">
                    <div className="contact-grid">
                        <SlideInLeft>
                            <div className="contact-info">
                                <h2 className="contact-info__title">Parlons de votre projet</h2>
                                <p className="contact-info__desc">
                                    Que vous ayez besoin d'un devis, d'informations techniques ou d'une assistance,
                                    notre équipe est disponible pour vous accompagner.
                                </p>

                                <div className="contact-info__list">
                                    {contactInfo.map(({ icon: Icon, label, value, href, external }) => (
                                        <a
                                            key={label}
                                            href={href}
                                            className="contact-info__item"
                                            target={external ? '_blank' : undefined}
                                            rel={external ? 'noreferrer noopener' : undefined}
                                            aria-label={`${label}: ${value}`}
                                        >
                                            <div className="contact-info__icon" aria-hidden="true">
                                                <Icon size={20} />
                                            </div>
                                            <div>
                                                <span className="contact-info__label">{label}</span>
                                                <span className="contact-info__value">{value}</span>
                                            </div>
                                        </a>
                                    ))}
                                </div>

                                <div className="contact-info__map">
                                    <iframe
                                        title="Localisation Aqualab Technologie"
                                        src="https://www.google.com/maps?q=AQUALAB+TECHNOLOGIE,33.6028757,-7.582271&z=17&output=embed"
                                        width="100%"
                                        height="200"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>
                            </div>
                        </SlideInLeft>

                        <SlideInRight delay={0.1}>
                            <div className="contact-form-wrap">
                                <AnimatePresence mode="wait">
                                    {success ? (
                                        <motion.div
                                            key="success"
                                            className="contact-success"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <CheckCircle size={56} className="contact-success__icon" aria-hidden="true" />
                                            <h3>Message envoyé !</h3>
                                            <p>Merci pour votre message. Nous vous répondrons dans les plus brefs délais.</p>
                                            <button type="button" className="btn btn-primary" onClick={() => setSuccess(false)}>
                                                Envoyer un autre message
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <motion.form
                                            key="form"
                                            ref={formRef}
                                            onSubmit={handleSubmit}
                                            noValidate
                                            className="contact-form"
                                            aria-label="Formulaire de contact"
                                        >
                                            <h2 className="contact-form__title">Envoyez-nous un message</h2>

                                            <div className="contact-form__row">
                                                <div className="form-group">
                                                    <label htmlFor="name" className="form-label">Nom complet <span aria-hidden="true">*</span></label>
                                                    <input
                                                        id="name" name="name" type="text"
                                                        className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                                                        placeholder="Ex: Mohamed Alami"
                                                        autoComplete="name"
                                                        required
                                                    />
                                                    {errors.name && <span className="form-error" role="alert">{errors.name}</span>}
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="tel" className="form-label">Téléphone</label>
                                                    <input
                                                        id="tel" name="tel" type="tel"
                                                        className="form-input"
                                                        placeholder="Ex: 05 22  XX XX XX"
                                                        autoComplete="tel"
                                                    />
                                                </div>
                                            </div>

                                            <div className="contact-form__row">
                                                <div className="form-group">
                                                    <label htmlFor="company" className="form-label">Entreprise</label>
                                                    <input
                                                        id="company" name="company" type="text"
                                                        className="form-input"
                                                        placeholder="Nom de votre entreprise"
                                                        autoComplete="organization"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="email" className="form-label">Email <span aria-hidden="true">*</span></label>
                                                    <input
                                                        id="email" name="email" type="email"
                                                        className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                                                        placeholder="exemple@entreprise.ma"
                                                        autoComplete="email"
                                                        required
                                                    />
                                                    {errors.email && <span className="form-error" role="alert">{errors.email}</span>}
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="message" className="form-label">Message <span aria-hidden="true">*</span></label>
                                                <textarea
                                                    id="message" name="message"
                                                    className={`form-input form-textarea ${errors.message ? 'form-input--error' : ''}`}
                                                    placeholder="Décrivez votre besoin, le type d'équipement recherché..."
                                                    rows={5}
                                                    required
                                                />
                                                {errors.message && <span className="form-error" role="alert">{errors.message}</span>}
                                            </div>

                                            <button
                                                type="submit"
                                                className="btn btn-primary btn-lg contact-form__submit"
                                                disabled={sending}
                                                aria-busy={sending}
                                            >
                                                {sending ? (
                                                    <>
                                                        <span className="contact-form__spinner" aria-hidden="true" />
                                                        Envoi en cours...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send size={18} aria-hidden="true" />
                                                        Envoyer le message
                                                    </>
                                                )}
                                            </button>
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            </div>
                        </SlideInRight>
                    </div>
                </div>
            </section>
        </PageTransition>
    )
}
