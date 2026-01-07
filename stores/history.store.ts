/* eslint-disable @typescript-eslint/no-explicit-any */
import { Page } from "@/types/page";
import { create } from "zustand";


const AUTO_BATCH_DELAY = 400;

type HistoryAction = {
  type: string;
  meta?: Record<string, any>;
};

export type HistoryEntry = {
  snapshot: Page[];
  action: HistoryAction;
  timestamp: number;
};

interface HistoryState {
  past: HistoryEntry[];
  present: HistoryEntry | null;
  future: HistoryEntry[];

  // Phase 9A batching state
  isBatching: boolean;
  batchEntry: HistoryEntry | null;
  batchSnapshot: HistoryEntry | null;
  autoBatchTimer: ReturnType<typeof setTimeout> | null;

  // existing API
  record: (snapshot: Page[], action: HistoryAction) => void;
  undo: () => HistoryEntry | null;
  redo: () => HistoryEntry | null;

  // Phase 9A API
  startBatch: () => void;
  endBatch: () => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  past: [],
  present: null,
  future: [],

  // batching state
  isBatching: false,
  batchEntry: null,
  batchSnapshot: null,
  autoBatchTimer: null,

  /**
   * RECORD SNAPSHOT
   * When not batching: moves present → past, snapshot → present
   * When batching: just updates batchSnapshot
   */
  record: (snapshot, action) => {
    const { isBatching, batchSnapshot, past, present, autoBatchTimer } = get();

    const entry: HistoryEntry = {
      snapshot,
      action,
      timestamp: Date.now(),
    };

    // Clear existing auto-batch timer
    if (autoBatchTimer) {
      clearTimeout(autoBatchTimer);
    }

    // ✅ If currently batching, just update the batch snapshot
    if (isBatching) {
      set({
        batchEntry: entry,
      });
      return;
    }

    // Auto-batch rapid updates (like typing)
    // Instead of immediately recording, wait to see if more updates come
    const timer = setTimeout(() => {
      const { batchEntry, past, present } = get();

      if (batchEntry) {
        set({
          past: present !== null ? [...past, present] : past,
          present: batchEntry,
          future: [],
          batchEntry: null,
          autoBatchTimer: null,
        });
      }
    }, AUTO_BATCH_DELAY);

    set({
      batchEntry: entry,
      autoBatchTimer: timer,
    });
  },

  /**
   * START BATCH - used for discrete operations (drag, multi-update)
   */
  startBatch: () => {
    const state = get();
    if (state.isBatching) return;

    // Clear any pending auto-batch
    if (state.autoBatchTimer) {
      clearTimeout(state.autoBatchTimer);
    }

    set({
      isBatching: true,
      autoBatchTimer: null,
      batchEntry: null,
    });
  },

  /**
   * END BATCH - commits batched snapshot
   */
  endBatch: () => {
    const { isBatching, batchEntry, past, present } = get();
    if (!isBatching) return;

    // Only record if there was a snapshot during batch
    if (batchEntry) {
      set({
        past: present !== null ? [...past, present] : past,
        present: batchEntry,
        future: [],
        isBatching: false,
        batchEntry: null,
      });
    } else {
      set({
        isBatching: false,
        batchEntry: null,
      });
    }
  },

  /**
   * UNDO
   * Restores to previous state in history
   */
  undo: () => {
    const { past, present, future, autoBatchTimer, batchEntry } = get();

    // If there's a pending auto-batch, commit it before undoing
    if (autoBatchTimer) {
      clearTimeout(autoBatchTimer);

      // Commit the pending batch to past
      const newPast =
        present !== null && batchEntry
          ? [...past, present]
          : past;

      set({
        past: newPast,
        present: batchEntry,
        future: [],
        batchEntry: null,
        autoBatchTimer: null,
      });

      // Now undo from the committed state
      return get().undo();
    }

    if (past.length === 0) return null;

    const previousState = past[past.length - 1];
    const newPast = past.slice(0, -1);
    const newFuture = present !== null ? [present, ...future] : future;

    set({
      past: newPast,
      present: previousState,
      future: newFuture,
    });

    return previousState;
  },

  /**
   * REDO
   * Restores to next state in future
   */
  redo: () => {
    const { past, present, future, autoBatchTimer } = get();

    // Clear pending auto-batch before redo
    if (autoBatchTimer) {
      clearTimeout(autoBatchTimer);
      set({ autoBatchTimer: null, batchSnapshot: null });
    }

    if (future.length === 0) return null;

    const nextState = future[0];
    const newFuture = future.slice(1);
    const newPast = present !== null ? [...past, present] : past;

    set({
      past: newPast,
      present: nextState,
      future: newFuture,
    });

    return nextState;
  },
}));