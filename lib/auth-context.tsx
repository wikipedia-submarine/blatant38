"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from "firebase/auth"
import { getAuthWithPersistence } from "./firebase"

interface User {
  uid: string
  email: string | null
  displayName: string | null
}

interface UserProfile {
  uid: string
  email: string | null
  displayName: string | null
  isAdmin: boolean
  photoURL: string | null
  bio?: string
  createdAt?: string
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  logout: () => Promise<void>
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// List of admin UUIDs
const ADMIN_UIDS = [
  "jVy9P9PaBMhZNCiOU89BoclQmqf1",
]

// List of allowed user UUIDs
const ALLOWED_UIDS = [
  "jVy9P9PaBMhZNCiOU89BoclQmqf1",
  "Z7spj3PqYzV9Bvh75wLQ3HSDKEU2",
]

const loadFirestoreHelpers = async () => {
  const [{ doc, getDoc, setDoc, updateDoc }, { getDb }] = await Promise.all([
    import("firebase/firestore"),
    import("./firestore"),
  ])

  return { doc, getDoc, setDoc, updateDoc, getDb }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  // Set up Firebase Auth state listener - this no longer blocks render
  useEffect(() => {
    let mounted = true;

    const setupAuth = async () => {
      try {
        const authInstance = await getAuthWithPersistence();

        const unsubscribe = onAuthStateChanged(authInstance, (firebaseUser) => {
          if (!mounted) return;

          if (firebaseUser) {
            // Set user immediately from auth (non-blocking)
            const userData: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
            }
            setUser(userData)

            // Check if user is admin based on UUID
            const isAdminUser = ADMIN_UIDS.includes(firebaseUser.uid);

            // Get Firebase account creation date
            const createdAt = firebaseUser.metadata?.creationTime
              ? new Date(firebaseUser.metadata.creationTime).toISOString()
              : new Date().toISOString();

            // Create default profile from auth data immediately
            const defaultProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              isAdmin: isAdminUser,
              photoURL: firebaseUser.photoURL,
              createdAt: createdAt,
            }
            setUserProfile(defaultProfile)
            setIsAdmin(isAdminUser)
            setLoading(false)

            // Defer Firestore queries to a separate effect (non-blocking)
            // This happens after initial render
          } else {
            // User is signed out
            setUser(null)
            setUserProfile(null)
            setIsAdmin(false)
            setLoading(false)
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error setting up auth:", error);
        setLoading(false);
      }
    };

    const cleanup = setupAuth();
    return () => {
      mounted = false;
      cleanup?.then(fn => fn?.());
    };
  }, [])

  // Separate effect to fetch Firestore profile data (deferred, non-blocking)
  useEffect(() => {
    if (!user) return;

    let mounted = true;

    const fetchUserProfile = async () => {
      try {
        const { doc, getDoc, getDb } = await loadFirestoreHelpers()
        const db = getDb()
        const userDocRef = doc(db, "users", user.uid)
        const userDocSnap = await getDoc(userDocRef)

        if (!mounted) return;

        if (userDocSnap.exists()) {
          const profileData = userDocSnap.data() as UserProfile;
          const isAdminUser = ADMIN_UIDS.includes(user.uid) || profileData.isAdmin || false;

          // Ensure createdAt is preserved if not in Firestore
          const profileWithCreatedAt = {
            ...profileData,
            createdAt: profileData.createdAt || userProfile?.createdAt,
          };

          setUserProfile(profileWithCreatedAt);
          setIsAdmin(isAdminUser);
        } else {
          // Try to create default profile if doesn't exist
          try {
            const isAdminUser = ADMIN_UIDS.includes(user.uid);
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              isAdmin: isAdminUser,
              photoURL: userProfile?.photoURL || null,
              createdAt: userProfile?.createdAt || new Date().toISOString(),
            };
            await setDoc(userDocRef, newProfile);
            if (mounted) {
              setUserProfile(newProfile);
              setIsAdmin(isAdminUser);
            }
          } catch (writeError) {
            console.warn("Could not create user profile in Firestore:", writeError);
          }
        }
      } catch (firestoreError) {
        console.warn("Could not fetch user profile from Firestore:", firestoreError);
      }
    };

    // Defer this to next tick to avoid blocking render
    const timeoutId = setTimeout(() => {
      fetchUserProfile();
    }, 0);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [user?.uid])

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Validate inputs
      if (!email || !password || !name) {
        throw new Error("All fields are required")
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters")
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Please enter a valid email address")
      }

      // Get lazy-loaded auth instance
      const authInstance = await getAuthWithPersistence();

      // Create user account
      const userCredential = await createUserWithEmailAndPassword(authInstance, email, password)
      const firebaseUser = userCredential.user

      // Update user profile with display name
      await updateProfile(firebaseUser, {
        displayName: name,
      })

      // Create user profile object
      const isAdminUser = ADMIN_UIDS.includes(firebaseUser.uid);

      // Get Firebase account creation date
      const createdAt = firebaseUser.metadata?.creationTime
        ? new Date(firebaseUser.metadata.creationTime).toISOString()
        : new Date().toISOString();

      const userProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: name,
        isAdmin: isAdminUser,
        photoURL: null,
        createdAt: createdAt,
      }

      // Try to save to Firestore (optional - won't block signup if it fails)
      try {
        const { doc, setDoc, getDb } = await loadFirestoreHelpers()
        const db = getDb()
        await setDoc(doc(db, "users", firebaseUser.uid), userProfile)
      } catch (firestoreError) {
        // Silently fail if we can't write to Firestore
        console.warn("Could not save user profile to Firestore, but signup completed:", firestoreError)
      }

      // Update state
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: name,
      })
      setUserProfile(userProfile)
      setIsAdmin(isAdminUser)
    } catch (error: any) {
      const errorMessage = error.message || "Failed to create account"

      // Provide more specific error messages
      if (error.code === "auth/email-already-in-use") {
        throw new Error("This email is already in use")
      } else if (error.code === "auth/invalid-email") {
        throw new Error("Invalid email address")
      } else if (error.code === "auth/weak-password") {
        throw new Error("Password is too weak")
      }

      throw new Error(errorMessage)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error("Email and password are required")
      }

      // Get lazy-loaded auth instance
      const authInstance = await getAuthWithPersistence();

      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(authInstance, email, password)
      const firebaseUser = userCredential.user

      // Update state with auth data immediately (non-blocking)
      const userData: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
      }
      setUser(userData)

      // Create default profile immediately from auth data
      const isAdminUser = ADMIN_UIDS.includes(firebaseUser.uid);

      // Get Firebase account creation date
      const createdAt = firebaseUser.metadata?.creationTime
        ? new Date(firebaseUser.metadata.creationTime).toISOString()
        : new Date().toISOString();

      const defaultProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        isAdmin: isAdminUser,
        photoURL: firebaseUser.photoURL,
        createdAt: createdAt,
      }
      setUserProfile(defaultProfile)
      setIsAdmin(isAdminUser)

      // Firestore fetch happens in deferred effect (non-blocking)
    } catch (error: any) {
      const errorMessage = error.message || "Failed to sign in"

      // Provide more specific error messages
      if (error.code === "auth/user-not-found") {
        throw new Error("No account found with this email")
      } else if (error.code === "auth/wrong-password") {
        throw new Error("Incorrect password")
      } else if (error.code === "auth/invalid-email") {
        throw new Error("Invalid email address")
      } else if (error.code === "auth/user-disabled") {
        throw new Error("This account has been disabled")
      }

      throw new Error(errorMessage)
    }
  }

  const logout = async () => {
    try {
      const authInstance = await getAuthWithPersistence();
      await signOut(authInstance)
      setUser(null)
      setUserProfile(null)
      setIsAdmin(false)
    } catch (error) {
      console.error("Error logging out:", error)
      throw new Error("Failed to log out")
    }
  }

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    try {
      const authInstance = await getAuthWithPersistence();
      const firebaseUser = authInstance.currentUser
      if (!firebaseUser) throw new Error("No user logged in")

      // Update Firebase Auth profile if displayName or photoURL changed
      if (updates.displayName || updates.photoURL) {
        await updateProfile(firebaseUser, {
          displayName: updates.displayName || firebaseUser.displayName || undefined,
          photoURL: updates.photoURL || firebaseUser.photoURL || undefined,
        })
      }

      // Update Firestore profile
      try {
        const { doc, updateDoc, getDb } = await loadFirestoreHelpers()
        const db = getDb()
        const userDocRef = doc(db, "users", firebaseUser.uid)
        const currentProfile = userProfile || {}
        const updatedProfile = { ...currentProfile, ...updates }
        await updateDoc(userDocRef, updates)

        // Update local state
        setUserProfile(updatedProfile as UserProfile)
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: updates.displayName || firebaseUser.displayName,
        })
      } catch (firestoreError) {
        console.warn("Could not update profile in Firestore:", firestoreError)
        // Still update local state even if Firestore fails
        setUserProfile({
          ...userProfile,
          ...updates,
        } as UserProfile)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        logout,
        isAdmin,
        signIn,
        signUp,
        updateProfile: updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
