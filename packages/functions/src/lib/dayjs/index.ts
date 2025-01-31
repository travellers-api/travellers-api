/* eslint-disable-next-line no-restricted-imports */
import * as dayjs from "dayjs";
import * as timezone from "dayjs/plugin/timezone";
import * as utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export { dayjs };
