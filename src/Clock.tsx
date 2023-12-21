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
    stroke-width: 3;
      //transform: ${x => `rotate(${x.s * 6 + x.ms * 6 / 1000}deg)`};
    //transition: transform 1s linear; // 添加平滑过渡效果
  }

  & line.minute {
    stroke-width: 5;
      // transform: ${x => `rotate(${x.m * 6}deg)`};
    //transition: transform 0.1s linear; // 添加平滑过渡效果
  }

  & line.hour {
    stroke-width: 7;
      // transform: ${x => `rotate(${x.h * 30 + x.m / 2}deg)`};
    //transition: transform 0.1s linear; // 添加平滑过渡效果
  }

  .hand:hover {
    cursor: pointer;
  }


`;

const Clock = ({h, m, s, ms, isNightMode}: ClockProps) => {

  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const milliseconds = now.getMilliseconds();
  const [hoveredHand, setHoveredHand] = useState(null); // 'hour', 'minute', 'second' 或 null

  const handleMouseEnter = ({handType}: { handType: any }) => {
    setHoveredHand(handType);
  };

  const handleMouseLeave = () => {
    setHoveredHand(null);
  };

  // 计算时针的初始角度
  const initialHourHandAngle = ((hours % 12) * 30) + (minutes * 0.5);
  // 计算分针的初始角度
  const initialMinuteHandAngle = minutes * 6 + seconds * 0.1;

  // 计算秒针的当前角度
  // let secondHandAngle = (seconds + milliseconds / 1000) * 6;
  // 使用 useState 钩子来保存 secondHandAngle 变量的值
  const [secondHandAngle, setSecondHandAngle] = useState((seconds + milliseconds / 1000) * 6);
// 设置秒针的样式
  const secondHandStyle = {
    transform: `rotate(${secondHandAngle}deg)`,
    transition: 'transform 1s linear', // 秒针平滑过渡
    // animation: `smoothSecondHand 1s linear infinite`
  };

  // useEffect 钩子
  useEffect(() => {
    // 使用 setInterval() 函数每过一秒更新秒针的角度
    const interval = setInterval(() => {
      // 更新秒针的角度
      setSecondHandAngle(secondHandAngle + 6);
    }, 1000);

    // 销毁定时器
    return () => {
      clearInterval(interval);
    };

  }, [secondHandAngle]);
  // 处理当前标签页的状态变化
  useEffect(() => {
    // 监听当前标签页获得焦点事件
    window.addEventListener('focus', handleFocus);

    // 返回销毁监听器的函数
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  function handleFocus() {
    // 如果当前标签页从隐藏状态切换到可见状态
    if (document.visibilityState === 'visible') {
      // 刷新页面
      // 不再直接使用 location
      window.location.reload();
    }
  }

  // useEffect 钩子
  useEffect(() => {
    // 监听当前标签页的状态
    window.addEventListener('visibilitychange', handleVisibilityChange);

    // 返回销毁监听器的函数
    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // 处理当前标签页的状态变化
  function handleVisibilityChange() {
    // 如果当前标签页从隐藏状态切换到可见状态
    if (document.visibilityState === 'visible') {
      // 刷新页面
      // 不再直接使用 location
      window.location.reload();
    }
  }

  const hourHandStyle = {
    transform: `rotate(${initialHourHandAngle}deg)`,
    transition: 'transform 1s linear' // 时针平滑过渡
  };

  const minuteHandStyle = {
    transform: `rotate(${initialMinuteHandAngle}deg)`,
    transition: 'transform 1s linear' // 分针平滑过渡
  };

  // 计算每个小时数字的位置
  const renderHourMarks = () => {
    const marks = [];
    const radius = 78; // 半径值
    for (let i = 0; i < 12; i++) {
      const angle = Math.PI / 6 * (i - 3); // 24小时制，每个小时间隔为15°
      const x = radius * Math.cos(angle); // 根据圆的半径和角度计算 x 坐标
      const y = radius * Math.sin(angle); // 根据圆的半径和角度计算 y 坐标
      // 每3小时加粗字体
      const isHourMark = i % 3 === 0;
      marks.push(
        <text key={i}
              style={{
                fontFamily: "'Microsoft YaHei', monospace",
                userSelect: "none", // 防止文本被选中
                // cursor: "default",  // 可以设置为默认光标

              }}

              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={isHourMark ? "8" : "6"} // 加粗的字体稍大
              fontWeight={isHourMark ? "bold" : "normal"} // 加粗
              fill={isNightMode ? '#FFF0F5' : 'black'}>
          {i == 0 ? 12 : i}
        </text>
      );
    }
    return marks;
  };
  const renderMinuteMarks = () => {
    const marks = [];
    const radius = 90; // 可以选择一个适合的半径
    for (let i = 0; i < 60; i++) {
      // 每分钟间隔为6°
      const angle = Math.PI / 30 * (i - 15); // 调整角度，使12点位置为0度
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      // 每5分钟加粗字体
      const isMinuteMark = i % 5 === 0;
      marks.push(
        <text key={i}
              style={{
                fontFamily: "'Microsoft YaHei', monospace",
                userSelect: "none", // 防止文本被选中
                // cursor: "default",  // 可以设置为默认光标
              }}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={isMinuteMark ? "6" : "4"} // 加粗的字体稍大
              fontWeight={isMinuteMark ? "bold" : "normal"} // 加粗
              fill={isNightMode ? '#FFF0F5' : 'black'}>
          {/*{i % 5 == 0 ? i / 5 == 0 ? 12 : i / 5 : i}*/}
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
        {/* 秒针 */}
        <line y1={15}
              y2={-94}
              className={`hand second ${isNightMode ? 'night-second' : 'day-second'}`}
              style={secondHandStyle}
              onMouseEnter={() => handleMouseEnter({handType: 'second'})}
              onMouseLeave={handleMouseLeave}

        />
        {/* 时针 */}
        <line y1={5}
              y2={-70}
              className={`hand hour ${isNightMode ? 'night-hour' : 'day-hour'}`}
              style={hourHandStyle}
              onMouseEnter={() => handleMouseEnter({handType: 'hour'})}
              onMouseLeave={handleMouseLeave}
        />
        {/* 分针 */}
        <line y1={10}
              y2={-88}
              className={`hand minute ${isNightMode ? 'night-minute' : 'day-minute'}`}
              style={minuteHandStyle}
              onMouseEnter={() => handleMouseEnter({handType: 'minute'})}
              onMouseLeave={handleMouseLeave}
        />
        <circle className={`center-circle ${isNightMode ? 'night-mode' : ''}`}/>
        // 时
        <text x="-13"
              y="-105"
              style={{
                fontFamily: "'Microsoft YaHei', monospace",
                userSelect: "none", // 防止文本被选中
                // cursor: "default",  // 可以设置为默认光标
              }}
              textAnchor="middle"
              dominantBaseline="central"
              className={`center-text ${isNightMode ? 'night-mode' : ''}`}
              fontSize="8"
              fill={hoveredHand === 'hour' ? '#4169E1' : '#C0C0C0'}>
          {h.toString().padStart(2, '0')}
        </text>
        <text x="-6.5"
              y="-106"
              style={{
                fontFamily: "'Microsoft YaHei', monospace",
                userSelect: "none", // 防止文本被选中
                // cursor: "default",  // 可以设置为默认光标
              }}
              textAnchor="middle"
              dominantBaseline="central"
              className={`center-text ${isNightMode ? 'night-mode' : ''}`}
              fontSize="8"
              fill={'#C0C0C0'}
        >
          {":"}
        </text>
        // 分
        <text x="0"
              y="-105"
              style={{
                fontFamily: "'Microsoft YaHei', monospace",
                userSelect: "none", // 防止文本被选中
                // cursor: "default",  // 可以设置为默认光标

              }}
              textAnchor="middle"
              dominantBaseline="central"
              className={`center-text ${isNightMode ? 'night-mode' : ''}`}
              fontSize="8"
              fill={hoveredHand === 'minute' ? '#4169E1' : '#C0C0C0'}> {/* 使用动态颜色 */}
          {m.toString().padStart(2, '0')}
        </text>
        <text x="6.5"
              y="-106"
              style={{
                fontFamily: "'Microsoft YaHei', monospace",
                userSelect: "none", // 防止文本被选中
                // cursor: "default",  // 可以设置为默认光标
              }}
              textAnchor="middle"
              dominantBaseline="central"
              className={`center-text ${isNightMode ? 'night-mode' : ''}`}
              fontSize="8"
              fill={'#C0C0C0'}
        >
          {":"}
        </text>
        // 秒
        <text x="13"
              y="-105"
              style={{
                fontFamily: "'Microsoft YaHei', monospace",
                userSelect: "none", // 防止文本被选中
                // cursor: "default",  // 可以设置为默认光标
              }}
              textAnchor="middle"
              dominantBaseline="central"
              className={`center-text ${isNightMode ? 'night-mode' : ''}`}
              fontSize="8"
              fill={hoveredHand === 'second' ? '#4169E1' : '#C0C0C0'}> {/* 使用动态颜色 */}
          {s.toString().padStart(2, '0')}
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