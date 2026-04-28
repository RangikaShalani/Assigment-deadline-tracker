import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  doc
} from 'firebase/firestore';
import { Assignment } from '../types/assignment';
import { db } from '../lib/firebase';

interface AssignmentDocument extends Omit<Assignment, 'dueDate' | 'firestoreId'> {
  dueDate: string;
}

const ASSIGNMENTS_COLLECTION = 'assignments';

function getAssignmentsCollection() {
  if (!db) {
    throw new Error('Firebase is not configured. Add your Vite Firebase env values to enable Firestore.');
  }

  return collection(db, ASSIGNMENTS_COLLECTION);
}

function serializeAssignment(assignment: Assignment): AssignmentDocument {
  const { firestoreId: _firestoreId, ...assignmentData } = assignment;

  return {
    ...assignmentData,
    dueDate: assignment.dueDate.toISOString()
  };
}

function deserializeAssignment(data: AssignmentDocument, firestoreId: string): Assignment {
  return {
    ...data,
    firestoreId,
    dueDate: new Date(data.dueDate)
  };
}

export function subscribeToAssignments(
  onData: (assignments: Assignment[]) => void,
  onError: (error: Error) => void
) {
  const assignmentsQuery = query(getAssignmentsCollection(), orderBy('dueDate', 'asc'));

  return onSnapshot(
    assignmentsQuery,
    (snapshot) => {
      const assignments = snapshot.docs.map((snapshotDoc) => {
        const data = snapshotDoc.data() as AssignmentDocument;
        return deserializeAssignment({
          ...data,
          id: data.id || snapshotDoc.id
        }, snapshotDoc.id);
      });

      onData(assignments);
    },
    (error) => {
      onError(error);
    }
  );
}

export async function createAssignment(assignment: Assignment) {
  await addDoc(getAssignmentsCollection(), serializeAssignment(assignment));
}

export async function updateAssignmentCompletion(firestoreId: string, completed: boolean) {
  const assignmentRef = doc(getAssignmentsCollection(), firestoreId);
  await updateDoc(assignmentRef, { completed });
}
