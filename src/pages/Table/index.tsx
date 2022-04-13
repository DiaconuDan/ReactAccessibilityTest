import React, { useEffect, useState, useMemo } from "react";
import { debounce } from "lodash";
import { useAppMode, AppMode } from "../../App";
import { useQuery } from "react-query";
import axios from "axios";
import { Input } from "antd";
import AppModeToggle from "../../components/AppModeToggle";
import { StyledTable, Wrapper } from "./styles";
import { MAX_LIMIT_DATA_COUNT, mapDatatoTableFields,API } from "./constants";
import { TableRow } from "./types";

const fetchData = async () => {
  const { data } = await axios.get(API);
  const results: TableRow[] = mapDatatoTableFields(
    data?.results?.slice(0, MAX_LIMIT_DATA_COUNT - 1)
  );

  return results;
};

const TablePage: React.FunctionComponent = () => {
  const { data, isError, isLoading } = useQuery("posts", fetchData);

  const [activeTableData, setActiveTableData] = useState<TableRow[]>();
  const [filter, setFilter] = useState("");
  const { appMode } = useAppMode();

  const { Column } = StyledTable;
  const shouldDisplayFilter = appMode === AppMode.EDIT;

  useEffect(() => {
    setFilter("");
  }, [appMode]);

  useEffect(() => {
    const isFilterEmpty = filter === "";

    if (isFilterEmpty) {
      setActiveTableData(data);
    } else {
      const updatedTableValues = data?.filter((element: TableRow) => {
        return element.name.toLocaleUpperCase().includes(filter.toLocaleUpperCase());
      });

      setActiveTableData(updatedTableValues);
    }
  }, [filter, data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filterValue = e.target.value;

    setFilter(filterValue);
  };

  const debouncedResults = useMemo(() => {
    return debounce(handleChange, 300);
  }, []);

  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error on fetching </div>;
  }

  return (
    <Wrapper>
      <AppModeToggle />
      {shouldDisplayFilter && (
        <Input placeholder="Filter by name" onChange={debouncedResults} />
      )}
      <StyledTable dataSource={activeTableData}>
        <Column title="Name" dataIndex="name" key="name" />
        <Column title="Height" dataIndex="height" key="height" />
        <Column title="Gender" dataIndex="gender" key="gender" />
      </StyledTable>
    </Wrapper>
  );
};

export default TablePage;
