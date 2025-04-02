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

export { getAllEvents, getEventById };
