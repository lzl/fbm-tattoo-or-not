import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "react-query";
import axios from "axios";
import "./App.css";
import React from "react";

const queryClient = new QueryClient();

// const API_URL = "http://localhost:8000";
const API_URL = "http://10.10.4.182:8000";

const getPhoto = async () => {
  const response = await axios.get(`${API_URL}/photo`);
  return response.data;
};

const postPhoto = async (data) => {
  const response = await axios.post(`${API_URL}/photo`, data);
  return response.data;
};

function useEffectCancelPhoto(path) {
  const cancel = React.useCallback(() => {
    if (path) axios.post(`${API_URL}/photo/cancel`, { path });
  }, [path]);

  React.useEffect(() => {
    window.addEventListener("beforeunload", cancel);
    return () => {
      window.removeEventListener("beforeunload", cancel);
    };
  }, [cancel]);

  return null;
}

function Photo({ isLoading, path, total }) {
  if (isLoading) return <div className="mt-2">loading</div>;

  return (
    <div>
      <div className="mt-2">剩余: {total}</div>
      <img className="mt-2" alt="无法显示" src={`${API_URL}/assets/doing/${path}`} />
    </div>
  );
}

function Actions({ isFetching, path }) {
  const queryClient = useQueryClient();
  const { isLoading, isError, mutate } = useMutation(postPhoto, {
    onSuccess: () => {
      queryClient.invalidateQueries("photo");
    },
  });

  const handleClick = (type) => {
    const data = { path, type };
    mutate(data);
  };

  const disabled = isLoading || isFetching || isError;

  return (
    <div className="actions mt-2">
      <button
        className="success"
        disabled={disabled}
        onClick={() => handleClick("cleanskin")}
      >
        正常通过
      </button>
      <button
        className="danger ml-2"
        disabled={disabled}
        onClick={() => handleClick("tattoo")}
      >
        有纹身
      </button>
      <button
        className="danger ml-2"
        disabled={disabled}
        onClick={() => handleClick("scar")}
      >
        有伤疤
      </button>
      <button
        className="default ml-2"
        disabled={disabled}
        onClick={() => handleClick("clothescover")}
      >
        衣物遮挡
      </button>
      <button
        className="default ml-2"
        disabled={disabled}
        onClick={() => handleClick("noise")}
      >
        图片模糊
      </button>
      <button
        className="default ml-2"
        disabled={disabled}
        onClick={() => handleClick("other")}
      >
        无法判断
      </button>
    </div>
  );
}

function Main() {
  const { isLoading, isError, data, error } = useQuery("photo", getPhoto, {
    refetchOnWindowFocus: false,
  });

  useEffectCancelPhoto(data?.path);

  if (isError) {
    return (
      <div className="container">
        <div>{JSON.stringify(error)}</div>
      </div>
    );
  }

  if (!isLoading && !data.ok) {
    return (
      <div className="container">
        <div>{data.message}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <Actions isFetching={isLoading} path={data?.path} />
      <Photo isLoading={isLoading} path={data?.path} total={data?.total} />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Main />
    </QueryClientProvider>
  );
}

export default App;
