import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  QueryConstraint,
  DocumentData,
  FirestoreError,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Utility helper to safely remove undefined values before writing to Firestore.
 * Firestore throws an error if an object contains undefined fields.
 */
function sanitizePayload<T extends object>(data: T): Record<string, unknown> {
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        // Deep sanitize nested plain objects
        clean[key] = sanitizePayload(value as Record<string, unknown>);
      } else {
        clean[key] = value;
      }
    }
  }
  return clean;
}

/**
 * Standard Result Interface for mutation operations
 */
export interface DbMutationResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Centralized, Type-Safe Database Service Layer
 * Universal Firestore abstraction offering full type generics, defensive error boundaries,
 * and automatic server timestamps.
 */
export const dbService = {
  /**
   * Fetch a single document by its collection name and document ID.
   * @param collectionName The name of the Firestore collection
   * @param docId The unique document identifier
   * @returns The document typed as T, or null if not found/on error
   */
  getDocument: async <T extends object = DocumentData>(
    collectionName: string,
    docId: string
  ): Promise<T | null> => {
    try {
      if (!collectionName?.trim() || !docId?.trim()) {
        console.warn('[dbService:GetDocWarning] Invalid collectionName or docId provided.');
        return null;
      }

      const docRef = doc(db, collectionName.trim(), docId.trim());
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const rawData = docSnap.data() as DocumentData;
      return {
        id: docSnap.id,
        ...rawData,
      } as unknown as T;
    } catch (error: unknown) {
      const err = error as FirestoreError | Error;
      console.error(`[dbService:GetDocError] Failed to fetch document ${docId} from ${collectionName}:`, err.message);
      return null;
    }
  },

  /**
   * Fetch multiple documents from a collection with optional query constraints.
   * @param collectionName The name of the Firestore collection
   * @param constraints Optional Firestore QueryConstraint array (e.g., where(), orderBy(), limit())
   * @returns Array of documents typed as T[]
   */
  getDocuments: async <T extends object = DocumentData>(
    collectionName: string,
    constraints: QueryConstraint[] = []
  ): Promise<T[]> => {
    try {
      if (!collectionName?.trim()) {
        console.warn('[dbService:GetDocsWarning] Invalid collectionName provided.');
        return [];
      }

      const colRef = collection(db, collectionName.trim());
      const q = constraints.length > 0 ? query(colRef, ...constraints) : query(colRef);
      const querySnap = await getDocs(q);

      const documents: T[] = [];
      querySnap.forEach((docSnap) => {
        const rawData = docSnap.data() as DocumentData;
        documents.push({
          id: docSnap.id,
          ...rawData,
        } as unknown as T);
      });

      return documents;
    } catch (error: unknown) {
      const err = error as FirestoreError | Error;
      console.error(`[dbService:GetDocsError] Failed to query collection ${collectionName}:`, err.message);
      return [];
    }
  },

  /**
   * Add a new document to a collection with automatic server timestamps.
   * @param collectionName The name of the Firestore collection
   * @param data The payload typed as T
   * @param customDocId Optional custom ID; if omitted, Firestore auto-generates a unique ID
   * @returns Mutation result object containing success status and document ID
   */
  addDocument: async <T extends object>(
    collectionName: string,
    data: T,
    customDocId?: string
  ): Promise<DbMutationResult> => {
    try {
      if (!collectionName?.trim()) {
        throw new Error('Collection name is required.');
      }

      const sanitized = sanitizePayload(data);
      const payloadWithTimestamps = {
        ...sanitized,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      if (customDocId && customDocId.trim()) {
        const docRef = doc(db, collectionName.trim(), customDocId.trim());
        await setDoc(docRef, payloadWithTimestamps);
        return { success: true, id: customDocId.trim() };
      }

      const colRef = collection(db, collectionName.trim());
      const docRef = await addDoc(colRef, payloadWithTimestamps);
      return { success: true, id: docRef.id };
    } catch (error: unknown) {
      const err = error as FirestoreError | Error;
      console.error(`[dbService:AddDocError] Failed to add document into ${collectionName}:`, err.message);
      return { success: false, error: err.message };
    }
  },

  /**
   * Set or overwrite a document at a specific document ID.
   * @param collectionName The name of the Firestore collection
   * @param docId The target document ID
   * @param data The payload typed as T
   * @param merge Whether to merge fields or completely replace the document (default: true)
   * @returns Mutation result object
   */
  setDocument: async <T extends object>(
    collectionName: string,
    docId: string,
    data: T,
    merge: boolean = true
  ): Promise<DbMutationResult> => {
    try {
      if (!collectionName?.trim() || !docId?.trim()) {
        throw new Error('Both collectionName and docId are required.');
      }

      const rawObj = data as Record<string, unknown>;
      const sanitized = sanitizePayload(data);
      const payloadWithTimestamps = {
        timestamp: rawObj.timestamp || Date.now(),
        createdAt: rawObj.createdAt || new Date().toISOString(),
        ...sanitized,
        updatedAt: serverTimestamp(),
      };

      const docRef = doc(db, collectionName.trim(), docId.trim());
      await setDoc(docRef, payloadWithTimestamps, { merge });

      return { success: true, id: docId.trim() };
    } catch (error: unknown) {
      const err = error as FirestoreError | Error;
      console.error(`[dbService:SetDocError] Failed to set document ${docId} in ${collectionName}:`, err.message);
      return { success: false, error: err.message };
    }
  },

  /**
   * Update specific fields of an existing document.
   * @param collectionName The name of the Firestore collection
   * @param docId The target document ID
   * @param data Partial fields to update
   * @returns Mutation result object
   */
  updateDocument: async <T extends object>(
    collectionName: string,
    docId: string,
    data: Partial<T>
  ): Promise<DbMutationResult> => {
    try {
      if (!collectionName?.trim() || !docId?.trim()) {
        throw new Error('Both collectionName and docId are required for an update.');
      }

      const sanitized = sanitizePayload(data as Record<string, unknown>);
      const payloadWithTimestamp = {
        ...sanitized,
        updatedAt: serverTimestamp(),
      };

      const docRef = doc(db, collectionName.trim(), docId.trim());
      await updateDoc(docRef, payloadWithTimestamp);

      return { success: true, id: docId.trim() };
    } catch (error: unknown) {
      const err = error as FirestoreError | Error;
      console.error(`[dbService:UpdateDocError] Failed to update document ${docId} in ${collectionName}:`, err.message);
      return { success: false, error: err.message };
    }
  },

  /**
   * Delete a document from a collection.
   * @param collectionName The name of the Firestore collection
   * @param docId The target document ID to delete
   * @returns Mutation result object
   */
  deleteDocument: async (
    collectionName: string,
    docId: string
  ): Promise<DbMutationResult> => {
    try {
      if (!collectionName?.trim() || !docId?.trim()) {
        throw new Error('Both collectionName and docId are required for deletion.');
      }

      const docRef = doc(db, collectionName.trim(), docId.trim());
      await deleteDoc(docRef);

      return { success: true, id: docId.trim() };
    } catch (error: unknown) {
      const err = error as FirestoreError | Error;
      console.error(`[dbService:DeleteDocError] Failed to delete document ${docId} from ${collectionName}:`, err.message);
      return { success: false, error: err.message };
    }
  },

  /**
   * Real-time subscription to a single document.
   * @param collectionName The name of the Firestore collection
   * @param docId The target document ID
   * @param onUpdate Callback receiving the updated document (or null if deleted)
   * @param onError Optional error callback
   * @returns Unsubscribe function to terminate the listener
   */
  subscribeToDocument: <T extends object = DocumentData>(
    collectionName: string,
    docId: string,
    onUpdate: (data: T | null) => void,
    onError?: (error: Error) => void
  ): Unsubscribe => {
    if (!collectionName?.trim() || !docId?.trim()) {
      console.warn('[dbService:SubscribeDocWarning] Missing collectionName or docId.');
      return () => {};
    }

    const docRef = doc(db, collectionName.trim(), docId.trim());
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (!docSnap.exists()) {
          onUpdate(null);
          return;
        }
        const rawData = docSnap.data() as DocumentData;
        onUpdate({
          id: docSnap.id,
          ...rawData,
        } as unknown as T);
      },
      (error: FirestoreError) => {
        console.error(`[dbService:SubscribeDocError] Listener error on ${collectionName}/${docId}:`, error.message);
        if (onError) {
          onError(error);
        }
      }
    );
  },

  /**
   * Real-time subscription to a collection or queried subset.
   * @param collectionName The name of the Firestore collection
   * @param onUpdate Callback receiving the array of typed documents
   * @param constraints Optional Firestore QueryConstraints
   * @param onError Optional error callback
   * @returns Unsubscribe function to terminate the listener
   */
  subscribeToCollection: <T extends object = DocumentData>(
    collectionName: string,
    onUpdate: (data: T[]) => void,
    constraints: QueryConstraint[] = [],
    onError?: (error: Error) => void
  ): Unsubscribe => {
    if (!collectionName?.trim()) {
      console.warn('[dbService:SubscribeColWarning] Missing collectionName.');
      return () => {};
    }

    const colRef = collection(db, collectionName.trim());
    const q = constraints.length > 0 ? query(colRef, ...constraints) : query(colRef);

    return onSnapshot(
      q,
      (querySnap) => {
        const documents: T[] = [];
        querySnap.forEach((docSnap) => {
          const rawData = docSnap.data() as DocumentData;
          documents.push({
            id: docSnap.id,
            ...rawData,
          } as unknown as T);
        });
        onUpdate(documents);
      },
      (error: FirestoreError) => {
        console.error(`[dbService:SubscribeColError] Listener error on collection ${collectionName}:`, error.message);
        if (onError) {
          onError(error);
        }
      }
    );
  },
};

export { where, orderBy, limit, serverTimestamp, type QueryConstraint };
export default dbService;
