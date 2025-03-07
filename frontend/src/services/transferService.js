import api from "./apiConfig";

export const sendTransferOrder = async (data) => {
  try {
    const response = await api.post("/transfers/send", data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getTransferNotifications = async (id) => {
  try {
    const response = await api.get(`/transferOrders/${id}`);
    console.log(id);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getProcessesInTransfer = async (id) => {
  try {
    const response = await api.get(`/transfers/processes/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const acceptTransfer = async (id) => {
  try {
    const response = await api.post(`/transfers/accept/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
