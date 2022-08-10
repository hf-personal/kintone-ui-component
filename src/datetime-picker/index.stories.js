import { DateTimePicker } from "./index.ts";
import { html } from "lit-html";

export default {
  title: "desktop/datetime-picker",
  argTypes: {
    className: { name: "className" },
    error: { name: "error" },
    id: { name: "id" },
    label: { name: "label" },
    language: {
      name: "language",
      control: {
        type: "select",
        options: ["auto", "en", "ja", "zh"],
      },
    },
    value: { name: "value" },
    requiredIcon: { name: "requiredIcon" },
    disabled: { name: "disabled" },
    hour12: { name: "hour12" },
    visible: { name: "visible" },
    timeStep: { name: "timeStep" },
    min: { name: "min" },
    max: { name: "max" },
  },
  parameters: {
    actions: {
      handles: ["change"],
    },
  },
};
const Template = (args) => {
  // const handleDateChange = (event) => {
  //   console.log(event);
  // };
  // return html`
  //   <kuc-datetime-picker
  //     .className="${args.className}"
  //     .error="${args.error}"
  //     .id="${args.id}"
  //     .label="${args.label}"
  //     .language="${args.language}"
  //     .value="${args.value}"
  //     .disabled="${args.disabled}"
  //     .hour12="${args.hour12}"
  //     .requiredIcon="${args.requiredIcon}"
  //     .visible="${args.visible}"
  //     .timeStep="${args.timeStep}"
  //     .min="${args.min}"
  //     .max="${args.max}"
  //     @change="${handleDateChange}"
  //   ></kuc-datetime-picker>
  // `;
  const div = document.createElement("div");
  const datePicker = new DateTimePicker({ ...args });
  datePicker.addEventListener("change", (event) => {
    console.log(event);
  });
  const button = document.createElement("button");
  button.innerText = "get value";
  button.addEventListener("click", (event) => {
    console.log(datePicker.value, "value");
  });

  const buttonSetUndefined = document.createElement("button");
  buttonSetUndefined.innerText = "set undefined";
  buttonSetUndefined.addEventListener("click", (event) => {
    datePicker.value = undefined;
  });

  const buttonSetEmpty = document.createElement("button");
  buttonSetEmpty.innerText = "set empty";
  buttonSetEmpty.addEventListener("click", (event) => {
    datePicker.value = "";
  });


  const buttonSetNull = document.createElement("button");
  buttonSetNull.innerText = "set null";
  buttonSetNull.addEventListener("click", (event) => {
    datePicker.value = null;
  });

  div.appendChild(datePicker);
  div.appendChild(button);
  div.appendChild(buttonSetUndefined);
  div.appendChild(buttonSetNull);
  div.appendChild(buttonSetEmpty);

  return div;
};

export const Base = Template.bind({});
Base.args = {
  className: "datetime-class",
  error: "Custom error",
  id: "datetime-id",
  label: "Date and Time label",
  language: "en",
  value: "2021-12-12",
  disabled: false,
  hour12: true,
  requiredIcon: true,
  visible: true,
  timeStep: 60,
  min: "00:00",
  max: "23:59",
};

export const BaseHour12 = Template.bind({});
BaseHour12.args = {
  className: "datetime-class",
  error: "",
  id: "datetime-id",
  label: "Date and Time label",
  language: "en",
  value: "2021-02-28",
  disabled: false,
  hour12: true,
  requiredIcon: false,
  visible: true,
  timeStep: 30,
  min: "00:00",
  max: "20:00",
};

export const BaseHour24 = Template.bind({});
BaseHour24.args = {
  className: "datetime-class",
  error: "",
  id: "datetime-id",
  label: "Date and Time label",
  language: "en",
  value: "2021-02-28",
  disabled: false,
  hour12: false,
  requiredIcon: false,
  visible: true,
  timeStep: 30,
  min: "00:00",
  max: "20:00",
};

export const BaseLanguageEN = Template.bind({});
BaseLanguageEN.args = {
  className: "datetime-class",
  error: "",
  id: "datetime-id",
  label: "Date and Time label",
  language: "en",
  value: "2021-02-28",
  disabled: false,
  hour12: false,
  requiredIcon: false,
  visible: true,
  timeStep: 60,
  min: "00:00",
  max: "23:59",
};

export const BaseLanguageJA = Template.bind({});
BaseLanguageJA.args = {
  className: "datetime-class",
  error: "",
  id: "datetime-id",
  label: "Date and Time label",
  language: "ja",
  value: "2021-02-28",
  disabled: false,
  hour12: false,
  requiredIcon: false,
  visible: true,
  timeStep: 60,
  min: "00:00",
  max: "23:59",
};

export const BaseLanguageZH = Template.bind({});
BaseLanguageZH.args = {
  className: "datetime-class",
  error: "",
  id: "datetime-id",
  label: "Date and Time label",
  language: "zh",
  value: "2021-02-28",
  disabled: false,
  hour12: false,
  requiredIcon: false,
  visible: true,
  timeStep: 60,
  min: "00:00",
  max: "23:59",
};

export const BaseError = Template.bind({});
BaseError.args = {
  className: "datetime-class",
  error: "Datetime error",
  id: "datetime-id",
  label: "Date and Time label",
  language: "en",
  value: "2021-02-28",
  disabled: false,
  hour12: false,
  requiredIcon: false,
  visible: true,
  timeStep: 30,
  min: "00:00",
  max: "23:59",
};
