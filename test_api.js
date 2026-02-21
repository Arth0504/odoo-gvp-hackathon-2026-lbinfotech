const testApi = async () => {
    try {
        const res = await fetch("http://localhost:5000/api/trips");
        console.log("Trips Status:", res.status);
        const res2 = await fetch("http://localhost:5000/api/vehicles");
        console.log("Vehicles Status:", res2.status);
    } catch (err) {
        console.log("Error:", err.message);
    }
};

testApi();
