import React from "react";
import { films } from "../constants/endpoints";

const useFilms = (limit = 10) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [rows, setRows] = React.useState(null);
  const [errors, setErrors] = React.useState();

  React.useEffect(() => {
    if (!rows) {
      setIsLoading(true);
      fetch(films(limit))
        .then(res => res.json())
        .then(data => setRows(data))
        .catch(error => setErrors(error))
        .finally(() => setIsLoading(false));
    }
  }, [limit, rows]);

  return [isLoading, rows, errors];
}

export default useFilms;
