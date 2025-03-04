
import { isAxiosError } from "axios";
import api from "../config/axios";
import { User, UserHandle } from "../types";

export async function getUser() {
    try {
        const { data } = await api.get<User>(`/api/user`);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.error);   
        }
    }
}

export async function updateProfile(formData: User) {
    try {
    const { data } = await api.patch<string>(`/api/user`, formData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.error);   
        }
    }
}

export async function uploadImage(file: File) {
    let formData = new FormData();
    formData.append('file', file);
    try {
        const { data } = await api.post(`/api/image`, formData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.error);   
        }
    }
}

export async function getUserByHandle(handle: string) {
    try {
    const { data } = await api<UserHandle>(`/api/${handle}`);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.error);   
        }
    }
}