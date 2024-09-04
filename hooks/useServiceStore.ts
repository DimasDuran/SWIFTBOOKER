import { create } from 'zustand';

interface Service {
    id: string;
    firstName: string;
    lastName: string;
    expert_area: string;
    district: string;
    skills: any[];
}

interface ServiceState {
    serviceList: Service[];
    filteredServiceList: Service[];
    selectedCategory: string;
    setServiceList: (list: Service[]) => void;
    setFilteredServiceList: (list: Service[]) => void;
    setSelectedCategory: (category: string) => void;
    resetFilters: () => void;
    filterByCategory: (category: string) => void;
    searchServices: (text: string) => void;
}

export const useServiceStore = create<ServiceState>((set) => ({
    serviceList: [],
    filteredServiceList: [],
    selectedCategory: '',

    /**
     * Sets the list of services and updates the filtered list with the same data.
     * @param list - The array of Service objects to be stored.
     */
    setServiceList: (list) => set({ serviceList: list, filteredServiceList: list }),

    /**
     * Updates the filtered list of services.
     * @param list - The array of Service objects to be used as the filtered list.
     */
    setFilteredServiceList: (list) => set({ filteredServiceList: list }),

    /**
     * Sets the selected category for filtering services.
     * @param category - The category string to be used for filtering.
     */
    setSelectedCategory: (category) => set({ selectedCategory: category }),

    /**
     * Resets the filtered list to the original list of services and clears the selected category.
     */
    resetFilters: () => set((state) => ({
        filteredServiceList: state.serviceList,
        selectedCategory: '',
    })),

    /**
     * Filters the list of services by a given category. Services are included if their expert_area
     * matches the category or if the category is found within their skills.
     * @param category - The category string to filter services by.
     */
    filterByCategory: (category) => set((state) => {
        const filteredList = state.serviceList.filter(service =>
            service.expert_area === category || service.skills.includes(category)
        );
        return {
            filteredServiceList: filteredList,
            selectedCategory: category,
        };
    }),

    /**
     * Searches the list of services for matches in the expert_area or skills based on a text query.
     * The search is case-insensitive and checks if the text is included in either field.
     * If the search text is empty, the original list of services is restored.
     * @param text - The search text to filter services by.
     */
    searchServices: (text) => set((state) => {
        if (text.trim() === '') {
            return { filteredServiceList: state.serviceList };
        }
        const searchedText = text.toLowerCase();
        const filteredList = state.serviceList.filter(service =>
            service.skills.some(skill => skill.toLowerCase().includes(searchedText)) ||
            service.expert_area.toLowerCase().includes(searchedText)
        );
        return { filteredServiceList: filteredList };
    }),
}));
