import { Collections } from '../types/archive'

import ApplicationsAPI from './applications'
import { downloadCSV } from './io'

const ArchiveAPI = {
  key: 'archive',

  fetchArchive(): Collections {
    const raw: string | null = localStorage.getItem(this.key)
    return raw ? JSON.parse(raw) : {}
  },

  fetchCollection(name: string | null) {
    if (!name) {
      throw Error('No name provided')
    }
    const archives = this.fetchArchive()
    if (name === 'All') {
      return Object.values(archives).reduce(
        (prev, curr) => [...prev, ...curr],
        []
      )
    }
    if (!archives[name]) throw Error('No archive found with name ' + name)
    return archives[name]
  },

  archiveCollection(name: string) {
    if (!name || name.trim() === '')
      throw Error('Archive name cannot be empty or whitespace')
    if (name.length > 50)
      throw Error('Archive name cannot be longer than 50 characters')
    if (!/^[a-zA-Z0-9 ]+$/.test(name))
      throw Error(
        'Archive name can only contain alphanumeric characters and spaces'
      )

    const applications = ApplicationsAPI.fetchApplications()
    const archives = this.fetchArchive()

    if (archives[name])
      throw Error('Archive with name ' + name + ' already exists')

    archives[name] = applications

    localStorage.setItem(this.key, JSON.stringify(archives))
    localStorage.setItem(ApplicationsAPI.key, '[]')
  },

  deleteCollection(name: string) {
    const archives = this.fetchArchive()

    if (!archives[name]) throw Error('No archive found with name ' + name)

    delete archives[name]

    localStorage.setItem(this.key, JSON.stringify(archives))
  },

  renameArchive(oldName: string, newName: string) {
    const archives = this.fetchArchive()

    if (!archives[oldName]) throw Error('No archive found with name ' + oldName)
    if (archives[newName] && newName !== oldName)
      throw Error('Archive with name ' + newName + ' already exists')

    const data = JSON.parse(JSON.stringify(archives[oldName]))
    delete archives[oldName]
    archives[newName] = data

    localStorage.setItem(this.key, JSON.stringify(data))
  },

  downloadCollection(name: string | null) {
    if (!name) throw Error('no name provided')
    const collection = this.fetchCollection(name)

    if (!collection) throw Error('No archive found with name ' + name)

    downloadCSV(collection, `Archived Job Applications - ${name}.csv`)
  },
}

export default ArchiveAPI
