/**
 * ============================================================================
 * SVS SRI VASUDHA DEVELOPERS - FIREBASE CONFIG & INITIALIZATION
 * ============================================================================
 * 
 * Central export for Firebase configuration and service instances.
 * Fully decoupled from UI components.
 */

export * from '../lib/firebase';
export { app, auth, db, googleProvider } from '../lib/firebase';
