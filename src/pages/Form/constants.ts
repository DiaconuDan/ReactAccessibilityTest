import { Interval} from './types' ;

export const DROPDOWN_ERROR_MESSAGE = 'Criteria not met.';
export const DATES_ERROR_MESSAGE = 'Dates overlap.';
export const REQUIRED_ERROR_MESSAGE = 'This field is required.';

export const OverlapInterval: Interval = {
    start: new Date("05-06-2020"),
    end: new Date("06-06-2020"),
  };
