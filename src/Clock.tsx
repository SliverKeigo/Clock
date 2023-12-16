import React, {useEffect, useState} from 'react';
import styled from 'styled-components';

interface ClockProps {
  h: number;
  m: number;
  s: number;
  ms: number;
}

const Wrapper = styled.div<ClockProps>`
  background: #333;
  width: 100%;
  height: 100%;

  display: grid;
  place-items: center;

  & circle {
    fill: none;
    cx: 0;
    cy: 0;
    r: 3;
    stroke: #77f;
    stroke-width: 1;
  }

  & circle.tick-mark {
    stroke-dasharray: .1 .9;
    stroke-dashoffset: .05;
    
    
    
  }

  & circle.hours {
    stroke: #0ff;
    stroke-width: 7;
    r: 94;
  }

  & circle.minutes {
    stroke: #07f;
    stroke-width: 3;
    r: 95;
  }

  & line {
    x1: 0;
    x2: 0;
    stroke: #ffffff;
    fill: #ffffff;
    stroke-linecap: round;
  }

  & line.second {
    stroke-width: 1;
    transform: ${x => `rotate(${x.s * 6 + x.ms * 6 / 1000}deg)`};
  }

  & line.minute {
    stroke-width: 3;
    transform: ${x => `rotate(${x.m * 6}deg)`};
  }

  & line.hour {
    stroke-width: 5;
    transform: ${x => `rotate(${x.h * 30 + x.m / 2}deg)`};
  }

`

const Clock = () => (
  <svg xmlns="http://www.w3.org/2000/svg"
       viewBox="-120 -120  240 240">
    <g fill="#61DAFB">
      <circle
        pathLength={"12"}
        className={"tick-mark hours"}/>
      <circle
        pathLength={"60"}
        className={"tick-mark minutes"}/>
      <line y1={15}
            y2={-95}
            className={"hand second"}></line>
      <line y1={10}
            y2={-85}
            className={"hand minute"}></line>
      <line y1={5}
            y2={-75}
            className={"hand hour"}></line>
      <circle

      />
    </g>
  </svg>
)

export default function ClockApp() {
  const [nowTime, SetNowTime] = useState(new Date())

  useEffect(() => {
    const ref = setInterval(() => {
      SetNowTime(new Date())
    }, 100)
    return (() => {
      clearInterval(ref)
    })
  }, [])

  const props: ClockProps = {
    h: nowTime.getHours(),
    m: nowTime.getMinutes(),
    s: nowTime.getSeconds(),
    ms: nowTime.getMilliseconds()
  }

  return (
    <Wrapper {...props}>
      <Clock></Clock>
    </Wrapper>
  );
}

