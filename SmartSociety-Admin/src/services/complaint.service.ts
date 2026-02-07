// src/services/complaint.service.ts
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Complaint, Suggestion, ComplaintCategory } from '../types/complaint.types';

// Complaints
export const createComplaint = async (
  userId: string,
  userName: string,
  userEmail: string,
  houseNumber: string,
  category: ComplaintCategory,
  title: string,
  description: string
): Promise<string> => {
  const complaintData = {
    userId,
    userName,
    userEmail,
    houseNumber,
    category,
    title,
    description,
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, 'complaints'), complaintData);
  return docRef.id;
};

export const getUserComplaints = async (userId: string): Promise<Complaint[]> => {
  const q = query(
    collection(db, 'complaints'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp).toDate(),
    updatedAt: (doc.data().updatedAt as Timestamp).toDate(),
    repliedAt: doc.data().repliedAt ? (doc.data().repliedAt as Timestamp).toDate() : undefined,
    resolvedAt: doc.data().resolvedAt ? (doc.data().resolvedAt as Timestamp).toDate() : undefined,
  })) as Complaint[];
};

export const checkActiveCategoryComplaint = async (
  userId: string,
  category: ComplaintCategory
): Promise<boolean> => {
  const q = query(
    collection(db, 'complaints'),
    where('userId', '==', userId),
    where('category', '==', category),
    where('status', 'in', ['pending', 'in_progress'])
  );

  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

export const deleteComplaint = async (complaintId: string): Promise<void> => {
  await deleteDoc(doc(db, 'complaints', complaintId));
};

// Suggestions
export const createSuggestion = async (
  userId: string,
  userName: string,
  userEmail: string,
  houseNumber: string,
  title: string,
  description: string
): Promise<string> => {
  const suggestionData = {
    userId,
    userName,
    userEmail,
    houseNumber,
    title,
    description,
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, 'suggestions'), suggestionData);
  return docRef.id;
};

export const getUserSuggestions = async (userId: string): Promise<Suggestion[]> => {
  const q = query(
    collection(db, 'suggestions'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp).toDate(),
    updatedAt: (doc.data().updatedAt as Timestamp).toDate(),
    repliedAt: doc.data().repliedAt ? (doc.data().repliedAt as Timestamp).toDate() : undefined,
    reviewedAt: doc.data().reviewedAt ? (doc.data().reviewedAt as Timestamp).toDate() : undefined,
  })) as Suggestion[];
};

export const checkActiveSuggestion = async (userId: string): Promise<boolean> => {
  const q = query(
    collection(db, 'suggestions'),
    where('userId', '==', userId),
    where('status', '==', 'pending')
  );

  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

export const deleteSuggestion = async (suggestionId: string): Promise<void> => {
  await deleteDoc(doc(db, 'suggestions', suggestionId));
};