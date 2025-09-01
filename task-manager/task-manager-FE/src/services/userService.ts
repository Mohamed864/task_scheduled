import api from "./api";

export const userService = {
    findByEmail: (email: string) =>
        api.get<{ data: { id: number; email: string } }>(
            "/users?email=" + email
        ),
};
