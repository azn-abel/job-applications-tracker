import { Application } from '../types/applications'
import { Collections } from '../types/archive'

import ApplicationsAPI from './applications'
import { downloadCSV } from './io'

const ArchiveAPI = {
  key: 'archive',

  fetchArchive(): Application[] {
    const raw: string | null = localStorage.getItem(this.key)
    return raw ? JSON.parse(raw) : []
  },

  fetchArchiveTags(): string[] {
    const applications = this.fetchArchive()

    const tags = new Set<string>()

    applications.forEach((app) => {
      app.tags.forEach((tag) => {
        tags.add(tag)
      })
    })

    return [...tags]
  },

  archiveApplications(applicationIds: string[]) {
    const applications = ApplicationsAPI.fetchApplications()
    const archive = this.fetchArchive()

    const target: Application[] = []
    const remaining: Application[] = []
    for (const app of applications) {
      if (applicationIds.includes(app.id)) {
        target.push(app)
      } else {
        remaining.push(app)
      }
    }

    localStorage.setItem(this.key, JSON.stringify([...archive, ...target]))
    localStorage.setItem(ApplicationsAPI.key, JSON.stringify(remaining))
  },

  deleteArchivedApplications(applicationIds: string) {
    const archive = this.fetchArchive()

    localStorage.setItem(
      this.key,
      JSON.stringify(archive.filter((app) => !applicationIds.includes(app.id)))
    )
  },
}

export default ArchiveAPI
