import { mdiCalendarSync, mdiHandBackRightOutline } from "@mdi/js";
import { css, html, LitElement } from "lit";
import { property, state } from "lit/decorators.js";

import { resumeRoom } from "../api";
import { safeCustomElement, showToast } from "../ha";
import type { Localize } from "../localize";
import { sharedStyles } from "../styles";
import type { HomeAssistant } from "../types";

/**
 * Shown when a thermostat was changed by hand: an orange banner that says
 * what changed and sets the thermostat back to the schedule.
 */
@safeCustomElement("shs-resume-row")
export class ResumeRow extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property() entityId = "";
  @property({ attribute: false }) localize!: Localize;
  /** When the next block starts ("23:00"), or empty when there is none in view. */
  @property() until = "";

  @state() private _busy = false;

  private async _resume() {
    this._busy = true;
    try {
      await resumeRoom(this.hass, this.entityId);
    } catch (err: any) {
      showToast(this, this.localize("error.resume", { error: err?.message ?? String(err) }));
    } finally {
      this._busy = false;
    }
  }

  protected render() {
    return html`
      <div class="text" role="status">
        <strong
          ><ha-svg-icon class="hand" .path=${mdiHandBackRightOutline}></ha-svg-icon>${this.localize(
            "room.overridden",
          )}</strong
        >
        <span class="detail"
          >${this.until
            ? this.localize("room.overridden_until", { time: this.until })
            : this.localize("room.overridden_hint")}</span
        >
      </div>
      <button class="resume" ?disabled=${this._busy} @click=${this._resume}>
        <ha-svg-icon .path=${mdiCalendarSync}></ha-svg-icon>${this.localize("room.resume")}
      </button>
    `;
  }

  static styles = [
    sharedStyles,
    css`
      :host {
        --shs-manual: var(--warning-color, #ff9800);
        background: color-mix(in srgb, var(--shs-manual) 14%, transparent);
        border-inline-start: 4px solid var(--shs-manual);
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 10px 12px;
      }
      .text {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      strong {
        align-items: center;
        color: color-mix(in srgb, var(--shs-manual) 70%, var(--primary-text-color));
        display: inline-flex;
        font-size: 15px;
        gap: 6px;
      }
      .detail {
        font-size: 13px;
        line-height: 1.35;
      }
      .resume {
        align-items: center;
        align-self: flex-start;
        background: var(--shs-manual);
        border: none;
        border-radius: 18px;
        color: #1f2a37;
        cursor: pointer;
        display: inline-flex;
        font: inherit;
        font-size: 14px;
        font-weight: 600;
        gap: 6px;
        min-height: 36px;
        padding: 0 14px;
      }
      .resume:hover:not([disabled]),
      .resume:focus-visible {
        filter: brightness(0.94);
        outline: none;
      }
      .resume[disabled] {
        cursor: default;
        opacity: 0.6;
      }
      ha-svg-icon {
        --mdc-icon-size: 18px;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    "shs-resume-row": ResumeRow;
  }
}
