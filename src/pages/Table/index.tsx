import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Input } from "antd";
import { debounce } from "lodash";
import { useAppMode } from "../../context/index";
import { AppMode } from '../../context/types';
import { useQuery } from "react-query";
import AppModeToggle from "../../components/AppModeToggle";
import { StyledTable, Wrapper, Centered } from "./styles";
import { MAX_LIMIT_DATA_COUNT, mapDatatoTableFields, API } from "./constants";
import { TableRow } from "./types";

const fetchData = async () => {
  const { data } = await axios.get(API);

  const results: TableRow[] = mapDatatoTableFields(
    // this might actually need to be an infinite query
    // based on next and fetched until 20 results. Was not sure though. Happy to adjust it though if needed
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
        // in requirements this
        // was just a filter. I went for the name filter, but happy to adjust it to
        // any filters needed.
        return element.name
          .toLocaleUpperCase()
          .includes(filter.toLocaleUpperCase());
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
    return <Centered>Loading...</Centered>;
  }
  if (isError) {
    return <Centered>Error on fetching </Centered>;
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
