async function getPayments() {
    // Ví dụ mock API/fetch, bạn đổi lại tùy theo backend thật
    return [
        {
            id: "m5gr84i9",
            amount: 316,
            status: "Success",
            email: "ken99@yahoo.com"
        },
        {
            id: "3u1reuv4",
            amount: 242,
            status: "Success",
            email: "Abe45@gmail.com"
        },
        {
            id: "derv1ws0",
            amount: 837,
            status: "Processing",
            email: "Monserrat44@gmail.com"
        },
        {
            id: "5kma53ae",
            amount: 874,
            status: "Success",
            email: "Silas22@gmail.com"
        },
        {
            id: "bhqecj4p",
            amount: 721,
            status: "Failed",
            email: "carmella@hotmail.com"
        }
    ];
}

export async function load() {
    // logic to fetch payments data here
    const payments = await getPayments();
    return {
        payments,
    };
}