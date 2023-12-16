import React, {useEffect, useState} from 'react';
import styled, {css} from 'styled-components';

interface ClockProps {
  h: number;
  m: number;
  s: number;
  ms: number;
  isNightMode: boolean;
}

const Wrapper = styled.div<ClockProps>`

  width: 100vh;
  height: 100vh;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  overflow: hidden;

  display: grid;
  place-items: center;

  ${({isNightMode}) => isNightMode && css`
    background: #282c34;

    .tick-mark,
    .tick-mark.hours,
    .tick-mark.minutes {
      stroke: #F0F8FF;
    }

    .center-circle {
      stroke: gray; // 夜间模式颜色
    }

    .hand {
      stroke: #F0F8FF;
    }
  `}
  & circle {
    fill: none;
    cx: 0;
    cy: 0;
    r: 3;
    stroke: #eee; // 默认颜色
    stroke-width: 1;

    ${({isNightMode}) => isNightMode && css`
      stroke: gray; // 夜间模式颜色
    `}
  }

  & circle.tick-mark {
    stroke-dasharray: .1 .9;
    stroke-dashoffset: .05;
    stroke: gray; // 默认颜色
  }

  & circle.hours {
    stroke: gray; // 默认颜色
    stroke-width: 5;
    r: 94;
  }

  & circle.minutes {
    stroke: gray; // 默认颜色
    stroke-width: 3;
    r: 95;
  }

  & line {
    x1: 0;
    x2: 0;
    stroke: gray;
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

`;

const Clock = ({h, m, s, ms, isNightMode}: ClockProps) => {
  // 计算每个小时数字的位置
  const renderHourMarks = () => {
    const marks = [];
    const radius: number = 85; // 更新半径值为90
    for (let i = 1; i <= 12; i++) {
      const angle = Math.PI / 6 * (i - 3); // 将 12 点位置定为 0 度
      const x = radius * Math.cos(angle); // 根据圆的半径和角度计算 x 坐标
      const y = radius * Math.sin(angle); // 根据圆的半径和角度计算 y 坐标
      marks.push(
        <text key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="10"
              fill={isNightMode ? '#FFF0F5' : 'gray'}>
          {i}
        </text>
      );
    }
    return marks;
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg"
         viewBox="-120 -120  240 240">

      <g fill="#fff">
        {renderHourMarks()}
        {/*<circle*/}
        {/*  pathLength={"12"}*/}
        {/*  className={`tick-mark hours ${isNightMode ? 'night-mode' : ''}`}/>*/}
        {/*<circle*/}
        {/*  pathLength={"60"}*/}
        {/*  className={`tick-mark minutes ${isNightMode ? 'night-mode' : ''}`}/>*/}
      <line y1={15}
            y2={-95}
            className={`hand second ${isNightMode ? 'night-mode' : ''}`}
            style={{transform: `rotate(${s * 6 + ms * 6 / 1000}deg)`}}></line>
      <line y1={10}
            y2={-85}
            className={`hand minute ${isNightMode ? 'night-mode' : ''}`}
            style={{transform: `rotate(${m * 6}deg)`}}></line>
      <line y1={5}
            y2={-75}
            className={`hand hour ${isNightMode ? 'night-mode' : ''}`}
            style={{transform: `rotate(${h * 30 + m / 2}deg)`}}></line>
        <circle className={`center-circle ${isNightMode ? 'night-mode' : ''}`}/>
        <text x="0"
              y="-40"
              textAnchor="middle"
              dominantBaseline="central"
              className={`center-text ${isNightMode ? 'night-mode' : ''}`}
              fontSize="10"
              fill={isNightMode ? '#FFF0F5' : '#696969'}>
          {`${h}:${m}:${s}`}
        </text>
    </g>
    </svg>);

};

export default function ClockApp() {

  const [nowTime, setNowTime] = useState(new Date());
  const [isNightMode, setIsNightMode] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setNowTime(new Date());
    }, 100);
    return () => clearInterval(timer);
  }, []);

  function toggleNightMode() {
    setIsNightMode(mode => !mode);
  }

  // 构建 props 对象
  const clockProps: ClockProps = {
    h: nowTime.getHours(),
    m: nowTime.getMinutes(),
    s: nowTime.getSeconds(),
    ms: nowTime.getMilliseconds(),
    isNightMode: isNightMode
  };

  return (
    <Wrapper {...clockProps}>
      <button onClick={toggleNightMode}>切换模式</button>
      <Clock {...clockProps}/>
    </Wrapper>
  );
}