import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nlexajhemkplwtczvyrz.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZXhhamhlbWtwbHd0Y3p2eXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg4NTg3MjUsImV4cCI6MjAyNDQzNDcyNX0.cswPXimiIGv85i-_w2LrMJQJAwly1DtG3dkh869yQBI";
const supabase = createClient(supabaseUrl, supabaseKey);

const CitiesConstex = createContext();
const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };

    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };

    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };

    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      throw new Error("Unknow action type");
  }
}

function CitiesProviders({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const { data } = await supabase.from("cities").select("*");
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "Something went wrong with loading the cities",
        });
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (id === currentCity.id) return;
      dispatch({ type: "loading" });
      try {
        const { data } = await supabase
          .from("cities")
          .select("*")
          .eq("id", id)
          .single();
        dispatch({ type: "city/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "Something went wrong with loading the city.",
        });
      }
    },
    [currentCity.id]
  );
  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const { data } = await supabase
        .from("cities")
        .insert([{ ...newCity }])
        .select()
        .single();
      dispatch({ type: "city/created", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "Something went wrong with creating city.",
      });
    }
  }
  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      const { error } = await supabase.from("cities").delete().eq("id", id);
      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "Something went wrong with deleting city.",
      });
    }
  }

  return (
    <CitiesConstex.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesConstex.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesConstex);
  if (context === undefined) throw new Error("Wrong place to use context");
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { CitiesProviders, useCities };
