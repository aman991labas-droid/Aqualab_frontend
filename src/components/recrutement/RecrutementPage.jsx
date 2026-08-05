'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Briefcase, FileText, CheckCircle, UploadCloud } from 'lucide-react'
import toast from 'react-hot-toast'
import PageHero from '@/components/layout/PageHero'
import { PageTransition, SlideInLeft, SlideInRight } from '@/components/ui/Animations'
import { parseApplicationPayload, submitApplication } from '@/services/forms'
import '@/components/contact/Contact.css'
import './Recrutement.css'

export default function RecrutementPage() {
    const formRef = useRef(null)
    const [sending, setSending] = useState(false)
    const [success, setSuccess] = useState(false)
    const [errors, setErrors] = useState({})
    const [fileName, setFileName] = useState('')

    const validate = (data) => {
        const e = {}
        if (!data.name?.trim()) e.name = 'Veuillez entrer votre nom.'
        if (!data.email?.trim()) e.email = 'Veuillez entrer votre email.'
        else if (!/\S+@\S+\.\S+/.test(data.email)) e.email = 'Email invalide.'
        if (!data.message?.trim()) e.message = 'Veuillez entrer une lettre de motivation.'
        return e
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFileName(file.name)
        } else {
            setFileName('')
        }
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
            const cvFile = form.querySelector('#cvFile')?.files?.[0] ?? null
            await submitApplication({
                form,
                payload: parseApplicationPayload(data, cvFile),
            })
            setSuccess(true)
            form.reset()
            setFileName('')
            toast.success('Candidature envoyée avec succès !')
        } catch {
            toast.error('Une erreur est survenue. Veuillez réessayer.')
        } finally {
            setSending(false)
        }
    }

    return (
        <PageTransition>
            <PageHero
                title="Rejoignez notre équipe"
                subtitle="Vous souhaitez évoluer au sein d'une entreprise innovante spécialisée dans les solutions industrielles, didactiques et de laboratoire ? Découvrez nos opportunités de carrière ou transmettez-nous votre candidature spontanée."
                tag="Recrutement"
                breadcrumbs={[{ label: 'Recrutement' }]}
            />

            <section className="contact-page section-py">
                <div className="container">
                    <div className="contact-grid">
                        <SlideInLeft>
                            <div className="contact-info">
                                <h2 className="contact-info__title">Candidature Spontanée</h2>
                                <p className="contact-info__desc">
                                    Aqualab Technologie est toujours à la recherche de nouveaux talents.
                                    Ingénieurs, techniciens supérieurs, profil commercial...
                                    <br /><br />
                                    N'hésitez pas à nous envoyer votre <strong>CV</strong> ainsi que votre <strong>lettre de motivation</strong>.
                                    Notre service des ressources humaines étudiera votre profil avec la plus grande attention.
                                </p>

                                <div className="contact-info__list" style={{ marginTop: '2rem' }}>
                                    <div className="contact-info__item">
                                        <div className="contact-info__icon" aria-hidden="true">
                                            <Briefcase size={20} />
                                        </div>
                                        <div>
                                            <span className="contact-info__label">Domaines de compétence</span>
                                            <span className="contact-info__value">Technique, Commercial, Administratif</span>
                                        </div>
                                    </div>
                                    <div className="contact-info__item">
                                        <div className="contact-info__icon" aria-hidden="true">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <span className="contact-info__label">Processus de recrutement</span>
                                            <span className="contact-info__value">Analyse du CV, Entretien RH, Entretien Technique</span>
                                        </div>
                                    </div>
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
                                            <h3>Candidature envoyée !</h3>
                                            <p>Merci pour votre intérêt. Nous reviendrons vers vous si votre profil correspond à nos besoins.</p>
                                            <button type="button" className="btn btn-primary" onClick={() => { setSuccess(false); setFileName('') }}>
                                                Envoyer une autre candidature
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <motion.form
                                            key="form"
                                            ref={formRef}
                                            onSubmit={handleSubmit}
                                            noValidate
                                            className="contact-form"
                                            aria-label="Formulaire de candidature"
                                        >
                                            <h2 className="contact-form__title">Postulez maintenant</h2>

                                            <div className="contact-form__row">
                                                <div className="form-group">
                                                    <label htmlFor="recrutement-name" className="form-label">Nom complet <span aria-hidden="true">*</span></label>
                                                    <input
                                                        id="recrutement-name" name="name" type="text"
                                                        className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                                                        placeholder="Ex: Mohamed Alami"
                                                        required
                                                    />
                                                    {errors.name && <span className="form-error" role="alert">{errors.name}</span>}
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="recrutement-email" className="form-label">Email <span aria-hidden="true">*</span></label>
                                                    <input
                                                        id="recrutement-email" name="email" type="email"
                                                        className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                                                        placeholder="exemple@email.com"
                                                        required
                                                    />
                                                    {errors.email && <span className="form-error" role="alert">{errors.email}</span>}
                                                </div>
                                            </div>

                                            <div className="contact-form__row">
                                                <div className="form-group">
                                                    <label htmlFor="recrutement-tel" className="form-label">Téléphone</label>
                                                    <input
                                                        id="recrutement-tel" name="tel" type="tel"
                                                        className="form-input"
                                                        placeholder="Ex: 06 12 34 56 78"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="jobType" className="form-label">Votre specialité</label>
                                                    <input id="jobType" name="jobType" className="form-input" placeholder="Ex: Ingénierie & Technique" />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label">Curriculum Vitae (CV)</label>
                                                <div className="file-upload-wrapper">
                                                    <input
                                                        type="file"
                                                        id="cvFile"
                                                        name="cvFile"
                                                        accept=".pdf,.doc,.docx"
                                                        onChange={handleFileChange}
                                                        className="file-input-hidden"
                                                    />
                                                    <label htmlFor="cvFile" className="btn btn-outline-dark file-upload-btn">
                                                        <UploadCloud size={18} />
                                                        {fileName ? 'Modifier le CV' : 'Joindre mon CV'}
                                                    </label>
                                                    {fileName && <span className="file-name">{fileName}</span>}
                                                </div>
                                                <small className="file-upload-hint">
                                                    Formats acceptés : PDF, DOC, DOCX. Max 5Mo.
                                                </small>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="recrutement-message" className="form-label">Message / Lettre de motivation <span aria-hidden="true">*</span></label>
                                                <textarea
                                                    id="recrutement-message" name="message"
                                                    className={`form-input form-textarea ${errors.message ? 'form-input--error' : ''}`}
                                                    placeholder="Parlez-nous de vos motivations..."
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
                                                        Envoyer ma candidature
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
