import React from 'react'
import jss from 'jss'

export default function createStyledComponent(Component, rules, options) {
  function attach(rules, options) {
    return jss.createStyleSheet(rules, options).attach()
  }

  function makeUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      let r = (Math.random() * 16) | 0
      let v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  class StyledComponent extends React.Component {
    constructor(props) {
      super(props)
      let uuid = this.props.instance ? this.props.instance : makeUUID()
      let _rules = typeof rules === 'function' ? rules(this.props, uuid) : rules
      let _options = typeof options === 'function'
        ? options(this.props, uuid)
        : options

      this.sheet = attach(_rules, _options)
      this.uuid = uuid
    }

    componentDidUpdate(prevProps) {
      if (this.props !== prevProps) {
        let _rules = typeof rules === 'function'
          ? rules(this.props, this.uuid)
          : rules
        let _options = typeof options === 'function'
          ? options(this.props, this.uuid)
          : options

        this.sheet.detach()
        this.sheet = attach(_rules, _options)
      }
    }

    componentWillUnmount() {
      this.sheet.detach()
      this.sheet = null
    }

    classSet = classNames => {
      return Object.keys(classNames)
        .filter(className => classNames[className])
        .map(className => this.sheet.classes[className] || className)
        .join(' ')
    }

    render() {
      const { forwardedRef, ...rest } = this.props
      return (
        <Component
          instance={this.uuid}
          ref={forwardedRef}
          classes={this.sheet.classes}
          classSet={this.classSet}
          {...rest}
        />
      )
    }
  }

  function StyledComponentWithForwardedRef(props, ref) {
    return <StyledComponent {...props} forwardedRef={ref} />
  }

  return React.forwardRef(StyledComponentWithForwardedRef)
}
