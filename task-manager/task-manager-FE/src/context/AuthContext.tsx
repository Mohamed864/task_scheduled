import { createContext, useReducer, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import api from "../services/api";

interface AuthState {
    token: string | null;
    user: { email: string; name: string } | null;
}

type AuthAction =
    | {
          type: "LOGIN";
          payload: { token: string; user: { email: string; name: string } };
      }
    | { type: "LOGOUT" };

const initialState: AuthState = {
    token: localStorage.getItem("USER_TOKEN"),
    user: localStorage.getItem("USER_EMAIL")
        ? {
              email: localStorage.getItem("USER_EMAIL")!,
              name: localStorage.getItem("USER_NAME")!,
          }
        : null,
};

const AuthContext = createContext<
    AuthState & {
        login: (email: string, password: string) => Promise<void>;
        logout: () => void;
    }
>({
    ...initialState,
    login: async () => {},
    logout: () => {},
});

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case "LOGIN":
            return { token: action.payload.token, user: action.payload.user };
        case "LOGOUT":
            return { token: null, user: null };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    const login = async (email: string, password: string) => {
        const res = await api.post("/login", { email, password });
        const { token, user } = res.data;
        localStorage.setItem("USER_TOKEN", token);
        localStorage.setItem("USER_EMAIL", user.email);
        localStorage.setItem("USER_NAME", user.name);
        dispatch({ type: "LOGIN", payload: { token, user } });
    };

    const logout = () => {
        localStorage.removeItem("USER_TOKEN");
        localStorage.removeItem("USER_EMAIL");
        dispatch({ type: "LOGOUT" });
    };

    //for axios interceptors to have fresh token after login
    useEffect(() => {
        const interceptor = api.interceptors.request.use((config) => {
            const token = state.token;
            if (
                token &&
                config.url &&
                !["/login", "/register"].some((u) => config.url?.includes(u))
            ) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
        //each time  mount stopped interceptor eject to clear the stack
        return () => {
            api.interceptors.request.eject(interceptor);
        };
    }, [state.token]); //using token as a dep.. to make it mount for every change for token

    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
