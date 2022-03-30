import { html, PropertyValues } from "lit";
import { property, query, state } from "lit/decorators.js";
import {
  KucBase,
  generateGUID,
  CustomEventDetail,
  dispatchCustomEvent
} from "../base/kuc-base";
import { visiblePropConverter, timeValueConverter } from "../base/converter";
import { getWidthElmByContext } from "../base/context";
import {
  FORMAT_IS_NOT_VALID,
  MAX_MIN_VALUE_IS_NOT_VALID
} from "../base/datetime/resource/constant";
import {
  validateProps,
  validateTimeValue,
  validateMaxMinTimeValue,
  validateTimeStep
} from "../base/validator";
import "../base/datetime/time";

type TimePickerProps = {
  className?: string;
  error?: string;
  id?: string;
  label?: string;
  max?: string;
  min?: string;
  value?: string;
  disabled?: boolean;
  hour12?: boolean;
  requiredIcon?: boolean;
  visible?: boolean;
  timeStep?: number;
  language?: "ja" | "en" | "zh" | "auto";
};

export class TimePicker extends KucBase {
  @property({ type: String, reflect: true, attribute: "class" }) className = "";
  @property({ type: String }) error = "";
  @property({ type: String, reflect: true, attribute: "id" }) id = "";
  @property({ type: String }) label = "";
  @property({ type: String }) language = "auto";
  @property({ type: String }) max = "";
  @property({ type: String }) min = "";
  @property({ type: String }) value? = "";
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) hour12 = false;
  @property({ type: Boolean }) requiredIcon = false;
  @property({
    type: Boolean,
    attribute: "hidden",
    reflect: true,
    converter: visiblePropConverter
  })
  visible = true;
  @property({ type: Number }) timeStep = 30;

  @query(".kuc-time-picker__group__label")
  private _labelEl!: HTMLFieldSetElement;

  @query(".kuc-time-picker__group__error")
  private _errorEl!: HTMLDivElement;

  @state()
  private _errorText = "";

  private _inputValue = "";
  private _errorInvalid = "";
  private _inputMax = "";
  private _inputMin = "";

  private _GUID: string;

  constructor(props?: TimePickerProps) {
    super();
    this._GUID = generateGUID();
    const validProps = validateProps(props);
    Object.assign(this, validProps);
  }

  update(changedProperties: PropertyValues) {
    if (changedProperties.has("max")) {
      if (!validateTimeValue(this.max)) {
        throw new Error(FORMAT_IS_NOT_VALID);
      }
      this.max = timeValueConverter(this.max);
      this._inputMax = this.max === "" ? "23:59" : this.max;
    }

    if (changedProperties.has("min")) {
      if (!validateTimeValue(this.min)) {
        throw new Error(FORMAT_IS_NOT_VALID);
      }
      this.min = timeValueConverter(this.min);
      this._inputMin = this.min === "" ? "00:00" : this.min;
    }

    if (changedProperties.has("value") && this.value !== undefined) {
      if (!validateTimeValue(this.value)) {
        throw new Error(FORMAT_IS_NOT_VALID);
      }
      this.value = timeValueConverter(this.value);
      this._inputValue = this.value;
      this._errorInvalid = "";
    }

    if (
      (changedProperties.has("max") ||
        changedProperties.has("min") ||
        (changedProperties.has("value") && this.value !== undefined)) &&
      !validateMaxMinTimeValue(this._inputMax, this._inputMin, this._inputValue)
    ) {
      throw new Error(MAX_MIN_VALUE_IS_NOT_VALID);
    }

    if (changedProperties.has("timeStep")) {
      if (!validateTimeStep(this.timeStep, this._inputMax, this._inputMin)) {
        throw new Error(FORMAT_IS_NOT_VALID);
      }
      this.timeStep = Math.round(this.timeStep);
    }

    super.update(changedProperties);
  }

  render() {
    return html`
      ${this._getStyleTagTemplate()}
      <fieldset
        class="kuc-time-picker__group"
        aria-describedby="${this._GUID}-error"
      >
        <legend class="kuc-time-picker__group__label">
          <span class="kuc-time-picker__group__label__text">${this.label}</span
          ><!--
          --><span
            class="kuc-time-picker__group__label__required-icon"
            ?hidden="${!this.requiredIcon}"
            >*</span
          >
        </legend>
        <kuc-base-time
          class="kuc-time-picker__group__input"
          .value="${this._inputValue}"
          .hour12="${this.hour12}"
          .disabled="${this.disabled}"
          .timeStep="${this.timeStep}"
          .max="${this._inputMax}"
          .min="${this._inputMin}"
          .language="${this._getLanguage()}"
          @kuc:base-time-change="${this._handleTimeChange}"
        >
        </kuc-base-time>
        <div
          class="kuc-time-picker__group__error"
          id="${this._GUID}-error"
          role="alert"
          ?hidden="${!this._errorText}"
        >
          ${this._errorText}
        </div>
      </fieldset>
    `;
  }

  updated() {
    this._updateErrorWidth();
    this._updateErrorText();
  }

  private _updateErrorText() {
    this._errorText = this._errorInvalid || this.error;
  }

  private _updateErrorWidth() {
    const labelWidth = getWidthElmByContext(this._labelEl);
    const inputGroupWitdh = 85;
    if (labelWidth > inputGroupWitdh) {
      this._errorEl.style.width = labelWidth + "px";
      return;
    }
    this._errorEl.style.width = inputGroupWitdh + "px";
  }

  private _handleTimeChange(event: CustomEvent) {
    event.preventDefault();
    event.stopPropagation();
    const detail: CustomEventDetail = {
      value: event.detail.value,
      oldValue: this.value
    };

    if (event.detail.error) {
      detail.value = undefined;
      this.value = undefined;
      this._errorInvalid = event.detail.error;
      this.error = "";
    } else {
      this.value = event.detail.value;
      this._errorInvalid = "";
    }

    dispatchCustomEvent(this, "change", detail);
  }

  private _getLanguage() {
    const languages = ["en", "ja", "zh"];
    if (languages.indexOf(this.language) !== -1) return this.language;

    if (languages.indexOf(document.documentElement.lang) !== -1)
      return document.documentElement.lang;

    return "en";
  }

  private _getStyleTagTemplate() {
    return html`
      <style>
        kuc-time-picker,
        kuc-time-picker *,
        :lang(en) kuc-time-picker,
        :lang(en) kuc-time-picker * {
          font-family: "HelveticaNeueW02-45Ligh", Arial,
            "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;
        }
        :lang(ja) kuc-time-picker,
        :lang(ja) kuc-time-picker * {
          font-family: "メイリオ", "Hiragino Kaku Gothic ProN", Meiryo,
            sans-serif;
        }
        :lang(zh) kuc-time-picker,
        :lang(zh) kuc-time-picker * {
          font-family: "微软雅黑", "Microsoft YaHei", "新宋体", NSimSun, STHeiti,
            Hei, "Heiti SC", sans-serif;
        }
        kuc-time-picker {
          font-size: 14px;
          color: #333333;
          display: inline-block;
          vertical-align: top;
          line-height: 1.5;
        }
        .kuc-time-picker__group__input {
          position: relative;
        }
        kuc-time-picker[hidden] {
          display: none;
        }
        .kuc-time-picker__group {
          display: flex;
          flex-direction: column;
          border: none;
          padding: 0px;
          height: auto;
          margin: 0px;
        }
        .kuc-time-picker__group__label {
          padding: 4px 0px 8px 0px;
          display: inline-block;
          white-space: nowrap;
        }
        .kuc-time-picker__group__label[hidden] {
          display: none;
        }
        .kuc-time-picker__group__label__required-icon {
          font-size: 20px;
          vertical-align: -3px;
          color: #e74c3c;
          margin-left: 4px;
          line-height: 1;
        }
        .kuc-time-picker__group__label__required-icon[hidden] {
          display: none;
        }
        .kuc-time-picker__group__error {
          line-height: 1.5;
          padding: 4px 18px;
          box-sizing: border-box;
          background-color: #e74c3c;
          color: #ffffff;
          margin: 8px 0px;
          word-break: break-all;
          white-space: normal;
        }
        .kuc-time-picker__group__error[hidden] {
          display: none;
        }
      </style>
    `;
  }
}

if (!window.customElements.get("kuc-time-picker")) {
  window.customElements.define("kuc-time-picker", TimePicker);
}
