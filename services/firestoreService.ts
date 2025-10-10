// REMOVED: import firebase from 'firebase/compat/app';
// REMOVED: import 'firebase/compat/firestore';
import { firebaseConfig } from '../constants';
import type { MessageData } from '../types';

// Use the globally available `firebase` object from the script tags in index.html
// This declaration informs TypeScript that a global `firebase` variable exists.
declare const firebase: any;

// Initialize Firebase if it hasn't been already.
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Get the Firestore instance from the global firebase object.
const db = firebase.firestore();

/**
 * Adds a new message document to the 'messages' collection in Firestore.
 * @param messageData - The message data to be saved.
 */
export const addMessage = async (messageData: Omit<MessageData, 'createdAt'>): Promise<void> => {
  try {
    // Use the v8 method chain `db.collection().add()` and the global `firebase.firestore.FieldValue`
    await db.collection('messages').add({
      ...messageData,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding document: ", error);
    throw new Error("Failed to send message. Please try again later.");
  }
};
