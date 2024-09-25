import axiosInstance from "../services/axios";

export const fetchApartment = async (
    sortBy,
    limit,
    page,
    name,
    description
) => {
    return axiosInstance
        .get("/apartments", {
            params: {
                sortBy,
                limit,
                page,
                name,
                description,
            },
        })
        .then((res) => res?.data);
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
