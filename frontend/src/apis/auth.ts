export async function login(username: string, password: string) {
    const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (data.access_token) {
        localStorage.setItem("token", data.access_token);
    }
}

export async function getProtectedData() {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8000/protected", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
    });

    return res.json();
}
