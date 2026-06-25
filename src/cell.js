import React, { Component } from 'react'
import cn from 'classnames'

const Cell=React.forwardRef((props,ref)=>{
    const classes = cn(
    props.classes.cell,
    props.level,
    props.type,
    { selected: props.selected },
    { today: props.today },
    { 'outside-range': !props.invalid },
  )

  return (
    <div
    ref={ref}
      className={classes}
      onClick={() => props.onClick(props.moment)}
    >
      {props.label}
    </div>
  )

})
    