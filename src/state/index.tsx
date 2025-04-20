import { Application } from '../types/applications'

import { atom } from 'jotai'

export const selectedRowsAtom = atom<string[]>([])

export const rowsAtom = atom<Application[]>([])

export const uniqueJobTitlesAtom = atom((get) => [
  ...new Set(get(rowsAtom).map((row) => row.jobTitle)),
])

export const uniqueCompaniesAtom = atom((get) => [
  ...new Set(get(rowsAtom).map((row) => row.company)),
])
