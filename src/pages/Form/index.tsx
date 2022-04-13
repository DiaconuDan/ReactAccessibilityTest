import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import DatePicker from "react-datepicker";
import { isPast, isWithinInterval, endOfDay } from "date-fns";
import * as yup from "yup";
import { Input, Select } from "antd";
import AppModeToggle from "../../components/AppModeToggle";
import { StyledButton, ValidationError, Wrapper } from "./styles";
import { IFormInputs } from "./types";
import { AppMode } from "../../context/types";
import { useAppMode} from "../../context/index"
import {
  OverlapInterval,
  DROPDOWN_ERROR_MESSAGE,
  DATES_ERROR_MESSAGE,
  REQUIRED_ERROR_MESSAGE,
} from "./constants";
import "antd/dist/antd.css";
import "react-datepicker/dist/react-datepicker.css";

const { Option } = Select;

const schema = yup.object().shape({
  numericInput: yup.number().required(REQUIRED_ERROR_MESSAGE),
  // ideally here should be all the useEffects logic, but I feel I spent
  // more time than needed to figure it out. This can definitely be improved and 
  // reduce all the useEffect logic that might not be the easiest to follow up.
  // Because of this, it's also more error prone. Happy to discuss and find out
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
                  data-testid="dropdown"
                >
                  <Option value="A">A</Option>
                  <Option value="B">B</Option>
                  <Option value="C" data-testid="optionC">
                    C
                  </Option>
                </Select>
                <ValidationError>{errors?.dropdown?.message}</ValidationError>
              </>
            );
          }}
        />

        <Controller // these can be further improved to be separate Form Components with label as prop
          name="textInput"
          control={control}
          render={({ field }) => {
            return (
              <>
                <label> Input text </label> 
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
                <Input
                  {...field}
                  type="number"
                  disabled={isFormDisabled}
                  data-testid="numericInput"
                />
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
                <DatePicker // have used react-datepicker instead of ant design because of  https://github.com/ant-design/ant-design/issues/34952
                  dateFormat="dd/MM/yyyy"
                  todayButton="Today"
                  placeholderText="Select Start Date"
                  onChange={(date: Date) => {
                    field.onChange(date);

                    if (date > endDateValue) {
                      resetField("endDate");
                    }
                  }}
                  selected={field.value}
                  endDate={endDateValue || undefined}
                  disabled={isFormDisabled}
                  data-testid="startDate"
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
                  placeholderText="Select End Date"
                  onChange={(date: Date) => {
                    field.onChange(date);
                  }}
                  selected={field.value}
                  minDate={startDateValue || undefined}
                  disabled={isFormDisabled}
                  data-testid="endDate"
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
          data-testId="submit"
        >
          Submit
        </StyledButton>
      </form>
    </Wrapper>
  );
};

export default FormPage;


