import {
  mdiArrowSplitVertical,
  mdiChevronLeft,
  mdiChevronRight,
  mdiClose,
  mdiDeleteOutline,
  mdiMinus,
  mdiPlus,
} from "@mdi/js";
import { css, html, LitElement, nothing, type PropertyValues, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";

import { BLOCK_TEXT, temperatureColor } from "../colors";
import { formatMinutes } from "../format";
import { fireEvent, safeCustomElement } from "../ha";
import type { Localize } from "../localize";
import {
  DAY,
  deleteBlock,
  moveBoundary,
  SLOT,
  MAX_BLOCK_NAME,
  setBlockName,
  setBlockTemperature,
  splitBlock,
  toMinutes,
  toSegments,
} from "../schedule";
import { sharedStyles } from "../styles";
import { clamp, defaultTemperature, FAHRENHEIT, formatTemperature, type Limits } from "../temperature";
import type { Block } from "../types";

/**
 * A day as a coloured 24 hour bar that is edited in place, like
 * scheduler-card: tap a block to select it, drag the dividers to change the
 * times, and change the selected block's temperature with − and +.
 *
 * Fires `blocks-changed` ({blocks, final}); `final` is false while dragging.
 */
@safeCustomElement("shs-timeline-editor")
export class TimelineEditor extends LitElement {
  @property({ attribute: false }) blocks: Block[] = [];
  @property() unit = "°C";
  @property({ attribute: false }) limits: Limits = { min: 5, max: 30, step: 0.5 };
  @property({ type: Boolean }) canTurnOff = true;
  @property() language = "en";
  @property({ type: Boolean }) h12 = false;
  @property({ type: Boolean }) readOnly = false;
  /** Minutes since midnight to mark as "now", or null. */
  @property({ attribute: false }) now: number | null = null;
  @property({ attribute: false }) localize!: Localize;

  @state() private _selected: number | null = null;
  @state() private _drag: { index: number; blocks: Block[] } | null = null;
  @state() private _width = 0;

  private _resize = new ResizeObserver((entries) => {
    this._width = entries[0]?.contentRect.width ?? 0;
  });

  connectedCallback() {
    super.connectedCallback();
    this._resize.observe(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._resize.disconnect();
  }

  protected willUpdate(changed: PropertyValues) {
    if (changed.has("blocks") && this._selected !== null && this._selected >= this.blocks.length) {
      this._selected = this.blocks.length - 1;
    }
  }

  /** Whole and half degrees (or whole °F) are easier to tap than the device's 0.1 step. */
  private get _step(): number {
    return Math.max(this.limits.step, this.unit === FAHRENHEIT ? 1 : 0.5);
  }

  private get _blocks(): Block[] {
    return this._drag?.blocks ?? this.blocks;
  }

  private _emit(blocks: Block[], final = true) {
    fireEvent(this, "blocks-changed", { blocks, final });
  }

  private _select(index: number) {
    this._selected = this._selected === index ? null : index;
  }

  /** Touch screens edit times with − / + only: dragging thin dividers with a finger is unreliable. */
  private get _touch(): boolean {
    return window.matchMedia?.("(pointer: coarse)").matches ?? false;
  }

  /**
   * Select the block under a tap. Blocks narrower than a finger are hard to
   * hit, so the narrowest block within about 14px of the tap wins.
   */
  private _tap(ev: MouseEvent, index: number) {
    if (ev.detail === 0) {
      this._select(index); // keyboard
      return;
    }
    const track = this.renderRoot.querySelector(".track") as HTMLElement;
    const rect = track.getBoundingClientRect();
    const reach = (14 / rect.width) * DAY;
    const minutes = ((ev.clientX - rect.left) / rect.width) * DAY;
    const segments = toSegments(this.blocks);
    let best = index;
    for (const [i, segment] of segments.entries()) {
      const near = segment.start <= minutes + reach && segment.end >= minutes - reach;
      const width = segment.end - segment.start;
      if (near && width < segments[best].end - segments[best].start) best = i;
    }
    this._select(best);
  }

  private _minutesAt(clientX: number): number {
    const track = this.renderRoot.querySelector(".track") as HTMLElement;
    const rect = track.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * DAY;
  }

  private _pointerDown(ev: PointerEvent, index: number) {
    if (this.readOnly || ev.button > 0) return;
    ev.preventDefault();
    const handle = ev.currentTarget as HTMLElement;
    handle.setPointerCapture?.(ev.pointerId);
    handle.focus();
    const original = this.blocks;
    this._drag = { index, blocks: original };

    const move = (event: PointerEvent) => {
      if (!this._drag) return;
      const blocks = moveBoundary(original, index, this._minutesAt(event.clientX));
      if (blocks[index].start !== this._drag.blocks[index].start) this._drag = { index, blocks };
    };
    const end = () => {
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", end);
      handle.removeEventListener("pointercancel", end);
      const dragged = this._drag?.blocks ?? original;
      this._drag = null;
      if (dragged[index].start === original[index].start) return;
      // Apply the new time to the current blocks: they may have been updated
      // (a save finishing, another device) while dragging.
      if (this.blocks.length !== original.length) return;
      this._emit(moveBoundary(this.blocks, index, toMinutes(dragged[index].start)));
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", end);
    handle.addEventListener("pointercancel", end);
  }

  private _dividerKey(ev: KeyboardEvent, index: number, start: number) {
    const delta = { ArrowLeft: -SLOT, ArrowDown: -SLOT, ArrowRight: SLOT, ArrowUp: SLOT }[ev.key];
    if (!delta || this.readOnly) return;
    ev.preventDefault();
    this._emit(moveBoundary(this.blocks, index, start + delta));
  }

  private _changeTemperature(index: number, direction: number) {
    const current = this.blocks[index].temperature ?? defaultTemperature(this.unit);
    const limits = { ...this.limits, step: this._step };
    this._emit(setBlockTemperature(this.blocks, index, clamp(current + direction * this._step, limits)));
  }

  private _toggleOff(index: number, off: boolean) {
    const temperature = off ? null : clamp(defaultTemperature(this.unit), { ...this.limits, step: this._step });
    this._emit(setBlockTemperature(this.blocks, index, temperature));
  }

  private _rename(index: number, name: string) {
    if ((this.blocks[index].name ?? "") === name.trim()) return;
    this._emit(setBlockName(this.blocks, index, name));
  }

  private _split(index: number) {
    const blocks = splitBlock(this.blocks, index);
    if (!blocks) return;
    this._selected = index + 1;
    this._emit(blocks);
  }

  private _delete(index: number) {
    this._selected = Math.max(0, index - 1);
    this._emit(deleteBlock(this.blocks, index));
  }

  /** "HH:MM", with 24:00 for the end of the day. */
  private _time(minutes: number): string {
    return minutes === DAY && !this.h12 ? "24:00" : formatMinutes(minutes, this.h12);
  }

  private _label(temperature: number | null, compact = true): string {
    return temperature === null
      ? this.localize("block.off")
      : formatTemperature(temperature, this.unit, this._step, compact, this.language);
  }

  protected render() {
    const segments = toSegments(this._blocks);
    const dividers = segments.slice(1).map((segment, i) => ({ index: i + 1, minutes: segment.start }));
    const selected = this._selected;
    const active = (index: number) =>
      this._drag?.index === index || index === selected || (selected !== null && index === selected + 1);
    // Time labels need about 40px; leave out those that would overlap a shown one.
    const minGap = this._width ? (40 / this._width) * DAY : 0;
    const labels: { index: number; minutes: number }[] = [];
    for (const divider of dividers) {
      const previous = labels[labels.length - 1];
      if (previous && divider.minutes - previous.minutes < minGap) {
        if (!active(divider.index) || active(previous.index)) continue;
        labels.pop();
      }
      labels.push(divider);
    }

    return html`
      <div class="labels" aria-hidden="true">
        ${labels.map(
          ({ index, minutes }) =>
            html`<span class=${active(index) ? "active" : ""} style="left:${(minutes / DAY) * 100}%"
              >${formatMinutes(minutes, this.h12)}</span
            >`,
        )}
      </div>
      <div class="track">
        <div class="bar">
          ${segments.map((segment, index) => {
            const label = this._label(segment.temperature);
            const range = `${this._time(segment.start)} – ${this._time(segment.end)}`;
            const name = segment.name ? `${segment.name}, ` : "";
            return html`<button
              class="block ${index === selected ? "selected" : ""} ${segment.temperature === null ? "off" : ""}"
              style="left:${(segment.start / DAY) * 100}%;width:${((segment.end - segment.start) / DAY) *
              100}%;--block-color:${temperatureColor(segment.temperature, this.unit)}"
              aria-pressed=${index === selected}
              aria-label="${name}${range}, ${label}"
              title=${segment.name ?? nothing}
              @click=${(ev: MouseEvent) => this._tap(ev, index)}
            >
              <span class="text"
                >${segment.name ? html`<span class="name">${segment.name}</span>` : nothing}<span>${label}</span></span
              >
            </button>`;
          })}
        </div>
        ${this.readOnly || this._touch
          ? nothing
          : dividers.map(
              ({ index, minutes }) => html`<button
                class="divider ${active(index) ? "active" : ""}"
                style="left:${(minutes / DAY) * 100}%"
                aria-label=${this.localize("block.divider", { time: formatMinutes(minutes, this.h12) })}
                @pointerdown=${(ev: PointerEvent) => this._pointerDown(ev, index)}
                @keydown=${(ev: KeyboardEvent) => this._dividerKey(ev, index, minutes)}
              >
                <span></span>
              </button>`,
            )}
        ${selected === null || !segments[selected]
          ? nothing
          : html`<div
              class="selection"
              aria-hidden="true"
              style="--center:${((segments[selected].start + segments[selected].end) / 2 / DAY) *
              100}%;--width:${((segments[selected].end - segments[selected].start) / DAY) * 100}%"
            ></div>`}
        ${this.now === null
          ? nothing
          : html`<div class="now" style="left:${(this.now / DAY) * 100}%" aria-hidden="true"></div>`}
      </div>
      <div class="ticks" aria-hidden="true">
        ${[0, 6, 12, 18, 24].map(
          (hour) => html`<span>${this.h12 ? formatMinutes(hour * 60, true, true) : String(hour).padStart(2, "0")}</span>`,
        )}
      </div>
      ${selected === null || this.readOnly
        ? this.readOnly
          ? nothing
          : html`<p class="hint secondary">${this.localize(this._touch ? "block.hint_touch" : "block.hint")}</p>`
        : this._renderEditor(segments, selected)}
    `;
  }

  private _renderEditor(segments: ReturnType<typeof toSegments>, index: number) {
    const segment = segments[index];
    if (!segment) return nothing;
    const off = segment.temperature === null;
    const first = index === 0;
    const last = index === segments.length - 1;
    const step = formatTemperature(this._step, this.unit, this._step, true, this.language);
    const startLabel = this.localize("block.start");
    const endLabel = this.localize("block.end");
    const range = `${this._time(segment.start)} – ${this._time(segment.end)}`;
    const value = segment.temperature;

    return html`<div class="editor" style="--block-color:${temperatureColor(segment.temperature, this.unit)}">
      <div class="editor-header">
        <button
          class="plain icon"
          ?disabled=${first}
          aria-label=${this.localize("block.previous")}
          title=${this.localize("block.previous")}
          @click=${() => (this._selected = index - 1)}
        >
          <ha-svg-icon .path=${mdiChevronLeft}></ha-svg-icon>
        </button>
        <span class="swatch"></span>
        <span class="range">${range}</span>
        <button
          class="plain icon"
          ?disabled=${last}
          aria-label=${this.localize("block.next")}
          title=${this.localize("block.next")}
          @click=${() => (this._selected = index + 1)}
        >
          <ha-svg-icon .path=${mdiChevronRight}></ha-svg-icon>
        </button>
        <span class="spacer"></span>
        <button
          class="outlined split"
          aria-label=${this.localize("block.split")}
          title=${this.localize("block.split")}
          ?disabled=${segment.end - segment.start < 2 * SLOT}
          @click=${() => this._split(index)}
        >
          <ha-svg-icon .path=${mdiArrowSplitVertical}></ha-svg-icon
          ><span class="split-label">${this.localize("block.split")}</span>
        </button>
        <button
          class="outlined icon danger"
          ?disabled=${segments.length < 2}
          aria-label=${this.localize("block.delete")}
          title=${this.localize("block.delete")}
          @click=${() => this._delete(index)}
        >
          <ha-svg-icon .path=${mdiDeleteOutline}></ha-svg-icon>
        </button>
        <button
          class="plain icon"
          aria-label=${this.localize("block.close")}
          title=${this.localize("block.close")}
          @click=${() => (this._selected = null)}
        >
          <ha-svg-icon .path=${mdiClose}></ha-svg-icon>
        </button>
      </div>
      <label class="name-field">
        <span class="time-label secondary">${this.localize("block.name")}</span>
        <input
          type="text"
          maxlength=${MAX_BLOCK_NAME}
          .value=${segment.name ?? ""}
          placeholder=${this.localize("block.name_placeholder")}
          @change=${(ev: Event) => this._rename(index, (ev.target as HTMLInputElement).value)}
          @keydown=${(ev: KeyboardEvent) => {
            if (ev.key === "Enter") (ev.target as HTMLInputElement).blur();
          }}
        />
      </label>
      <div class="controls">
        <div class="group temp">
          <button
            class="round"
            ?disabled=${off || (value !== null && value <= this.limits.min)}
            aria-label=${this.localize("block.lower", { step })}
            @click=${() => this._changeTemperature(index, -1)}
          >
            <ha-svg-icon .path=${mdiMinus}></ha-svg-icon>
          </button>
          <span class="temperature" aria-live="polite">${this._label(value, false)}</span>
          <button
            class="round"
            ?disabled=${off || (value !== null && value >= this.limits.max)}
            aria-label=${this.localize("block.raise", { step })}
            @click=${() => this._changeTemperature(index, 1)}
          >
            <ha-svg-icon .path=${mdiPlus}></ha-svg-icon>
          </button>
          <label class="off">
            <input
              type="checkbox"
              .checked=${off}
              @change=${(ev: Event) => this._toggleOff(index, (ev.target as HTMLInputElement).checked)}
            />${this.localize("block.off")}
          </label>
        </div>
        ${this._renderTime(startLabel, segment.start, first, (minutes) =>
          this._emit(moveBoundary(this.blocks, index, minutes)),
        )}
        ${this._renderTime(endLabel, segment.end, last, (minutes) =>
          this._emit(moveBoundary(this.blocks, index + 1, minutes)),
        )}
      </div>
    </div>`;
  }

  private _renderTime(label: string, minutes: number, locked: boolean, change: (minutes: number) => void) {
    return html`<div class="group time">
      <span class="time-label secondary">${label}</span>
      <button
        class="outlined small"
        ?disabled=${locked}
        aria-label=${this.localize("block.earlier", { what: label })}
        @click=${() => change(minutes - SLOT)}
      >
        <ha-svg-icon .path=${mdiMinus}></ha-svg-icon>
      </button>
      <span class="time-value">${this._time(minutes)}</span>
      <button
        class="outlined small"
        ?disabled=${locked}
        aria-label=${this.localize("block.later", { what: label })}
        @click=${() => change(minutes + SLOT)}
      >
        <ha-svg-icon .path=${mdiPlus}></ha-svg-icon>
      </button>
    </div>`;
  }

  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        user-select: none;
        -webkit-user-select: none;
      }
      .labels,
      .track,
      .ticks {
        margin: 0 10px;
      }
      .labels {
        height: 18px;
        position: relative;
      }
      .labels span {
        color: var(--secondary-text-color);
        font-size: 12px;
        font-variant-numeric: tabular-nums;
        position: absolute;
        transform: translateX(-50%);
        white-space: nowrap;
      }
      .labels span.active {
        color: var(--primary-text-color);
        font-weight: 700;
      }
      .track {
        height: 48px;
        position: relative;
        touch-action: none;
      }
      .bar {
        background: var(--divider-color);
        border-radius: 8px;
        inset: 0;
        overflow: hidden;
        position: absolute;
      }
      .block {
        align-items: center;
        background: var(--block-color);
        border: none;
        border-inline-end: 2px solid var(--ha-card-background, var(--card-background-color, #fff));
        bottom: 0;
        box-sizing: border-box;
        color: var(--shs-block-text, ${unsafeCSS(BLOCK_TEXT)});
        container-type: inline-size;
        cursor: pointer;
        display: flex;
        font: inherit;
        font-size: 13px;
        font-weight: 700;
        justify-content: center;
        overflow: hidden;
        padding: 0;
        position: absolute;
        top: 0;
        white-space: nowrap;
      }
      .block.off {
        font-weight: 500;
      }
      /* Drawn over the bar with a minimum width, so even a 15 minute block shows as selected. */
      .selection {
        border: 3px solid var(--primary-text-color);
        border-radius: 6px;
        bottom: -3px;
        box-sizing: border-box;
        left: calc(var(--center) - max(var(--width), 14px) / 2);
        pointer-events: none;
        position: absolute;
        top: -3px;
        width: max(var(--width), 14px);
      }
      .block:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: -2px;
      }
      .block .text {
        display: flex;
        flex-direction: column;
        line-height: 1.15;
        max-width: 100%;
      }
      .block .name {
        font-size: 11px;
        font-weight: 500;
        overflow: hidden;
        padding: 0 4px;
        text-overflow: ellipsis;
      }
      @container (max-width: 64px) {
        .block .name {
          display: none;
        }
      }
      @container (max-width: 34px) {
        .block span {
          visibility: hidden;
        }
      }
      .name-field {
        align-items: center;
        display: flex;
        gap: 10px;
      }
      .name-field input {
        background: var(--card-background-color, #fff);
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        box-sizing: border-box;
        color: var(--primary-text-color);
        flex: 1;
        font: inherit;
        font-size: 16px;
        height: 36px;
        max-width: 320px;
        min-width: 0;
        padding: 0 10px;
        user-select: text;
        -webkit-user-select: text;
      }
      .name-field input:focus {
        border-color: var(--primary-color);
        outline: none;
      }
      .divider {
        align-items: center;
        background: none;
        border: none;
        cursor: ew-resize;
        display: flex;
        height: 60px;
        justify-content: center;
        padding: 0;
        position: absolute;
        top: -6px;
        touch-action: none;
        transform: translateX(-50%);
        width: 28px;
      }
      .divider span {
        background: var(--ha-card-background, var(--card-background-color, #fff));
        border: 2px solid var(--primary-text-color);
        border-radius: 5px;
        box-sizing: border-box;
        height: 38px;
        width: 8px;
      }
      .divider.active span {
        background: var(--primary-text-color);
        width: 12px;
      }
      .divider:focus-visible span {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
      }
      .now {
        background: var(--primary-color);
        bottom: -4px;
        pointer-events: none;
        position: absolute;
        top: -4px;
        transform: translateX(-1px);
        width: 2px;
      }
      .ticks {
        color: var(--secondary-text-color);
        display: flex;
        font-size: 12px;
        justify-content: space-between;
        margin-top: 6px;
      }
      .hint {
        font-size: 13px;
        margin: 10px 0 0;
      }
      .editor {
        background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
        border: 1px solid var(--divider-color);
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 12px;
        padding: 10px 14px 12px;
      }
      .editor-header {
        align-items: center;
        display: flex;
        gap: 6px;
      }
      .spacer {
        flex: 1;
      }
      .swatch {
        background: var(--block-color);
        border-radius: 3px;
        flex-shrink: 0;
        height: 12px;
        width: 12px;
      }
      .editor {
        container-type: inline-size;
      }
      @container (max-width: 360px) {
        .split-label {
          display: none;
        }
        button.split {
          padding: 0;
          width: 36px;
        }
      }
      .range {
        white-space: nowrap;
        font-size: 14px;
        font-variant-numeric: tabular-nums;
        font-weight: 700;
        min-width: 0;
      }
      .controls {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: 8px 20px;
      }
      .group {
        align-items: center;
        display: flex;
        gap: 6px;
      }
      .temperature {
        font-size: 22px;
        font-variant-numeric: tabular-nums;
        font-weight: 700;
        min-width: 4.2em;
        text-align: center;
      }
      .off {
        align-items: center;
        cursor: pointer;
        display: flex;
        font-size: 13px;
        font-weight: 600;
        gap: 6px;
        margin-inline-start: 4px;
        min-height: 40px;
      }
      .off input {
        accent-color: var(--primary-color);
        height: 18px;
        margin: 0;
        width: 18px;
      }
      /* Phones: one full-width row for the temperature, one each for start and end. */
      @container (max-width: 520px) {
        .controls {
          align-items: stretch;
          flex-direction: column;
          gap: 10px;
        }
        .group {
          width: 100%;
        }
        .group.temp .temperature {
          flex: 1;
        }
        .group.temp button.round {
          height: 48px;
          width: 48px;
        }
        .group.time button.small {
          height: 44px;
          width: 56px;
        }
        .group.time .time-value {
          flex: 1;
          font-size: 16px;
        }
        .group.time .time-label {
          font-size: 13px;
          min-width: 3.6em;
        }
      }
      .time-label {
        font-size: 12px;
        margin-inline-end: 2px;
        min-width: 2.6em;
      }
      .time-value {
        font-size: 13px;
        font-variant-numeric: tabular-nums;
        font-weight: 700;
        min-width: 3.2em;
        text-align: center;
      }
      button.round,
      button.outlined,
      button.plain {
        align-items: center;
        background: var(--ha-card-background, var(--card-background-color, #fff));
        border: 1px solid var(--divider-color);
        color: var(--primary-text-color);
        cursor: pointer;
        display: inline-flex;
        font: inherit;
        font-size: 12px;
        font-weight: 600;
        gap: 4px;
        justify-content: center;
        padding: 0 10px;
      }
      button.round {
        border-radius: 50%;
        height: 40px;
        padding: 0;
        width: 40px;
      }
      button.outlined {
        border-radius: 8px;
        height: 36px;
      }
      button.small {
        padding: 0;
        width: 34px;
      }
      button.icon {
        padding: 0;
        width: 36px;
      }
      button.plain {
        background: none;
        border-color: transparent;
        border-radius: 8px;
        color: var(--secondary-text-color);
        height: 36px;
      }
      button.danger {
        color: var(--error-color);
      }
      button[disabled] {
        cursor: default;
        opacity: 0.4;
      }
      button:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 1px;
      }
      ha-svg-icon {
        --mdc-icon-size: 18px;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    "shs-timeline-editor": TimelineEditor;
  }
}
