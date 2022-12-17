import { useEffect, useMemo, useState } from "react";
import "./App.css";
import axios from "axios";
import Table from "./components/Table";

function App() {
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Phone",
        accessor: "phone",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Country",
        accessor: "country",
      },
      {
        Header: "Currency",
        accessor: "currency",
      },
    ],
    []
  );
  const [data, setData] = useState();
  const [queryParams, setQueryParams] = useState({
    sort: "",
    filter: "",
    limit: 10,
    offset: 0,
  });
  const [numbersArary, setNumbersArary] = useState();
  const [selectedPageNumber, setSelectedPageNumber] = useState(1);
  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    axios
      .get(
        `http://localhost:9000/users?sort=${queryParams.sort}&filter=${queryParams.filter}&limit=${queryParams.limit}&offset=${queryParams.offset}`,
        {
          cancelToken: source.token,
        }
      )
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("successfully aborted");
        } else {
          console.log(err);
        }
      });
    return () => {
      source.cancel();
    };
  }, [
    queryParams.sort,
    queryParams.limit,
    queryParams.offset,
    queryParams.filter,
  ]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    const numbersArary = [];
    for (let i = 0; i <= 1000 / queryParams.limit; i++) {
      numbersArary.push(i);
    }
    setNumbersArary(numbersArary);
  }, [queryParams.limit]);

  useEffect(() => {
    setQueryParams((prev) => {
      return { ...prev, offset: (selectedPageNumber-1)*prev.limit };
    });
  }, [selectedPageNumber]);

  return (
    <div className="container">
      <div className="d-flex p-2 justify-evenly">
        <div className="w-45">
          <label className="select" for="slct">
            <select
              onChange={(e) => {
                setQueryParams((prev) => {
                  return { ...prev, sort: e.target.value };
                });
              }}
              required="required"
            >
              <option value="" disabled="disabled" selected="selected">
                Select Sort Option
              </option>
              {columns.map((column) => (
                <option value={column.accessor}>{column.Header}</option>
              ))}
            </select>
            <svg>
              <use xlinkHref="#select-arrow-down"></use>
            </svg>
          </label>
        </div>
        <div className="w-45">
          <div className="webflow-style-input">
            <input
              onChange={(e) => {
                setQueryParams((prev) => {
                  return { ...prev, filter: e.target.value };
                });
              }}
              type="text"
              placeholder="Search"
            />
            <button type="submit">🔍</button>
          </div>
        </div>
      </div>
      {data && <Table columns={columns} data={data} setData={setData} />}
      <ul class="page">
        <li
          class="page__btn"
          onClick={() => {
            if (selectedPageNumber === 1) return;
            setSelectedPageNumber((prev) => prev - 1);
          }}
        >
          {"<"}
        </li>
        {numbersArary &&
          selectedPageNumber &&
          numbersArary
            .slice(selectedPageNumber, selectedPageNumber + 6)
            .map((number, i) => {
              return (
                <li
                  onClick={() => {
                    setSelectedPageNumber(number);
                  }}
                  class={`page__numbers ${
                    number === selectedPageNumber ? "active" : ""
                  }`}
                >
                  {number}
                </li>
              );
            })}
        <li class="page__dots">...</li>
        {numbersArary &&
          selectedPageNumber !== numbersArary[numbersArary.length - 1] && (
            <li
              onClick={() => {
                setSelectedPageNumber(numbersArary[numbersArary.length - 1]);
              }}
              class={`page__numbers`}
            >
              {numbersArary[numbersArary.length - 1]}
            </li>
          )}
        <li
          onClick={() => {
            if (selectedPageNumber === numbersArary[numbersArary.length - 1])
              return;
            setSelectedPageNumber((prev) => prev + 1);
          }}
          class="page__btn"
        >
          {">"}
        </li>
      </ul>
      <div className="p-2">
        <label className="select" for="slct">
          <select
            onChange={(e) => {
              setQueryParams((prev) => {
                return { ...prev, limit: e.target.value };
              });
            }}
            required="required"
          >
            <option value="" disabled="disabled" selected="selected">
              Select Limit Per Page
            </option>
            <option value={10}>10 / Page</option>
            <option value={20}>20 / Page</option>
            <option value={50}>50 / Page</option>
            <option value={100}>100 / Page</option>
            <option value={500}>500 / Page</option>
            <option value={1000}>1000 / Page</option>
          </select>
          <svg>
            <use xlinkHref="#select-arrow-down"></use>
          </svg>
        </label>
      </div>
    </div>
  );
}

export default App;
