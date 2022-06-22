"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VirtualizedTreeSelect = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactSelect = _interopRequireWildcard(require("react-select"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Option = _interopRequireDefault(require("./Option"));

var _Constants = _interopRequireDefault(require("./utils/Constants"));

var _reactWindow = require("react-window");

var _Utils = require("./utils/Utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

class VirtualizedTreeSelect extends _react.Component {
  constructor(props, context) {
    super(props, context);
    this._processOptions = this._processOptions.bind(this);
    this.filterOption = this.filterOption.bind(this);
    this._onInputChange = this._onInputChange.bind(this);
    this._filterValues = this._filterValues.bind(this);
    this._onOptionToggle = this._onOptionToggle.bind(this);
    this._removeChildrenFromToggled = this._removeChildrenFromToggled.bind(this);
    this._onOptionSelect = this._onOptionSelect.bind(this);
    this.matchCheck = this.props.matchCheck || this.matchCheckFull;
    this.data = {};
    this.searchString = '';
    this.toggledOptions = [];
    this.state = {
      options: []
    };
    this.select = /*#__PURE__*/_react.default.createRef();
  }

  componentDidMount() {
    this._processOptions();
  }

  componentDidUpdate(prevProps) {
    if (this.props.update > prevProps.update) {
      this._processOptions();
    }
  }

  focus() {
    if (this.select.current) {
      this.select.current.focus();
    }
  }

  blurInput() {
    if (this.select.current) {
      this.select.current.blur();
    }
  }

  _processOptions() {
    this.data = {};
    const keys = [];
    this.props.options.forEach(option => {
      option.expanded = option.expanded === undefined ? this.props.expanded : option.expanded;
      const optionID = option[this.props.valueKey];
      this.data[optionID] = option;
      keys.push(optionID);
    });
    keys.forEach(key => {
      let option = this.data[key];

      if (!option.parent) {
        this._calculateDepth(key, 0, null, new Set());
      }
    });
    let options = [];
    keys.filter(key => this.data[key].depth === 0).forEach(key => {
      this._sort(options, key, new Set());
    }); // Value property is needed for correct rendering of selected options

    options.forEach(option => {
      option.value = option[this.props.valueKey];
    });
    this.setState({
      options
    });
  }

  _calculateDepth(key, depth, parentKey, visited) {
    let option = this.data[key];

    if (!option || visited.has(key)) {
      return;
    }

    visited.add(key);
    option.depth = depth;

    if (!option.parent) {
      option.parent = parentKey;
    }

    option[this.props.childrenKey].forEach(childID => {
      this._calculateDepth(childID, depth + 1, key, visited);
    });
  }

  _sort(sortedArr, key, visited) {
    let option = this.data[key];

    if (!option || visited.has(key)) {
      return;
    }

    visited.add(key);
    sortedArr.push(option);
    option[this.props.childrenKey].forEach(childID => {
      this._sort(sortedArr, childID, visited);
    });
    return sortedArr;
  }

  filterOption(candidate, inputValue) {
    const option = candidate.data;
    inputValue = inputValue.trim().toLowerCase();

    if (inputValue.length === 0) {
      return !option.parent || this.data[option.parent].expanded;
    } else {
      return option.visible;
    }
  }

  _filterValues(searchInput) {
    const matches = [];

    for (let option of this.state.options) {
      if (this.matchCheck(searchInput, (0, _Utils.getLabel)(option, this.props.labelKey, this.props.getOptionLabel))) {
        option.visible = true;
        matches.push(option);
      } else {
        option.visible = false;
      }
    }

    for (let match of matches) {
      while (match.parent !== null) {
        match = this.data[match.parent];
        match.expanded = true;
        match.visible = true;
      }
    }
  }

  matchCheckFull(searchInput, optionLabel) {
    return optionLabel.toLowerCase().indexOf(searchInput.toLowerCase()) !== -1;
  }

  _onInputChange(input) {
    // Make the expensive calculation only when input has been really changed
    if (this.searchString !== input && input.length !== 0) {
      this._filterValues(input);
    }

    this.searchString = input;

    if ("onInputChange" in this.props) {
      this.props.onInputChange(input);
    } // Collapses items which were expanded by the search


    if (input.length === 0) {
      for (let option of this.state.options) {
        option.expanded = !!this.toggledOptions.find(element => element[this.props.valueKey] === option[this.props.valueKey]);
      }
    }
  }

  _removeChildrenFromToggled(option) {
    for (const subTermId of option[this.props.childrenKey]) {
      const subTerm = this.state.options.find(term => term[this.props.valueKey] === subTermId);
      this.toggledOptions = this.toggledOptions.filter(term => term[this.props.valueKey] !== subTermId);

      this._removeChildrenFromToggled(subTerm);
    }
  }

  _onOptionToggle(option) {
    // disables option expansion/collapsion when search string is present
    if (this.searchString !== "") return;

    if ("onOptionToggle" in this.props) {
      this.props.onOptionToggle(option);
    } // Adds/removes references for toggled items


    if (option.expanded) {
      this.toggledOptions.push(option);
    } else {
      this.toggledOptions = this.toggledOptions.filter(el => el[this.props.valueKey] !== option[this.props.valueKey]);

      this._removeChildrenFromToggled(option);
    }
  } //When selecting an option, we want to ensure that the path to it is expanded
  //Path is saved in toggledOptions


  _onOptionSelect(props) {
    props.selectOption(props.data);
    let optionId = props.value;
    const isSelected = props.isSelected;
    if (isSelected) return;
    let option = this.data[optionId];
    let parent = this.data[option.parent];

    while (parent) {
      if (!this.toggledOptions.find(el => el[this.props.valueKey] === parent[this.props.valueKey])) {
        parent.expanded = true;
        this.toggledOptions.push(parent);
      }

      parent = this.data[parent.parent];
    }
  }

  render() {
    const props = this.props;

    const styles = this._prepareStyles();

    const filterOptions = props.filterOptions || this.filterOption;
    const optionRenderer = this.props.optionRenderer || _Option.default;
    return /*#__PURE__*/_react.default.createElement(_reactSelect.default, _extends({
      ref: this.select
    }, props, {
      styles: styles,
      menuIsOpen: this.props.isMenuOpen ? this.props.isMenuOpen : undefined,
      filterOption: filterOptions,
      onInputChange: this._onInputChange,
      getOptionLabel: option => (0, _Utils.getLabel)(option, props.labelKey, props.getOptionLabel),
      components: {
        Option: optionRenderer,
        Menu: Menu,
        MenuList: MenuList
      },
      isMulti: props.multi,
      blurInputOnSelect: false,
      options: this.state.options,
      formatOptionLabel: this.props.valueRenderer,
      autoFocus: true,
      onOptionToggle: this._onOptionToggle,
      onOptionSelect: this._onOptionSelect
    }));
  }

  _prepareStyles() {
    return {
      dropdownIndicator: (provided, state) => _objectSpread(_objectSpread({}, provided), {}, {
        transform: state.selectProps.menuIsOpen && 'rotate(180deg)',
        display: !state.selectProps.isMenuOpen ? 'block' : 'none'
      }),
      indicatorSeparator: (provided, state) => _objectSpread(_objectSpread({}, provided), {}, {
        display: !state.selectProps.isMenuOpen ? 'block' : 'none'
      }),
      noOptionsMessage: (provided, state) => _objectSpread(_objectSpread({}, provided), {}, {
        paddingLeft: '16px'
      }),
      valueContainer: (provided, state) => _objectSpread(_objectSpread({}, provided), {}, {
        display: state.hasValue ? 'flex' : 'inline-grid'
      }),
      input: provided => _objectSpread(_objectSpread({}, provided), {}, {
        input: {
          opacity: "1 !important"
        }
      })
    };
  }

} // Wrapper for MenuList, it doesn't do anything, it is only needed for correct pass of the onScroll prop


exports.VirtualizedTreeSelect = VirtualizedTreeSelect;

const Menu = props => {
  return /*#__PURE__*/_react.default.createElement(_reactSelect.components.Menu, _extends({}, props, {
    innerProps: _objectSpread(_objectSpread({}, props.innerProps), {}, {
      onScrollCapture: e => {
        props.selectProps.listProps.onScroll(e.target);
      }
    })
  }), props.children);
}; // Component for efficient rendering


const MenuList = props => {
  const {
    children,
    maxHeight
  } = props;
  const {
    optionHeight
  } = props.selectProps; // We need to check whether the passed object contains items or loading/empty message

  let values;
  let height;

  if (Array.isArray(children)) {
    values = children;
    height = Math.min(maxHeight, optionHeight * values.length);
  } else {
    values = [/*#__PURE__*/_react.default.createElement(_reactSelect.components.NoOptionsMessage, _extends({}, children.props, {
      children: children.props.children
    }))];
    height = 40;
  }

  return /*#__PURE__*/_react.default.createElement(_reactWindow.FixedSizeList, {
    height: height,
    itemCount: values.length,
    itemSize: optionHeight
  }, ({
    index,
    style
  }) => /*#__PURE__*/_react.default.createElement("div", {
    style: style
  }, values[index]));
};

VirtualizedTreeSelect.propTypes = {
  childrenKey: _propTypes.default.string,
  expanded: _propTypes.default.bool,
  filterOptions: _propTypes.default.func,
  matchCheck: _propTypes.default.func,
  isMenuOpen: _propTypes.default.bool,
  labelKey: _propTypes.default.string,
  getOptionLabel: _propTypes.default.func,
  maxHeight: _propTypes.default.number,
  menuStyle: _propTypes.default.object,
  minHeight: _propTypes.default.number,
  multi: _propTypes.default.bool,
  onInputChange: _propTypes.default.func,
  optionHeight: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.func]),
  optionLeftOffset: _propTypes.default.number,
  optionRenderer: _propTypes.default.func,
  options: _propTypes.default.array,
  renderAsTree: _propTypes.default.bool,
  valueKey: _propTypes.default.string,
  hideSelectedOptions: _propTypes.default.bool
};
VirtualizedTreeSelect.defaultProps = {
  childrenKey: _Constants.default.CHILDREN_KEY,
  labelKey: _Constants.default.LABEL_KEY,
  valueKey: _Constants.default.VALUE_KEY,
  options: [],
  optionHeight: 25,
  optionLeftOffset: 16,
  expanded: false,
  isMenuOpen: false,
  maxHeight: 300,
  minHeight: 0,
  multi: false,
  renderAsTree: true,
  hideSelectedOptions: false
};