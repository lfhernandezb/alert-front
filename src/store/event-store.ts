import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { InfraEvent } from '../model/infra-event.model';

interface EventStore {
  // events fetched from API and filtered
  events: InfraEvent[];
  // events displayed in page
  displayedEvents: InfraEvent[];
  selectedEventId: number | null;
  loading: boolean;
  error: string | null;
  detail: string;
  // State for modal visibility
  detailModalVisible: boolean;
  escalateModalVisible: boolean;
  discardModalVisible: boolean;
  // State for pagination
  currentPage: number;
  totalPages: number;
  // State for events per page
  selectedEventsPerPage: number;
   // State for checkboxes
  showAll: boolean;
  showActive: boolean;
  showEscalated: boolean;
  showDiscarded: boolean;
  // scroll position
  scrollPosition: number;
  setScrollPosition: (position: number) => void;
  setShowActive: (showActive: boolean) => void;
  setShowEscalated: (showEscalated: boolean) => void;
  setShowDiscarded: (showDiscarded: boolean) => void;
  setShowAll: (showAll: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setEvents: (events: InfraEvent[]) => void;
  setDisplayedEvents: (events: InfraEvent[]) => void;
  setSelectedEventId: (id: number | null) => void;
  setDetail: (detail: string) => void;
  setDetailModalVisible: (visible: boolean) => void;
  setEscalateModalVisible: (visible: boolean) => void;
  setDiscardModalVisible: (visible: boolean) => void;
  setCurrentPage: (page: number) => void;
  setSelectedEventsPerPage: (perPage: number) => void;
  setTotalPages: (totalPages: number) => void; // Add this line to set totalPages
}

export const useEventStore = create<EventStore>()(
  persist(
    (set) => ({
      events: [],
      displayedEvents: [],
      selectedEventId: null,
      detail: '',
      detailModalVisible: false,
      escalateModalVisible: false,
      discardModalVisible: false,
      currentPage: 1,
      selectedEventsPerPage: 1,
      totalPages: 0, // Initialize totalPages with a default value
      showAll: true,
      showActive: false,
      showEscalated: false,
      showDiscarded: false,
      loading: false,
      error: null,
      scrollPosition: 0,
      setShowActive: (showActive) => set({ showActive }),
      setShowEscalated: (showEscalated) => set({ showEscalated }),
      setShowDiscarded: (showDiscarded) => set({ showDiscarded }),
      setShowAll: (showAll) => set({ showAll }),
      setLoading: (loading) => set({ loading: loading }),
      setError: (error) => set({ error }),
      setEvents: (events) => set({ events }),
      setDisplayedEvents: (events) => set({ displayedEvents: events }),
      setSelectedEventId: (id) => set({ selectedEventId: id }),
      setDetail: (detail) => set({ detail }),
      setDetailModalVisible: (visible) => set({ detailModalVisible: visible }),
      setEscalateModalVisible: (visible) => set({ escalateModalVisible: visible }),
      setDiscardModalVisible: (visible) => set({ discardModalVisible: visible }),
      setCurrentPage: (page) => set({ currentPage: page }),
      setSelectedEventsPerPage: (perPage) => set({ selectedEventsPerPage: perPage }),
      setTotalPages: (totalPages: number) => set({ totalPages }), // Add this line to set totalPages
      setScrollPosition: (position: number) => set({ scrollPosition: position }),
    }),
    {
      name: 'event-store', // Key for localStorage
    }
  )
);