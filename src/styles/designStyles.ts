import { css } from 'lit';

export const designStyles = css`
.line {
  /* margin-bottom: 12px; */
  position: relative;
  top: -8px;
}
.line header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Noto Serif JP', serif;
  width: 100%;
  padding-right: 29px;
  box-sizing: border-box;
}
.line header .word {
  font-size: 2em;
}
.line header .second {
  margin-left: 32px;
  /* font-weight: 300; */
}
.line .meaning {
  margin-top: var(--mean-tm, 28px);
  margin-left: 3px;
}

.separator {
  margin-top: var(--sep-vm, 24px);
  margin-bottom: var(--sep-vm, 24px);
  margin-left: var(--sep-hm, 12px);
  margin-right: var(--sep-hm, 12px);
  border-bottom: 1px solid var(--front-color, white);
  opacity: .2;
}
`