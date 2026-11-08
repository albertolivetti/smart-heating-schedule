import { css, html, LitElement, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";

import { subscribeState } from "./api";
import { ensureHaElements, safeCustomElement } from "./ha";
import { localizer, type Localize } from "./localize";
import { sharedStyles } from "./styles";
import type { HomeAssistant, PanelState, Route } from "./types";
import "./views/main-view";

/** The seasonal heating schedule sidebar panel. */
@safeCustomElement("smart-heating-schedule-panel")
export class SmartHeatingSchedulePanel extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ type: Boolean, reflect: true }) narrow = false;
  @property({ attribute: false }) route?: Route;
  @property({ attribute: false }) panel?: unknown;

  @state() private _state?: PanelState;
  @state() private _error?: string;
  @state() private _ready = false;

  private _unsubscribe?: Promise<() => void>;
  private _localize?: Localize;
  private _language?: string;

  connectedCallback() {
    super.connectedCallback();
    ensureHaElements().then(() => (this._ready = true));
    if (this.hass && !this._unsubscribe) this._subscribe();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._unsubscribe?.then((unsubscribe) => unsubscribe()).catch(() => undefined);
    this._unsubscribe = undefined;
  }

  protected willUpdate(changed: PropertyValues) {
    if (!changed.has("hass") || !this.hass) return;
    if (!this._unsubscribe && this.isConnected) this._subscribe();
    this.toggleAttribute("dark", Boolean(this.hass.themes?.darkMode));
    if (this.hass.locale.language !== this._language) {
      this._language = this.hass.locale.language;
      this._localize = localizer(this._language);
    }
  }

  private _subscribe() {
    this._unsubscribe = subscribeState(this.hass, (state) => {
      this._state = state;
      this._error = undefined;
    });
    this._unsubscribe.catch((err) => {
      this._error = err?.code === "not_loaded" ? this._localize!("not_loaded") : (err?.message ?? String(err));
    });
  }

  protected render() {
    const localize = this._localize ?? localizer("en");
    if (this._error) {
      return html`<div class="message"><ha-card class="padded">${this._error}</ha-card></div>`;
    }
    if (!this._state || !this._ready) {
      return html`<div class="message secondary">${localize("loading")}</div>`;
    }
    return html`<shs-main-view
      .hass=${this.hass}
      .state=${this._state}
      .narrow=${this.narrow}
      .localize=${localize}
    ></shs-main-view>`;
  }

  static styles = [
    sharedStyles,
    css`
      :host {
        background: var(--primary-background-color);
        display: block;
        height: 100%;
        overflow-y: auto;
        /* Light themes: darker block text and lighter block backgrounds. */
        --shs-text-mix: 55%;
        --shs-block-mix: 38%;
        --shs-block-list-mix: 14%;
      }
      :host([dark]) {
        --shs-text-mix: 100%;
        --shs-block-mix: 42%;
        --shs-block-list-mix: 18%;
      }
      .message {
        margin: 0 auto;
        max-width: 600px;
        padding: 32px 16px;
        text-align: center;
      }
      .padded {
        padding: 16px;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    "smart-heating-schedule-panel": SmartHeatingSchedulePanel;
  }
}
