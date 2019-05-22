import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import XDate from 'xdate';
import PropTypes from 'prop-types';
import styleConstructor from './style';
import { weekDayNames } from '../../dateutils';
import {
  CHANGE_MONTH_LEFT_ARROW,
  CHANGE_MONTH_RIGHT_ARROW,
  CHANGE_MONTH_LEFT_DOUBLE_ARROW,
  CHANGE_MONTH_RIGHT_DOUBLE_ARROW
} from '../../testIDs';

class CalendarHeader extends Component {
  static propTypes = {
    theme: PropTypes.object,
    hideArrows: PropTypes.bool,
    month: PropTypes.instanceOf(XDate),
    addMonth: PropTypes.func,
    showIndicator: PropTypes.bool,
    firstDay: PropTypes.number,
    renderArrow: PropTypes.func,
    renderDoubleArrow: PropTypes.func,
    hideDayNames: PropTypes.bool,
    weekNumbers: PropTypes.bool,
    onPressArrowLeft: PropTypes.func,
    onPressArrowRight: PropTypes.func,
    onPressDoubleArrowLeft: PropTypes.func,
    onPressDoubleArrowRight: PropTypes.func
  };

  static defaultProps = {
    monthFormat: 'MMMM yyyy',
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);
    this.addMonth = this.addMonth.bind(this);
    this.substractMonth = this.substractMonth.bind(this);
    this.onPressLeft = this.onPressLeft.bind(this);
    this.onPressRight = this.onPressRight.bind(this);
    this.addYear = this.addYear.bind(this);
    this.substractYear = this.substractYear.bind(this);
    this.onPressDoubleLeft = this.onPressDoubleLeft.bind(this);
    this.onPressDoubleRight = this.onPressDoubleRight.bind(this);
  }

  addMonth() {
    this.props.addMonth(1);
  }

  substractMonth() {
    this.props.addMonth(-1);
  }

  addYear() {
    this.props.addMonth(12);
  }

  substractYear() {
    this.props.addMonth(-12);
  }

  shouldComponentUpdate(nextProps) {
    if (
      nextProps.month.toString('yyyy MM') !==
      this.props.month.toString('yyyy MM')
    ) {
      return true;
    }
    if (nextProps.showIndicator !== this.props.showIndicator) {
      return true;
    }
    if (nextProps.hideDayNames !== this.props.hideDayNames) {
      return true;
    }
    return false;
  }

  onPressLeft() {
    const {onPressArrowLeft} = this.props;
    if(typeof onPressArrowLeft === 'function') {
      return onPressArrowLeft(this.substractMonth);
    }
    return this.substractMonth();
  }

  onPressRight() {
    const {onPressArrowRight} = this.props;
    if(typeof onPressArrowRight === 'function') {
      return onPressArrowRight(this.addMonth);
    }
    return this.addMonth();
  }

  onPressDoubleLeft() {
    const {onPressDoubleArrowLeft} = this.props;
    if(typeof onPressDoubleArrowLeft === 'function') {
      return onPressDoubleArrowLeft(this.substractYear);
    }
    return this.substractYear();
  }

  onPressDoubleRight() {
    const {onPressDoubleArrowRight} = this.props;
    if(typeof onPressDoubleArrowRight === 'function') {
      return onPressDoubleArrowRight(this.addYear);
    }
    return this.addYear();
  }

  render() {
    let leftArrow = <View />;
    let rightArrow = <View />;
    let leftDoubleArrow = <View />;
    let rightDoubleArrow = <View />;
    let weekDaysNames = weekDayNames(this.props.firstDay);
    if (!this.props.hideArrows) {
      leftArrow = (
        <TouchableOpacity
          onPress={this.onPressLeft}
          style={this.style.arrow}
          hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
          testID={CHANGE_MONTH_LEFT_ARROW}
        >
          {this.props.renderArrow
            ? this.props.renderArrow('left')
            : <Image
                source={require('../img/previous.png')}
                style={this.style.arrowImage}
              />}
        </TouchableOpacity>
      );
      rightArrow = (
        <TouchableOpacity
          onPress={this.onPressRight}
          style={this.style.arrow}
          hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
          testID={CHANGE_MONTH_RIGHT_ARROW}
        >
          {this.props.renderArrow
            ? this.props.renderArrow('right')
            : <Image
                source={require('../img/next.png')}
                style={this.style.arrowImage}
              />}
        </TouchableOpacity>
      );
      leftDoubleArrow = (
        <TouchableOpacity
          onPress={this.onPressDoubleLeft}
          style={this.style.arrow}
          hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
          testID={CHANGE_MONTH_LEFT_DOUBLE_ARROW}
        >
          {this.props.renderDoubleArrow
            ? this.props.renderDoubleArrow('left')
            : <Image
              source={require('../img/previousprevious.png')}
              style={this.style.arrowImage}
            />}
        </TouchableOpacity>
      );
      rightDoubleArrow = (
        <TouchableOpacity
          onPress={this.onPressDoubleRight}
          style={this.style.arrow}
          hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
          testID={CHANGE_MONTH_RIGHT_DOUBLE_ARROW}
        >
          {this.props.renderDoubleArrow
            ? this.props.renderDoubleArrow('right')
            : <Image
              source={require('../img/nextnext.png')}
              style={this.style.arrowImage}
            />}
        </TouchableOpacity>
      );
    }
    let indicator;
    if (this.props.showIndicator) {
      indicator = <ActivityIndicator color={this.props.theme && this.props.theme.indicatorColor} />;
    }
    return (
      <View>
        <View style={this.style.header}>
          {leftDoubleArrow}
          {leftArrow}
          <View style={{ flexDirection: 'row' }}>
            <Text allowFontScaling={false} style={this.style.monthText} accessibilityTraits='header'>
              {this.props.month.toString(this.props.monthFormat)}
            </Text>
            {indicator}
          </View>
          {rightArrow}
          {rightDoubleArrow}
        </View>
        {
          !this.props.hideDayNames &&
          <View style={this.style.week}>
            {this.props.weekNumbers && <Text allowFontScaling={false} style={this.style.dayHeader}></Text>}
            {weekDaysNames.map((day, idx) => (
              <Text allowFontScaling={false} key={idx} accessible={false} style={this.style.dayHeader} numberOfLines={1} importantForAccessibility='no'>{day}</Text>
            ))}
          </View>
        }
      </View>
    );
  }
}

export default CalendarHeader;
