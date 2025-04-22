import { Application } from './applications'

export type Collection = Application[]

export type Collections = {
  [key: string]: Collection
}
