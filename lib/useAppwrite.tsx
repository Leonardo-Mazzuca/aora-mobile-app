import { useEffect, useState } from "react";
import { Alert } from "react-native";

type Props = {
  fn: () => any;
};

const useAppwrite = <T,>({ fn }: Props) => {
  const [data, setdata] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fn();
      setdata(response);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refecth = () => fetchData();

  return {
    data,
    isLoading,
    refecth
  };
};

export default useAppwrite;
