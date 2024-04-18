type OrderStatus = "Pending" | "Building" | "Done";

const Order = {
    CustomerId: "",
    Items: [],
    Order_Date: "",
    Order_Status: "" as OrderStatus, // Initialize with an empty string or default status
    OrderId: "",
};

export { Order };