import { useQuery } from "@tanstack/react-query";
import { httpGetHealthCheck } from "../hooks/requests";
import { useState } from "react";

export const useHealthCheck = () => {
    const [isServerHealthy, setIsServerHealthy] = useState(false);

    return useQuery({
      queryKey: ["healthCheck"],
      queryFn: async () => {
        const response = await httpGetHealthCheck();
        if (response.status !== 200) {
            setIsServerHealthy(false)
            throw new Error(`Unexpected status code: ${response.status}`);
          }
        
          setIsServerHealthy(true)
        return response?.data;
      },
      enabled: !isServerHealthy,
      staleTime: Infinity,
      refetchInterval: 5000,
    });
  };
  