import { Application, ApplicationDTO, DateString } from '../types/applications'

const ApplicationsAPI = {
  key: 'applications',

  fetchApplications(): Application[] {
    const raw = localStorage.getItem(this.key)
    return raw ? JSON.parse(raw) : []
  },

  postApplication(application: ApplicationDTO) {
    const newApp: Application | null = validateApplication(application)
    if (!newApp) return

    const applications = this.fetchApplications()
    applications.push(newApp)
    localStorage.setItem(this.key, JSON.stringify(applications))
    return newApp
  },

  putApplication(id: string, application: ApplicationDTO) {
    const newApp = validateApplication({ id, ...application })
    if (!newApp) return

    const applications = this.fetchApplications()
    const updated = applications.map((app) => (app.id === id ? newApp : app))
    localStorage.setItem(this.key, JSON.stringify(updated))
    return updated.find((app) => app.id === id)
  },

  deleteApplication(id: string) {
    const applications = this.fetchApplications()
    const filtered = applications.filter((app) => app.id !== id)
    localStorage.setItem(this.key, JSON.stringify(filtered))
  },
}

function validateApplication(application: ApplicationDTO): Application | null {
  if (
    !application ||
    !application.jobTitle ||
    !application.company ||
    !application.status ||
    !application.applicationDate ||
    !application.tags
  )
    return null

  const { jobTitle, company, status, applicationDate, tags } = application

  const newApp = {
    id: application.id || crypto.randomUUID(),
    jobTitle,
    company,
    status,
    tags,
    applicationDate,
    interviewDate: application.interviewDate || ('' as DateString),
    jobDescription:
      application.jobDescription && application.jobDescription !== 'null'
        ? application.jobDescription
        : '',
  }

  return newApp
}

export default ApplicationsAPI
