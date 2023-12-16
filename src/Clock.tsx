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

  // 亮色模式下的颜色
  & .day-second {
    stroke: grey; // 亮色模式下的灰色
  }

  & .day-minute {
    stroke: darkgrey;
  }

  & .day-hour {
    stroke: dimgrey;
  }


  // 暗色模式下的颜色
  & .night-second, & .night-minute, & .night-hour {
    stroke: #E0E0E0; // 暗色模式下稍亮的白色
  }

  & line.second {
    stroke-width: 1;
      //transform: ${x => `rotate(${x.s * 6 + x.ms * 6 / 1000}deg)`};
    transition: transform 1s linear; // 添加平滑过渡效果
  }

  & line.minute {
    stroke-width: 3;
      // transform: ${x => `rotate(${x.m * 6}deg)`};
    transition: transform 0.1s linear; // 添加平滑过渡效果
  }

  & line.hour {
    stroke-width: 5;
      // transform: ${x => `rotate(${x.h * 30 + x.m / 2}deg)`};
    transition: transform 0.1s linear; // 添加平滑过渡效果
  }

`;

const Clock = ({h, m, s, ms, isNightMode}: ClockProps) => {

  // React 组件中的状态和效果
  const [secondHandAngle, setSecondHandAngle] = useState(() => {
    const now = new Date();
    return now.getSeconds() * 6; // 初始化角度，每秒6度
  });
  const [minuteHandAngle, setMinuteHandAngle] = useState(() => {
    const now = new Date();
    return now.getMinutes() * 6; // 每分钟6度
  });

  const [hourHandAngle, setHourHandAngle] = useState(() => {
    const now = new Date();
    // 24小时制，每小时15度，每分钟额外增加0.25度
    return (now.getHours() * 15) + (now.getMinutes() * 0.25);
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      // 每秒增加6度
      setSecondHandAngle(prevAngle => prevAngle + 6);
      // 每分钟增加0.1度
      setMinuteHandAngle(prevAngle => prevAngle + 0.1);
      // 每小时增加15度，所以每分钟增加15 / 60 = 0.25度
      setHourHandAngle(prevAngle => prevAngle + 0.25);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // 计算每个小时数字的位置
  const renderHourMarks = () => {
    const marks = [];
    const radius = 98; // 半径值
    for (let i = 0; i < 24; i++) {
      const angle = Math.PI / 12 * (i - 6); // 24小时制，每个小时间隔为15°
      const x = radius * Math.cos(angle); // 根据圆的半径和角度计算 x 坐标
      const y = radius * Math.sin(angle); // 根据圆的半径和角度计算 y 坐标
      // 每3小时加粗字体
      const isHourMark = i % 3 === 0;
      marks.push(
        <text key={i}
              style={{fontFamily: "'JetBrains Mono', monospace"}}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={isHourMark ? "10" : "8"} // 加粗的字体稍大
              fontWeight={isHourMark ? "bold" : "normal"} // 加粗
              fill={isNightMode ? '#FFF0F5' : 'black'}>
          {i}
        </text>
      );
    }
    return marks;
  };
  const renderMinuteMarks = () => {
    const marks = [];
    const radius = 110; // 可以选择一个适合的半径
    for (let i = 0; i < 60; i++) {
      // 每分钟间隔为6°
      const angle = Math.PI / 30 * (i - 15); // 调整角度，使12点位置为0度
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      // 每5分钟加粗字体
      const isMinuteMark = i % 5 === 0;
      marks.push(
        <text key={i}
              style={{fontFamily: "'JetBrains Mono', monospace"}}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={isMinuteMark ? "8" : "6"} // 加粗的字体稍大
              fontWeight={isMinuteMark ? "bold" : "normal"} // 加粗
              fill={isNightMode ? '#FFF0F5' : 'black'}>
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
        {renderMinuteMarks()}
        {/*<circle*/}
        {/*  pathLength={"12"}*/}
        {/*  className={`tick-mark hours ${isNightMode ? 'night-mode' : ''}`}/>*/}
        {/*<circle*/}
        {/*  pathLength={"60"}*/}
        {/*  className={`tick-mark minutes ${isNightMode ? 'night-mode' : ''}`}/>*/}
        <line y1={15}
              y2={-105}
              className={`hand second ${isNightMode ? 'night-second' : 'day-second'}`}
              style={{transform: `rotate(${secondHandAngle}deg)`}}></line>
        <line y1={10}
              y2={-105}
              className={`hand minute ${isNightMode ? 'night-minute' : 'day-minute'}`}
              style={{transform: `rotate(${minuteHandAngle}deg)`}}></line>
        <line y1={5}
              y2={-88}
              className={`hand hour ${isNightMode ? 'night-hour' : 'day-hour'}`}
              style={{transform: `rotate(${hourHandAngle}deg)`}}></line>

        <circle className={`center-circle ${isNightMode ? 'night-mode' : ''}`}/>
        <text x="0"
              y="-40"
              style={{fontFamily: "'JetBrains Mono', monospace"}}
              textAnchor="middle"
              dominantBaseline="central"
              className={`center-text ${isNightMode ? 'night-mode' : ''}`}
              fontSize="10"
              fill={isNightMode ? '#FFF0F5' : '#696969'}>
          {`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`}
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