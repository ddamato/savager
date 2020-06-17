export const WINDOW_FN_REFERENCE = 'svgInjectionManager';
const INJECTION_ANIMATION_NAME = 'nodeDetected';
const injectionString = `window.${WINDOW_FN_REFERENCE} && window.${WINDOW_FN_REFERENCE}.replace(this)`;

export const injectionStyle = `<style>@keyframes ${INJECTION_ANIMATION_NAME} { to { opacity: 1; } }</style>`;
export const injectionAttrs = {
  style: `animation: ${INJECTION_ANIMATION_NAME} .1ms`,
  onanimationstart: injectionString,
  onerror: injectionString,
}
