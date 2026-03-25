import { getFirestore as getClientFirestore, type Firestore } from "firebase/firestore"

import { getFirebaseApp } from "./firebase"

let dbInstance: Firestore | null = null

export const getDb = (): Firestore => {
  if (!dbInstance) {
    const app = getFirebaseApp()
    dbInstance = getClientFirestore(app)
  }

  return dbInstance
}
