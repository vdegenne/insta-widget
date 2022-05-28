import { css } from 'lit';

export const globalStyles = css`
:host {
  --notice-color: yellow;
  --hl-color: orange;


  --logo-color-1: #0604d7;
  --logo-color-2: #ffecb6;
  --logo-color-3: #c62829;
  --logo-color-4: black;
}
[flex], .flex {
  display: flex;
  justify-content: center;
  align-items: center;
}
[column], .column {
  display: flex;
  /* align-items: initial; */
  flex-direction: column;
}
[between], .between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
[fullwidth], .fullwidth {
  width: 100%;
  /* flex: 1; */
}
[jp], .jp {
  font-family: 'Noto Serif JP', serif;
  /* font-family: 'Zen Maru Gothic', sans-serif; */
  /* font-family: 'Zen Kurenaido', sans-serif; */
}
[big], .big {
  font-size: 2em;
}
[huge], .huge {
  font-size: 3em;
}

*:not([hl]) > [notice], *:not([hl]) > .notice {
  /* color: #ffc107; */
  color: var(--notice-color);
}
[hl], .hl {
  color: var(--hl-color) !important;
}
[underline], .underline {
  text-decoration: underline;
}
[center], .center {
  text-align: center;
}
[transition], .transition {
  transition: color .5s linear;
}
w-span {
  /* transition: color .7s linear; */
}
w-sep:last-of-type {
  margin: 0;
  border: none;
}
`