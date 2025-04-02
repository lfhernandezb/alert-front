import { plainToInstance } from "class-transformer";
import { InfraEvent } from "../model/infra-event.model";
import axios from "axios";

async function getAllEvents(): Promise<InfraEvent[]> {
  
    // send an http request to the backend using axios
    const axiosInstance = axios.create({
        timeout: 4000,
        headers: {
            "Content-Type": "application/json",
        }
    });

    return axiosInstance.get("http://localhost:8080/api/event/all"
    ).then((response) => {
        return plainToInstance(InfraEvent, response.data);
    }).catch((error) => {
        console.error("Error fetching events:", error);
        throw error;
    });
}

async function getEventById(id: number): Promise<InfraEvent> {
    const axiosInstance = axios.create({
        timeout: 4000,
        headers: {
            "Content-Type": "application/json",
        }
    });

    return axiosInstance.get("http://localhost:8080/api/event/" + id
    ).then((response) => {
        return plainToInstance(InfraEvent, response.data);
    }).catch((error) => {
        console.error("Error fetching events:", error);
        throw error;
    });
}

async function updateEvent(event: InfraEvent): Promise<InfraEvent> {
    const axiosInstance = axios.create({
        timeout: 4000,
        headers: {
            "Content-Type": "application/json",
        }
    });

    return axiosInstance.put("http://localhost:8080/api/event/" + event.id, event
    ).then((response) => {
        return plainToInstance(InfraEvent, response.data);
    }).catch((error) => {
        console.error("Error updating event:", error);
        throw error;
    });
}

async function deleteEvent(id: number): Promise<void> {
    const axiosInstance = axios.create({
        timeout: 4000,
        headers: {
            "Content-Type": "application/json",
        }
    });

    return axiosInstance.delete("http://localhost:8080/api/event/" + id
    ).then((response) => {
        return response.data;
    }).catch((error) => {
        console.error("Error deleting event:", error);
        throw error;
    });
}

export { getAllEvents, getEventById, updateEvent, deleteEvent };
