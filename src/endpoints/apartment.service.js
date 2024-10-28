import axiosInstance from "../services/axios";

export const fetchApartment = async () => {
    return axiosInstance.get("/apartments").then((res) => res?.data);
};

export const createApartment = async (payload) => {
    return axiosInstance.post("/apartments", payload).then((res) => res?.data);
};

export const updateApartment = async (apartmentId, payload) => {
    return axiosInstance
        .patch(`/apartments/${apartmentId}`, payload)
        .then((res) => res?.data);
};

export const deleteApartment = async (apartmentId) => {
    return axiosInstance
        .delete(`/apartments/${apartmentId}`)
        .then((res) => res?.data);
};

export const fetchApartmentById = async (apartmentId) => {
    return axiosInstance
        .get(`/apartments/${apartmentId}`)
        .then((res) => res?.data);
};

export const fetchAvailableApartments = async (checkIn, checkOut) => {
    return axiosInstance
        .get(`/apartments/available`, { params: { checkIn, checkOut } })
        .then((res) => res.data)
        .catch((error) =>
            console.error("Error fetching available apartments:", error)
        );
};

export const fetchAvailableApartmentsDate = async (checkIn, checkOut) => {
    return axiosInstance
        .get(`/apartments/available-dates`, { params: { checkIn, checkOut } })
        .then((res) => res.data)
        .catch((error) =>
            console.error("Error fetching available apartments Date:", error)
        );
};
