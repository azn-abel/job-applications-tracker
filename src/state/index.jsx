import { atom } from "jotai";

export const selectedRowsAtom = atom([]);

export const rowsAtom = atom([]);

export const uniqueJobTitlesAtom = atom((get) => [
  ...new Set(get(rowsAtom).map((row) => row.jobTitle)),
]);

export const uniqueCompaniesAtom = atom((get) => [
  ...new Set(get(rowsAtom).map((row) => row.company)),
]);
