export const useLogin = ({ setToken }: { setToken: (token: string) => void }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async (values: any) => {
      const response = await fetch("http://localhost:9000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });
  
      if (!response.ok) {
        alert("Đăng nhập thất bại!");
        return;
      }
  
      const data = await response.json();
      setToken(data.access_token);
      localStorage.setItem("user_data", JSON.stringify(data.user));
  
      if (values.remember) {
        localStorage.setItem("token", data.access_token);
      } else {
        sessionStorage.setItem("token", data.access_token);
      }
  
      window.location.href = "/";
    };
  };
  