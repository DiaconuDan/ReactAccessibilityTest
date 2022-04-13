import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "antd/dist/antd.css";
import "react-datepicker/dist/react-datepicker.css";
import AppModeToggle from "../../components/AppModeToggle";
import { StyledButton, ValidationError, Wrapper } from "./styles";
import { IFormInputs } from "./types";
import { Input, Select } from "antd";
import { useForm, SubmitHandler, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { isPast, isWithinInterval, endOfDay } from "date-fns";
import { AppMode, useAppMode } from "../../App";
import {
  OverlapInterval,
  DROPDOWN_ERROR_MESSAGE,
  DATES_ERROR_MESSAGE,
} from "./constants";

const schema = yup.object().shape({
  numericInput: yup.number().required("This field is required"),
});

const FormPage: React.FunctionComponent = () => {
  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    setError,
    clearErrors,
    resetField,
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  const { appMode } = useAppMode();
  const isFormValid = isValid && Object.keys(errors).length === 0;
  const isFormDisabled = appMode === AppMode.READ;
  const navigate = useNavigate();

  const formSubmitHandler: SubmitHandler<IFormInputs> = (data: IFormInputs) => {
    if (isFormValid) {
      navigate("/table");
    }
  };

  const { Option } = Select;

  const textInputValue: string | undefined = useWatch({
    name: "textInput",
    control,
  });

  const dropdownValue: string | undefined = useWatch({
    name: "dropdown",
    control,
  });

  const startDateValue: Date | undefined = useWatch({
    name: "startDate",
    control,
  });

  const endDateValue: Date | undefined = useWatch({
    name: "endDate",
    control,
  });

  useEffect(() => {
    const shouldDropdownError =
      dropdownValue === "C" && (!textInputValue || textInputValue.length < 3);

    if (shouldDropdownError) {
      setError("dropdown", {
        type: "custom",
        message: DROPDOWN_ERROR_MESSAGE,
      });
    } else {
      clearErrors("dropdown");
    }
  }, [textInputValue, dropdownValue, clearErrors, setError]);

  useEffect(() => {
    const shouldOverlapError =
      startDateValue &&
      endDateValue &&
      isWithinInterval(startDateValue, OverlapInterval) &&
      isWithinInterval(endDateValue, OverlapInterval);

    if (shouldOverlapError) {
      setError("endDate", {
        type: "custom",
        message: DATES_ERROR_MESSAGE,
      });
    } else {
      clearErrors("endDate");
    }
  }, [startDateValue, endDateValue, setError, clearErrors]);

  const submitButtonColor = isPast(endOfDay(startDateValue))
    ? "yellow"
    : "green";

  return (
    <Wrapper>
      <form onSubmit={handleSubmit(formSubmitHandler)}>
        <AppModeToggle />

        <div> Dropdown </div>
        <Controller
          name="dropdown"
          control={control}
          render={({ field }) => {
            return (
              <>
                <Select
                  showSearch
                  placeholder="Select a letter"
                  optionFilterProp="children"
                  {...field}
                  disabled={isFormDisabled}
                >
                  <Option value="A">A</Option>
                  <Option value="B">B</Option>
                  <Option value="C">C</Option>
                </Select>
                <ValidationError>{errors?.dropdown?.message}</ValidationError>
              </>
            );
          }}
        />

        <Controller
          name="textInput"
          control={control}
          render={({ field }) => {
            return (
              <>
                <label> Input text </label>
                <br />
                <Input {...field} disabled={isFormDisabled} />
                <ValidationError>{errors?.textInput?.message}</ValidationError>
              </>
            );
          }}
        />
        <Controller
          name="numericInput"
          control={control}
          render={({ field }) => {
            return (
              <>
                <label> Input number </label>
                <Input {...field} type="number" disabled={isFormDisabled} />
                <ValidationError>
                  {errors?.numericInput?.message}
                </ValidationError>
              </>
            );
          }}
        />

        <Controller
          name="startDate"
          control={control}
          render={({ field }) => {
            return (
              <>
                <label> Start </label>
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  todayButton="Today"
                  placeholderText="Select Date"
                  onChange={(date: Date) => {
                    field.onChange(date);

                    if (date > endDateValue) {
                      resetField("endDate");
                    }
                  }}
                  selected={field.value}
                  endDate={endDateValue || undefined}
                  disabled={isFormDisabled}
                />

                <ValidationError>{errors?.startDate?.message}</ValidationError>
              </>
            );
          }}
        />

        <Controller
          name="endDate"
          control={control}
          render={({ field }) => {
            return (
              <>
                <label> End </label>
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  todayButton="Today"
                  placeholderText="Select Date"
                  onChange={(date: Date) => {
                    field.onChange(date);
                  }}
                  selected={field.value}
                  minDate={startDateValue || undefined}
                  disabled={isFormDisabled}
                />

                <ValidationError>{errors?.endDate?.message}</ValidationError>
              </>
            );
          }}
        />
          <StyledButton
            htmlType="submit"
            color={submitButtonColor}
            disabled={isFormDisabled}
          >
            Submit
          </StyledButton>
      </form>
    </Wrapper>
  );
};

export default FormPage;

// have used react-datepicker instead of ant design because of  https://github.com/ant-design/ant-design/issues/34952