import { mdiContentCopy, mdiDeleteOutline, mdiPencilOutline } from "@mdi/js";
import { css, html, LitElement, nothing } from "lit";
import { property } from "lit/decorators.js";

import { weekdayName } from "../format";
import { fireEvent, safeCustomElement } from "../ha";
import type { Localize } from "../localize";
import { WEEKDAYS } from "../schedule";
import { sharedStyles } from "../styles";
import type { Limits } from "../temperature";
import type { Program } from "../types";
import "./timeline-editor";

/**
 * One program of a season: its name, the weekdays it runs on and its time
 * blocks on an editable timeline.
 *
 * Events: day-toggled ({day}), blocks-changed ({blocks, final}), rename,
 * duplicate, delete.
 */
@safeCustomElement("shs-program-card")
export class ProgramCard extends LitElement {
  @property({ attribute: false }) program!: Program;
  /** The other programs of the same season, to show which day is where. */
  @property({ attribute: false }) others: Program[] = [];
  /** Weekday keys in display order. */
  @property({ attribute: false }) days: string[] = [...WEEKDAYS];
  @property() unit = "°C";
  @property({ attribute: false }) limits: Limits = { min: 5, max: 30, step: 0.5 };
  @property({ type: Boolean }) canTurnOff = true;
  @property() language = "en";
  @property({ type: Boolean }) h12 = false;
  @property({ type: Boolean }) readOnly = false;
  @property({ attribute: false }) now: number | null = null;
  @property({ attribute: false }) localize!: Localize;

  private _dayName(day: string, style: "long" | "short" | "narrow" = "long"): string {
    const index = WEEKDAYS.indexOf(day as (typeof WEEKDAYS)[number]);
    if (style === "narrow") {
      return new Intl.DateTimeFormat(this.language, { weekday: "narrow" }).format(new Date(2024, 0, 1 + index));
    }
    return weekdayName(this.language, index, style);
  }

  private _daysLabel(): string {
    const { days } = this.program;
    if (days.length === 7) return this.localize("programs.every_day");
    if (!days.length) return this.localize("programs.no_days");
    return this.days
      .filter((day) => days.includes(day))
      .map((day) => this._dayName(day, "short"))
      .join(" · ");
  }

  protected render() {
    const name = this.program.name;
    return html`
      <ha-card>
        <div class="header">
          <div class="title">
            <h3>${name}</h3>
            <span class="secondary">${this._daysLabel()}</span>
          </div>
          ${this.readOnly
            ? nothing
            : html`<ha-icon-button
                  .path=${mdiPencilOutline}
                  .label=${this.localize("programs.rename", { name })}
                  @click=${() => fireEvent(this, "rename")}
                ></ha-icon-button>
                <ha-icon-button
                  .path=${mdiContentCopy}
                  .label=${this.localize("programs.duplicate", { name })}
                  @click=${() => fireEvent(this, "duplicate")}
                ></ha-icon-button>
                <ha-icon-button
                  .path=${mdiDeleteOutline}
                  .label=${this.localize("programs.delete", { name })}
                  @click=${() => fireEvent(this, "delete")}
                ></ha-icon-button>`}
        </div>

        <div class="days" role="group" aria-label=${this._daysLabel()}>
          ${this.days.map((day) => {
            const mine = this.program.days.includes(day);
            const owner = mine ? undefined : this.others.find((program) => program.days.includes(day));
            const full = this._dayName(day);
            const title = mine
              ? this.localize("programs.day_mine", { day: full })
              : owner
                ? this.localize("programs.day_other", { day: full, program: owner.name })
                : this.localize("programs.day_free", { day: full });
            return html`<button
              class="day ${mine ? "mine" : owner ? "other" : "free"}"
              aria-pressed=${mine}
              aria-label=${title}
              title=${title}
              ?disabled=${this.readOnly}
              @click=${() => fireEvent(this, "day-toggled", { day })}
            >
              ${this._dayName(day, "narrow")}
            </button>`;
          })}
        </div>

        <shs-timeline-editor
          .blocks=${this.program.blocks}
          .unit=${this.unit}
          .limits=${this.limits}
          .canTurnOff=${this.canTurnOff}
          .language=${this.language}
          .h12=${this.h12}
          .readOnly=${this.readOnly}
          .now=${this.now}
          .localize=${this.localize}
        ></shs-timeline-editor>
      </ha-card>
    `;
  }

  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
      }
      ha-card {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 12px 16px 14px;
      }
      .header {
        align-items: center;
        display: flex;
        gap: 0;
      }
      .title {
        display: flex;
        flex: 1;
        flex-direction: column;
        min-width: 0;
      }
      h3 {
        font-size: 16px;
        font-weight: 600;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .title .secondary {
        font-size: 13px;
      }
      ha-icon-button {
        --mdc-icon-button-size: 40px;
        --mdc-icon-size: 20px;
        color: var(--secondary-text-color);
      }
      .days {
        display: flex;
        gap: 4px;
        max-width: 360px;
      }
      .day {
        border-radius: 20px;
        box-sizing: border-box;
        cursor: pointer;
        flex: 1 1 0;
        font: inherit;
        font-size: 13px;
        font-weight: 700;
        height: 40px;
        min-width: 0;
        padding: 0;
      }
      .day.mine {
        background: var(--primary-color);
        border: 2px solid var(--primary-color);
        color: var(--text-primary-color, #fff);
      }
      .day.other {
        background: color-mix(in srgb, var(--primary-text-color) 7%, transparent);
        border: 2px solid transparent;
        color: var(--secondary-text-color);
      }
      .day.free {
        background: none;
        border: 2px dashed var(--warning-color, #b4410b);
        color: var(--warning-color, #b4410b);
      }
      .day:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
      }
      .day[disabled] {
        cursor: default;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    "shs-program-card": ProgramCard;
  }
}
